using Ganss.Xss;
using HandlebarsDotNet;
using Microsoft.EntityFrameworkCore;
using Resend;
using RomanHuntWebsite.Server.Data;
using RomanHuntWebsite.Server.General;
using SkiaSharp;
using System.Net.Mail;
using System.Security.Cryptography;
using System.Text;


namespace RomanHuntWebsite.Server
{
    public interface IBaseManager
    {
        Task<General.TestClass> GetTestMethodAsync();
        Task<General.NewUserReturn> SaveNewUserAsync(General.NewUserSubmit model);
        Task<General.LoginReturn> VerifyLoginAsync(General.LoginSubmit model);
        Task<General.AccountEmailReturn> SendUserEmailAsync(General.AccountEmailSubmit model);
        Task<General.ChangePasswordReturn> ResetPasswordAsync(General.ChangePasswordSubmit model);
        Task<General.GetChatFolderReturn> GetChatFolderAsync(General.GetChatFolderSubmit model);
        Task<General.GetChatFolderReturn> CreateChatFolderAsync(CreateChatFolderSubmit model);
        Task<General.GetChatReturn> GetChatAsync(General.GetChatSubmit model);
        Task<General.CreateChatReturn> CreateChatAsync(General.CreateChatSubmit model);
        Task<General.GetChatReturn> CreateMessageAsync(General.CreateChatMessageSubmit model);
        Task<GetChatFolderRoot> GetChatFolderRootAsync(GetChatFolderSubmit model);
        Task<SetAvatarReturn> UploadAvatarAsync(int userId, IFormFile file);
        Task<UserSettings> GetUserSettingsAsync(int userId);
        Task<UserSettingsSubmitResult> SaveUserSettingsAsync(UserSettingsSubmit model);
    }

    public class BaseManager : IBaseManager
    {
        private readonly AppDbContext _dataContext;
        private readonly Microsoft.AspNetCore.Identity.PasswordHasher<Data.Models.User> _passwordHasher;
        private readonly IResend _resend;
        private readonly IConfiguration _configuration;

        public BaseManager(AppDbContext context, IResend resend, IConfiguration configuration)
        {
            _dataContext = context;
            _passwordHasher = new();
            _resend = resend;
            _configuration = configuration;

        }

        public async Task<General.TestClass> GetTestMethodAsync()
        {
            var dataTest = await _dataContext.ProjectItems
                .Select(o => new General.TestObj()
                {
                    Description = o.Description,
                    Title = o.Title,
                }).ToListAsync();

            return new General.TestClass()
            {
                Objects = dataTest
            };
        }

        public async Task<General.NewUserReturn> SaveNewUserAsync(General.NewUserSubmit model)
        {
            if (string.IsNullOrWhiteSpace(model.Email))
            {
                return new General.NewUserReturn()
                {
                    Successful = false,
                    ResponseMessage = "Missing email address"
                };
            }
            if (string.IsNullOrWhiteSpace(model.UserName))
            {
                return new General.NewUserReturn()
                {
                    Successful = false,
                    ResponseMessage = "Missing username"
                };
            }
            if (string.IsNullOrWhiteSpace(model.Password))
            {
                return new General.NewUserReturn()
                {
                    Successful = false,
                    ResponseMessage = "Missing password"
                };
            }

            try
            {
                // Try to parse the email address
                var mailAddress = new MailAddress(model.Email);

                if (mailAddress.Address != model.Email)
                {
                    return new General.NewUserReturn()
                    {
                        Successful = false,
                        ResponseMessage = "Invalid email address"
                    };
                }

            }
            catch (FormatException)
            {
                return new General.NewUserReturn()
                {
                    Successful = false,
                    ResponseMessage = "Invalid email address"
                };
            }

            var existingMatch = await _dataContext.Users
                .Where(o => o.IsActive && (o.Username == model.UserName || o.Email == model.Email))
                .Select(o => new
                {
                    EmailMatch = o.Email == model.Email,
                    UserNameMatch = o.Username == model.UserName
                }).FirstOrDefaultAsync();

            if (existingMatch != null)
            {
                return new General.NewUserReturn()
                {
                    Successful = false,
                    ResponseMessage = existingMatch.EmailMatch == true ? "Email address already in use" : "User name already exists"
                };
            }

            var newUser = new Data.Models.User()
            {
                Email = model.Email ?? string.Empty,
                Username = model.UserName ?? string.Empty,
                IsActive = true
            };

            string hashedPassword = _passwordHasher.HashPassword(newUser, model.Password ?? string.Empty);
            newUser.PasswordHash = hashedPassword;

            _dataContext.Users.Add(newUser);
            await _dataContext.SaveChangesAsync();

            return new General.NewUserReturn()
            {
                ResponseMessage = "User successfully saved. You may now log in.",
                Successful = true,
            };
        }

