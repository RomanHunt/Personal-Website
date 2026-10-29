using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Storage.ValueConversion;
using RomanHuntWebsite.Server.Data.Models;
using System.Collections.Generic;
using System.Reflection.Emit;

namespace RomanHuntWebsite.Server.Data
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options)
        {
        }

        public DbSet<ProjectItem> ProjectItems { get; set; }
        public DbSet<User> Users { get; set; }
        public DbSet<PasswordResetToken> PasswordResetTokens { get; set; }
        public DbSet<Chat> Chats { get; set; }
        public DbSet<ChatFolder> ChatFolders { get; set; }
        public DbSet<ChatFolderPermission> ChatFolderPermissions { get; set; }
        public DbSet<ChatMessage> ChatMessages { get; set; }
        public DbSet<ChatPermission> ChatPermissions { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // Optional: You can explicitly configure default values here if needed
            modelBuilder.Entity<ProjectItem>()
                .Property(p => p.CreatedAt)
                .HasDefaultValueSql("(CURRENT_TIMESTAMP(6))");

            modelBuilder.Entity<PasswordResetToken>()
                .HasOne(t => t.User)
                .WithMany()
                .HasForeignKey(t => t.UserId)
                .OnDelete(DeleteBehavior.Cascade);

            // Converter to ensure DateTime is always treated as UTC when read from DB
            var utcConverter = new ValueConverter<DateTime, DateTime>(
                v => v,
                v => DateTime.SpecifyKind(v, DateTimeKind.Utc));

            foreach (var entityType in modelBuilder.Model.GetEntityTypes())
            {
                foreach (var property in entityType.GetProperties())
                {
                    if (property.ClrType == typeof(DateTime) || property.ClrType == typeof(DateTime?))
                    {
                        property.SetValueConverter(utcConverter);
                    }
                }
            }


        }
    }
}
