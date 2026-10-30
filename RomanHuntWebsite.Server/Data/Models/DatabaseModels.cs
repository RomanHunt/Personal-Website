using System.Collections;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace RomanHuntWebsite.Server.Data.Models
{
    [Table("ProjectItems")] // Maps this class explicitly to a MySQL table
    public class ProjectItem
    {
        [Key] // Defines this property as the Primary Key
        public int Id { get; set; }

        [Required]
        [MaxLength(150)]
        public string Title { get; set; } = string.Empty;

        [Required]
        [MaxLength(1000)]
        public string Description { get; set; } = string.Empty;

        [MaxLength(255)]
        public string? ImageUrl { get; set; }

        [MaxLength(255)]
        public string? ProjectUrl { get; set; }

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    }

    [Table("Users")] // Maps this class explicitly to a MySQL table
    public class User
    {
        [Key] // Defines this property as the Primary Key
        public int Id { get; set; }

        [Required]
        [MaxLength(300)]
        public string Email { get; set; } = string.Empty;

        [Required]
        [Column("Password_Hash")]
        public string PasswordHash { get; set; } = string.Empty;

        [MaxLength(300)]
        public string Username { get; set; } = string.Empty;

        public bool IsActive { get; set; }

        [Column("Date_Created")]
        public DateTime DateCreated { get; set; } = DateTime.UtcNow;

        public ICollection<PasswordResetToken> PasswordResetTokens { get; set; } = new List<PasswordResetToken>();
        public ICollection<ChatFolderPermission> ChatFolderPermissions { get; set; } = new List<ChatFolderPermission>();
        public ICollection<ChatMessage> ChatMessages { get; set; } = new List<ChatMessage>();
        public ICollection<ChatPermission> ChatPermissions { get; set; } = new List<ChatPermission>();
        public byte[]? Avatar { get; set; }
        public bool IsEmailConfirmed { get; set; }

    }

    [Table("PasswordResetTokens")] // Maps this class explicitly to a MySQL table
    public class PasswordResetToken
    {
        [Key] // Defines this property as the Primary Key
        public int Id { get; set; }
        public int UserId { get; set; }
        [Required]
        public string TokenHash { get; set; } = string.Empty;
        public DateTime ExpiresAt { get; set; } = DateTime.UtcNow;
        public bool IsUsed { get; set; }
        public User User { get; set; } = null!;
    }

    [Table("ChatFolders")] // Maps this class explicitly to a MySQL table
    public class ChatFolder
    {
        [Key] // Defines this property as the Primary Key
        public int Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public int? ParentChatFolderId { get; set; }
        public bool IsPublic { get; set; }
        public DateTime DateCreated { get; set; } = DateTime.UtcNow;
        public int CreatedBy { get; set; }
        public bool IsActive { get; set; }
        public ChatFolder ParentChatFolder { get; set; } = null!;
        public ICollection<Chat> Chats { get; set; } = new List<Chat>();
        public ICollection<ChatFolderPermission> ChatFolderPermissions { get; set; } = new List<ChatFolderPermission>();
        public ICollection<ChatFolder> ChatFolders { get; set; } = new List<ChatFolder>();
    }


    [Table("Chats")] // Maps this class explicitly to a MySQL table
    public class Chat
    {
        [Key] // Defines this property as the Primary Key
        public int Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public int? ParentChatFolderId { get; set; }
        public DateTime DateCreated { get; set; } = DateTime.UtcNow;
        public DateTime LastUpdated { get; set; } = DateTime.UtcNow;
        public DateTime? LastMessageAt { get; set; }
        public bool IsPublic { get; set; }
        public int CreatedBy { get; set; }
        public bool IsActive { get; set; }
        public ChatFolder ParentChatFolder { get; set; } = null!;
        public ICollection<ChatMessage> ChatMessages { get; set; } = new List<ChatMessage>();
        public ICollection<ChatPermission> ChatPermissions { get; set; } = new List<ChatPermission>();

    }

    [Table("ChatFolderPermissions")] // Maps this class explicitly to a MySQL table
    public class ChatFolderPermission
    {
        [Key] // Defines this property as the Primary Key
        public int Id { get; set; }
        public int UserId { get; set; }
        public int ChatFolderId { get; set; }
        public DateTime DateCreated { get; set; } = DateTime.UtcNow;
        public bool IsActive { get; set; }
        public ChatFolder ChatFolder { get; set; } = null!;
        public User User { get; set; } = null!;
    }

    [Table("ChatMessages")] // Maps this class explicitly to a MySQL table
    public class ChatMessage
    {
        [Key] // Defines this property as the Primary Key
        public int Id { get; set; }
        public int UserId { get; set; }
        public int ChatId { get; set; }
        public string Text { get; set; } = string.Empty;
        public DateTime DateCreated { get; set; } = DateTime.UtcNow;
        public DateTime LastUpdated { get; set; } = DateTime.UtcNow;
        public bool IsActive { get; set; }
        public Chat Chat { get; set; } = null!;
        public User User { get; set; } = null!;
    }

    [Table("ChatPermissions")] // Maps this class explicitly to a MySQL table
    public class ChatPermission
    {
        [Key] // Defines this property as the Primary Key
        public int Id { get; set; }
        public int UserId { get; set; }
        public int ChatId { get; set; }
        public DateTime DateCreated { get; set; } = DateTime.UtcNow;
        public bool IsActive { get; set; }
        public Chat Chat { get; set; } = null!;
        public User User { get; set; } = null!;
    }
}