        public async Task<General.LoginReturn> VerifyLoginAsync(General.LoginSubmit model)
        {
            var response = new General.LoginReturn();

            // 1. Fetch user from MySQL
            var user = await _dataContext.Users
                .Where(o => o.IsActive)
                .FirstOrDefaultAsync(u => u.Username == model.UserName && u.IsActive);

            if (user == null)
            {
                response.ResponseMessage = "Invalid username or password";
                return response;
            }

            // 2. Verify the password hash
            var verificationResult = _passwordHasher.VerifyHashedPassword(user, user.PasswordHash, model.Password ?? string.Empty);

            // 3. Evaluate the result
            if (verificationResult == Microsoft.AspNetCore.Identity.PasswordVerificationResult.Failed)
            {
                response.ResponseMessage = "Invalid username or password";
                return response;
            }

            // Note: SuccessRehashNeeded means the password is valid, but the system's global 
            // hashing settings (like iterations) changed, so it's a good idea to re-save the hash.
            if (verificationResult == Microsoft.AspNetCore.Identity.PasswordVerificationResult.SuccessRehashNeeded)
            {
                user.PasswordHash = _passwordHasher.HashPassword(user, model.Password ?? string.Empty);
                await _dataContext.SaveChangesAsync();
            }

            response.Successful = true;
            response.UserId = user.Id.ToString();
            response.UserName = user.Username;
            response.ResponseMessage = "Login successful";

            return response;
        }

        public async Task<General.AccountEmailReturn> SendUserEmailAsync(General.AccountEmailSubmit model)
        {
            var response = new General.AccountEmailReturn()
            {
                ResponseMessage = "If your email address is associated with an active account, an account recovery email will be sent to it shortly."
            };

            try
            {
                var match = await _dataContext.Users
                    .Where(o => o.IsActive && o.Email == model.Email)
                    .FirstOrDefaultAsync();

                if (match != null)
                {
                    if (model.ForgotPassword)
                    {
                        // Send Forgot Password email

                        byte[] tokenBytes = RandomNumberGenerator.GetBytes(32);

                        string token = Convert.ToBase64String(tokenBytes)
                            .TrimEnd('=')
                            .Replace('+', '-')
                            .Replace('/', '_');


                        string tokenHash = Convert.ToHexString(
                            SHA256.HashData(Encoding.UTF8.GetBytes(token)));

                        var newResetToken = new Data.Models.PasswordResetToken()
                        {
                            IsUsed = false,
                            UserId = match.Id,
                            TokenHash = tokenHash,
                            ExpiresAt = DateTime.Now.AddMinutes(30)
                        };

                        _dataContext.PasswordResetTokens.Add(newResetToken);
                        await _dataContext.SaveChangesAsync();

                        //                        var url = $"<a href=\"{_configuration["Email:Domain"]}/reset-password?token={token}\">here</a>";

                        var url = $"{_configuration["Email:Domain"]}/reset-password?token={token}";

                        var message = new EmailMessage
                        {
                            From = _configuration["Email:From"] ?? string.Empty,
                            To = match.Email,
                            Subject = "Reset password",
                            HtmlBody =
                                "<p>Hello,</p>" +
                                $"<p><a href=\"{url}\">Click here to reset your password</a>. The link will expire 30 minutes after this email was requested.</p>" +
                                "<p>If you did not request this email, you can ignore it.</p>",
                        };

                        await _resend.EmailSendAsync(message);
                    }
                    else
                    {
                        // Send Forgot Username email

                        var username = match.Username;

                        var message = new EmailMessage
                        {
                            From = _configuration["Email:From"] ?? string.Empty,
                            To = match.Email,
                            Subject = "Your username",
                            TextBody =
                                           $"Hello,\n\n" +
                                           $"Your username is: {match.Username}\n\n" +
                                           "If you did not request this email, you can ignore it."
                        };

                        await _resend.EmailSendAsync(message);
                    }
                }
            }
            catch (Exception ex)
            {
                response.ResponseMessage = ex.Message;
            }

            return response;
        }

