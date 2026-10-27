using HandlebarsDotNet.MemberAccessors.EnumerableAccessors;
using Microsoft.EntityFrameworkCore.Diagnostics;
using TypeGen.Core.TypeAnnotations;

namespace RomanHuntWebsite.Server.General
{
    [ExportTsInterface]
    public class KeyValue
    {
        public int Id { get; set; }
        public string? Name { get; set; }
    }

    [ExportTsInterface]
    public class TestClass
    {
        public List<TestObj> Objects { get; set; }
        public TestClass()
        {
            this.Objects = new List<TestObj>();
        }
    }

    [ExportTsInterface]
    public class TestObj
    {
        public string? Title { get; set; }
        public string? Description { get; set; }
    }

    [ExportTsInterface]
    public class NewUserSubmit
    {
        public string? UserName { get; set; }
        public string? Email { get; set; }
        public string? Password { get; set; }
    }

    [ExportTsInterface]
    public class NewUserReturn
    {
        public string? ResponseMessage { get; set; }
        public bool Successful { get; set; }
    }

    [ExportTsInterface]
    public class LoginSubmit
    {
        public string? UserName { get; set; }
        public string? Password { get; set; }
    }

    [ExportTsInterface]
    public class LoginReturn
    {
        public string? UserId { get; set; }
        public string? UserName { get; set; }
        public string? ResponseMessage { get; set; }
        public bool Successful { get; set; }
    }

    [ExportTsInterface]
    public class AccountEmailSubmit
    {
        public string? Email { get; set; }
        public bool ForgotPassword { get; set; }
    }

    [ExportTsInterface]
    public class AccountEmailReturn
    {
        public string? ResponseMessage { get; set; }
    }

    [ExportTsInterface]
    public class ChangePasswordSubmit
    {
        public string? Token { get; set; }
        public string? Password { get; set; }
    }

    [ExportTsInterface]
    public class ChangePasswordReturn
    {
        public string? ResponseMessage { get; set; }
    }
    
    /// 

    [ExportTsInterface]
    public class GetChatFolderSubmit
    {
        public int? ChatFolderId { get; set; }
        public int? UserId { get; set; }
    }

    [ExportTsInterface]
    public class GetChatFolderReturn
    {
        public List<ChatFolderSummary> ChatFolders { get; set; }
        public List<ChatSummary> Chats { get; set; }
        public string? ChatFolderName { get; set; }
        public int ChatFolderId { get; set; }
        public int? ParentChatFolderId { get; set; }
        public GetChatFolderReturn()
        {
            this.ChatFolders = new List<ChatFolderSummary>();
            this.Chats = new List<ChatSummary>();
        }
    }

    //
    [ExportTsInterface]
    public class CreateChatFolderSubmit
    {
        public string? ChatName { get; set; }
        public int? ParentFolderId { get; set; }
        public bool IsPublic { get; set; }
        public List<int> AllowedUserIds { get; set; }
        public int UserId { get; set; }
        public CreateChatFolderSubmit()
        {
            this.AllowedUserIds = new List<int>();
        }
    }
    /*
        [ExportTsInterface]
        public class CreateChatFolderReturn // Use GetChatFolderReturn instead, using the new ID
        {

        }
        */

    [ExportTsInterface]
    public class ChatFolderSummary
    {
        public int? FolderId { get; set; }
        public string? FolderName { get; set; }
    }

    [ExportTsInterface]
    public class ChatSummary
    {
        public int? ChatId { get; set; }
        public int MessageCount { get; set; }
        public DateTime LastUpdated { get; set; }
        public string? ChatName { get; set; }
    }

    [ExportTsInterface]
    public class ChatMessage
    {
        public int Id { get; set; }
        public string? Text { get; set; }
        public string? UserName { get; set; }
        public DateTime LastUpdated { get; set; }
        public int UserId { get; set; }
    }

    [ExportTsInterface]
    public class CreateChatSubmit
    {
        public string? ChatName { get; set; }
        public int? ParentFolderId { get; set; }
        public bool IsPublic { get; set; }
        public List<int> AllowedUserIds { get; set; }
        public int UserId { get; set; }
        public CreateChatSubmit()
        {
            this.AllowedUserIds = new List<int>();
        }
    }

    [ExportTsInterface]
    public class CreateChatReturn
    {
        public int Id { get; set; }
        public string? ChatName { get; set; }
    }

    [ExportTsInterface]
    public class GetChatSubmit
    {
        public int ChatId { get; set; }
        public int UserId { get; set; }
        public int PageNumber { get; set; }
    }

    [ExportTsInterface]
    public class GetChatReturn
    {
        public int Id { get; set; }
        public List<ChatMessage> Messages { get; set; }
        public string? ChatName { get; set; }
        public int TotalMessages { get; set; }

        public GetChatReturn()
        {
            Messages = new List<ChatMessage>();
        }
    }

    [ExportTsInterface]
    public class CreateChatMessageSubmit
    {
        public int UserId { get; set; }
        public int? ChatMessageId { get; set; }
        public string? ChatMessageText { get; set; }
        public int ChatId { get; set; }
        public int PageNumber { get; set; }
    }

    [ExportTsInterface]
    public class GetChatFolderRoot
    {
        public GetChatFolderReturn? RootChatFolder { get; set; }
        public List<UserSummary> UserIds { get; set; }

        public GetChatFolderRoot()
        {
            this.UserIds = new List<UserSummary>();
        }
    }

    // Use Chat Detail for return

    [ExportTsInterface]
    public class SetAvatarReturn
    {
        public string? ResponseMessage { get; set; }
        public bool Successful { get; set; }
    }

    [ExportTsInterface]
    public class UserSummary
    {
       public int UserId { get; set; }
       public string? Name { get; set; }
       public string? Avatar { get; set; }
    }

    [ExportTsInterface]
    public class UserSettings
    {
        public int UserId { get; set; }
        public string? Name { get; set; }
        public string? Avatar { get; set; }
    }

    [ExportTsInterface]
    public class UserSettingsSubmit
    {
        public int UserId { get; set; }
        public string? Name { get; set; }
    }

    [ExportTsInterface]
    public class UserSettingsSubmitResult
    {
        public bool Successful { get; set; }
        public string? ErrorMessage { get; set; }
    }
}