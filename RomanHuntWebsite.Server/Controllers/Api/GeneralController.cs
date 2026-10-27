using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using RomanHuntWebsite.Server.General;

namespace RomanHuntWebsite.Server.Controllers.Api
{
    [ApiController]
    [Route("api/[controller]")]
    [AllowAnonymous]
    public class GeneralController : ControllerBase
    {
        private readonly IBaseManager _baseManager;

        public GeneralController(IBaseManager baseManager)
        {
            _baseManager = baseManager;
        }
        
        [HttpPost("[action]")]
        public async Task<General.NewUserReturn> NewUser(General.NewUserSubmit model)
        {
            return await _baseManager.SaveNewUserAsync(model);
        }

        [HttpPost("[action]")]
        public async Task<General.LoginReturn> Login(General.LoginSubmit model)
        {
            return await _baseManager.VerifyLoginAsync(model);
        }

        [HttpGet("[action]")]
        public async Task<TestClass> TestController()
        {
            return await _baseManager.GetTestMethodAsync();       
        }

        [HttpPost("[action]")]
        public async Task<General.AccountEmailReturn> UserEmail(General.AccountEmailSubmit model)
        {
            return await _baseManager.SendUserEmailAsync(model);
        }

        [HttpPost("[action]")]
        public async Task<General.ChangePasswordReturn> ResetPassword(General.ChangePasswordSubmit model)
        {
            return await _baseManager.ResetPasswordAsync(model);
        }


        [HttpPost("[action]")]
        public async Task<General.GetChatFolderReturn> ChatFolder(General.GetChatFolderSubmit model)
        {
            return await _baseManager.GetChatFolderAsync(model);
        }

        [HttpPost("[action]")]
        public async Task<General.GetChatFolderReturn> CreateChatFolder(General.CreateChatFolderSubmit model)
        {
            return await _baseManager.CreateChatFolderAsync(model);
        }

        [HttpPost("[action]")]
        public async Task<GetChatReturn> Chat(General.GetChatSubmit model)
        {
            return await _baseManager.GetChatAsync(model);
        }

        [HttpPost("[action]")]
        public async Task<General.CreateChatReturn> CreateChat(General.CreateChatSubmit model)
        {
            return await _baseManager.CreateChatAsync(model);
        }

        [HttpPost("[action]")]
        public async Task<GetChatReturn> CreateMessage(General.CreateChatMessageSubmit model)
        {
            return await _baseManager.CreateMessageAsync(model);
        }

        [HttpPost("[action]")]
        public async Task<GetChatFolderRoot> ChatFolderRoot(GetChatFolderSubmit model)
        {
            return await _baseManager.GetChatFolderRootAsync(model);
        }

        [HttpPost("[action]/{userId}/avatar")]
        public async Task<SetAvatarReturn> UploadAvatar(int userId, [FromForm] IFormFile avatar)
        {
            return await _baseManager.UploadAvatarAsync(userId, avatar);
        }

        [HttpGet("[action]/{userId}")]
        public async Task<UserSettings> UserSettings(int userId)
        {
            return await _baseManager.GetUserSettingsAsync(userId);
        }

        [HttpPost("[action]")]
        public async Task<UserSettingsSubmitResult> SaveUserSettings(UserSettingsSubmit model)
        {
            return await _baseManager.SaveUserSettingsAsync(model);
        }
    }
}