        public async Task<General.ChangePasswordReturn> ResetPasswordAsync(General.ChangePasswordSubmit model)
        {
            var response = new General.ChangePasswordReturn()
            {
                ResponseMessage = "Password reset successful. You may now log in."
            };

            if (string.IsNullOrWhiteSpace(model.Password))
            {
                response.ResponseMessage = "Missing new password";
                return response;
            }

            if (string.IsNullOrWhiteSpace(model.Token))
            {
                response.ResponseMessage = "Missing token";
                return response;
            }

            try
            {
                string tokenHash = Convert.ToHexString(
                    SHA256.HashData(Encoding.UTF8.GetBytes(model.Token)));


                var match = await _dataContext.PasswordResetTokens
                    .Where(o => o.TokenHash == tokenHash && o.IsUsed == false && o.ExpiresAt > DateTime.Now && o.User.IsActive)
                    .FirstOrDefaultAsync();


                if (match == null)
                {
                    response.ResponseMessage = "No matching valid token found. Try sending a password reset email again.";
                    return response;
                }

                match.IsUsed = true;

                var userMatch = await _dataContext.Users
                    .Where(o => match.UserId == o.Id)
                    .FirstOrDefaultAsync();

                string hashedPassword = _passwordHasher.HashPassword(userMatch!, model.Password ?? string.Empty);

                userMatch!.PasswordHash = hashedPassword;

                await _dataContext.SaveChangesAsync();
            }
            catch (Exception ex)
            {
                response.ResponseMessage = ex.Message;
            }

            return response;
        }



        public async Task<General.GetChatFolderReturn> GetChatFolderAsync(General.GetChatFolderSubmit model)
        {
            var folder = await _dataContext.ChatFolders
                .Where(o => o.IsActive && o.Id == model.ChatFolderId && (o.IsPublic ||
                    o.ChatFolderPermissions.Any(p => p.IsActive && p.UserId == model.UserId)))
                .Select(o => new General.GetChatFolderReturn()
                {
                    ChatFolderId = o.Id,
                    ParentChatFolderId = o.ParentChatFolderId,
                    ChatFolderName = o.Name,
                    Chats = o.Chats.Where(c => c.IsActive && (c.IsPublic
                        || c.ChatPermissions.Any(p => p.IsActive && p.UserId == model.UserId)))
                        .Select(c => new General.ChatSummary()
                        {
                            ChatId = c.Id,
                            ChatName = c.Name,
                            LastUpdated = c.LastUpdated,
                            MessageCount = c.ChatMessages.Where(m => m.IsActive).Count()
                        }).OrderBy(c => c.LastUpdated).ToList(),
                    ChatFolders = o.ChatFolders.Where(f => f.IsActive && (f.IsPublic
                        || f.ChatFolderPermissions.Any(p => p.IsActive && p.UserId == model.UserId)))
                        .Select(f => new General.ChatFolderSummary()
                        {
                            FolderId = f.Id,
                            FolderName = f.Name,
                        }).OrderBy(f => f.FolderName).ToList()
                })
                .FirstOrDefaultAsync();

            if (folder == null)
            {
                throw new ArgumentException("Folder not found");
            }

            return folder;
        }

        public async Task<General.GetChatFolderReturn> CreateChatFolderAsync(CreateChatFolderSubmit model)
        {
            var now = DateTime.Now;

            var newFolder = new Data.Models.ChatFolder()
            {
                DateCreated = now,
                ParentChatFolderId = model.ParentFolderId,
                IsPublic = model.IsPublic,
                IsActive = true,
                Name = model.ChatName ?? string.Empty,
                CreatedBy = model.UserId,
            };

            _dataContext.ChatFolders.Add(newFolder);

            await _dataContext.SaveChangesAsync();

            model.AllowedUserIds.ForEach(o =>
            {
                var newPerm = new Data.Models.ChatFolderPermission()
                {
                    IsActive = true,
                    UserId = o,
                    DateCreated = now,
                    ChatFolderId = newFolder.Id,
                };

                _dataContext.ChatFolderPermissions.Add(newPerm);
            });
            await _dataContext.SaveChangesAsync();

            var submit = new General.GetChatFolderSubmit()
            {
                UserId = model.UserId,
                ChatFolderId = newFolder.Id,
            };

            return await GetChatFolderAsync(submit);
        }

        public async Task<General.GetChatReturn> GetChatAsync(General.GetChatSubmit model)
        {
            int pageSize = 20;
            // Assuming pageNumber 0 is the first page (or latest messages)
            int skipCount = model.PageNumber * pageSize;

            var chatMetadata = await _dataContext.Chats
                .Where(o => o.IsActive && o.Id == model.ChatId && (o.IsPublic || o.ChatPermissions
                .Any(p => p.IsActive || p.UserId == model.UserId)))
                .Select(o => new 
                { 
                    o.Id,
                    o.Name 
                }).FirstOrDefaultAsync();

            // If no chat matches or user doesn't have permission, return null early
            if (chatMetadata == null)
            {
                throw new ArgumentException("Chat not found");
            }

            var totalMessages = await _dataContext.ChatMessages
                .CountAsync(o => o.ChatId == chatMetadata.Id && o.IsActive);
                
            // 2. Fetch the paginated messages directly from the ChatMessages db set
            var paginatedMessages = await _dataContext.ChatMessages
                .Where(o => o.ChatId == chatMetadata.Id && o.IsActive)
                .OrderBy(o => o.DateCreated)
                .Skip(skipCount)
                .Take(pageSize)
                .Select(m => new ChatMessage()
                {
                    LastUpdated = m.LastUpdated,
                    Text = m.Text,
                    UserId = m.UserId,
                    UserName = m.User.Username,
                    Id = m.Id
                })
                .ToListAsync(); // Executing asynchronously directly on the flat table safely

            return new General.GetChatReturn() 
            {
                ChatName = chatMetadata.Name,
                Id = chatMetadata.Id,
                TotalMessages = totalMessages,
                Messages = paginatedMessages.Select(o => new ChatMessage() 
                {
                    Id = o.Id,
                    Text = o.Text, 
                    LastUpdated = o.LastUpdated.AddYears(1000), // Years added for sci-fi flavor
                    UserId = o.UserId,
                    UserName = o.UserName                    
                }).ToList()            
            };
        }

        public async Task<General.CreateChatReturn> CreateChatAsync(General.CreateChatSubmit model)
        {
            var now = DateTime.Now;

            var newChat = new Data.Models.Chat()
            {
                LastUpdated = now,
                DateCreated = now,
                ParentChatFolderId = model.ParentFolderId,
                Name = model.ChatName ?? string.Empty,
                IsActive = true,
                IsPublic = model.IsPublic,
                CreatedBy = model.UserId,
            };

            _dataContext.Chats.Add(newChat);

            await _dataContext.SaveChangesAsync();

            model.AllowedUserIds.ForEach(o =>
            {
                var newPerm = new Data.Models.ChatPermission()
                {
                    IsActive = true,
                    UserId = o,
                    DateCreated = now,
                    ChatId = newChat.Id,
                };

                _dataContext.ChatPermissions.Add(newPerm);
            });

            await _dataContext.SaveChangesAsync();

            return new General.CreateChatReturn()
            {
                ChatName = newChat.Name,
                Id = newChat.Id,                
            };
        }

        public async Task<General.GetChatReturn> CreateMessageAsync(General.CreateChatMessageSubmit model)
        {
            if (string.IsNullOrWhiteSpace(model.ChatMessageText))
            {
                throw new ArgumentException("Missing message");
            }

            var sanitizer = new HtmlSanitizer();
            string scrubbedHtml = sanitizer.Sanitize(model.ChatMessageText);

            var now = DateTime.UtcNow;

            if (model.ChatMessageId == null || model.ChatMessageId == 0)
            {
                // Create message


                var newMessage = new Data.Models.ChatMessage()
                {
                    DateCreated = now,
                    ChatId = model.ChatId,
                    IsActive = true,
                    LastUpdated = now,
                    UserId = model.UserId,
                    Text = scrubbedHtml
                };

                _dataContext.ChatMessages.Add(newMessage);

                var existingChat = await _dataContext.Chats
                    .Where(o => o.IsActive && o.Id == model.ChatId)
                    .FirstOrDefaultAsync();

                if (existingChat == null)
                {
                    throw new ArgumentException("Chat not found");
                }

                existingChat.LastUpdated = now;

                await _dataContext.SaveChangesAsync();
            }
            else
            {
                // Update message

                var existingMessage = await _dataContext.ChatMessages
                    .Where(o => o.IsActive && o.Id == model.ChatMessageId)
                    .FirstOrDefaultAsync();

                if (existingMessage == null)
                {
                    throw new ArgumentException("Message not found");
                }

                if (string.Equals(existingMessage.Text, scrubbedHtml) == false)
                {
                    existingMessage.Text = scrubbedHtml;
                    existingMessage.LastUpdated = now;

                    var existingChat = await _dataContext.Chats
                        .Where(o => o.IsActive && o.Id == model.ChatId)
                        .FirstOrDefaultAsync();

                    if (existingChat == null)
                    {
                        throw new ArgumentException("Chat not found");
                    }

                    existingChat.LastUpdated = now;

                    await _dataContext.SaveChangesAsync();
                }
            }

            var submit = new GetChatSubmit()
            {
                ChatId = model.ChatId,
                UserId = model.UserId,
                PageNumber = model.PageNumber, 
            };

            return await GetChatAsync(submit);
        }

        public async Task<GetChatFolderRoot> GetChatFolderRootAsync(GetChatFolderSubmit model)
        {
            var rootChatFolder = await GetChatFolderAsync(model);

            var userIds = await GetUserProfiles(null);

            return new GetChatFolderRoot()
            {
                RootChatFolder = rootChatFolder,
                UserIds = userIds
            };
        }

        public async Task<SetAvatarReturn> UploadAvatarAsync(int userId, IFormFile file)
        {
            var response = new SetAvatarReturn()
            {
                Successful = false
            };

            // 1. Basic Validation
            if (file == null || file.Length == 0)
            {
                response.ResponseMessage = "No file uploaded.";
                return response;
            }

            // 2. Locate the user
            var user = await _dataContext.Users.FirstOrDefaultAsync(o => o.Id == userId && o.IsActive);
            if (user == null)
            {
                response.ResponseMessage = "User not found.";
                return response;
            }

            try
            {
                // 3. Load the image into SkiaSharp
                using var inputStream = file.OpenReadStream();
                using var originalBitmap = SKBitmap.Decode(inputStream);

                if (originalBitmap == null)
                {
                    response.ResponseMessage = "Invalid image format or corrupted file.";
                    return response;
                }

                // 4. Create a new 256x256 blank bitmap canvas
                using var resizedBitmap = new SKBitmap(256, 256);

                // 5. High-quality scale/resize the original into the 256x256 canvas
                originalBitmap.ScalePixels(resizedBitmap, SKSamplingOptions.Default);

                // 6. Encode the resized bitmap as a compressed JPEG
                using var image = SKImage.FromBitmap(resizedBitmap);
                using var data = image.Encode(SKEncodedImageFormat.Jpeg, 85); // 85% quality keeps it tiny but crisp

                using var outputStream = new MemoryStream();
                data.SaveTo(outputStream);

                // 7. Update the Database Entity and Save
                user.Avatar = outputStream.ToArray();
                await _dataContext.SaveChangesAsync();

                response.Successful = true;
                response.ResponseMessage = "User avatar uploaded successfully.";
                return response;
            }
            catch (System.Exception ex)
            {
                response.ResponseMessage = $"Internal server error: {ex.Message}";
                return response;
            }
        }

        public async Task<UserSettings> GetUserSettingsAsync(int userId)
        {
            var profiles = await GetUserProfiles(userId);

            if (profiles.Count == 0)
            {
                throw new ArgumentException("User not found");
            }

            var profile = profiles[0];


            // Add additional settings such as AI helper as needed

            return new UserSettings()
            {
                Avatar = profile.Avatar,
                Name = profile.Name,
                UserId = profile.UserId
            };
        }

        private async Task<List<UserSummary>> GetUserProfiles(int? userId)
        {
            var users = _dataContext.Users.Where(o => o.IsActive);

            if (userId != null)
            {
                users = users.Where(o => o.Id == userId);
            }

            var userData = await users
                .Select(o => new
                {
                    o.Id,
                    o.Avatar,
                    o.Username
                }).ToListAsync();

            // Convert the raw byte array to a Base64 string for the frontend

            var avatars = users
                .Select(o => new UserSummary()
                {
                    UserId = o.Id,
                    Avatar = o.Avatar != null ? Convert.ToBase64String(o.Avatar) : null,
                    Name = o.Username
                }).ToList();

            return avatars;   
        }

        public async Task<UserSettingsSubmitResult> SaveUserSettingsAsync(UserSettingsSubmit model)
        {
            var result = new UserSettingsSubmitResult()
            {
                Successful = false
            };

            var match = await _dataContext.Users
                .Where(o => o.IsActive && model.UserId == o.Id)
                .FirstOrDefaultAsync();

            if (match == null)
            {
                result.ErrorMessage = "User not found";
                return result;
            }
            try
            {
                if (match.Username != model.Name) // Add other settings here as needed
                {
                    if (match.Username != model.Name && string.IsNullOrWhiteSpace(model.Name) == false)
                    {
                        match.Username = model.Name;
                    }

                    await _dataContext.SaveChangesAsync();
                }

                result.Successful = true;
                return result;
            } 
            catch(Exception ex)
            {
                result.ErrorMessage = ex.Message;
                return result;
            }
        }
    }

}

