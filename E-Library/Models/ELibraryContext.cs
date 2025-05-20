using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;

namespace E_Library.Models
{
    public class ELibraryContext: IdentityDbContext<User>
    {
        public ELibraryContext(DbContextOptions<ELibraryContext> options) : base(options) { }
        protected override void OnModelCreating(ModelBuilder builder)
        {
            base.OnModelCreating(builder);

            #region User
            builder.Entity<User>().Property(u => u.Name).HasMaxLength(100);
            #endregion
            #region Book
            builder.Entity<Book>().HasKey(u => u.Id);
            builder.Entity<Book>().Property(b => b.Title).HasMaxLength(200);
            builder.Entity<Book>().Property(b => b.Author).HasMaxLength(100);
            builder.Entity<Book>().Property(b => b.Description).HasMaxLength(1000);
            builder.Entity<Book>().Property(b => b.Price).HasColumnType("decimal(18,2)");
            builder.Entity<Book>()
                .HasOne(b => b.Category)
                .WithMany(c => c.Books)
                .HasForeignKey(b => b.CategoryId)
                .OnDelete(DeleteBehavior.Restrict);
            #endregion
            #region Category
            builder.Entity<Category>().HasKey(c => c.Id);
            builder.Entity<Category>().Property(c => c.Name).HasMaxLength(100);
            builder.Entity<Category>().Property(c => c.Description).HasMaxLength(1000);
            #endregion
            #region UserBook
            builder.Entity<UserBook>().HasKey(ub => new { ub.UserId, ub.BookId });
            builder.Entity<UserBook>()
                .HasOne(ub => ub.User)
                .WithMany(u => u.Books)
                .HasForeignKey(ub => ub.UserId)
                .OnDelete(DeleteBehavior.Restrict);
            builder.Entity<UserBook>()
                .HasOne(ub => ub.Book)
                .WithMany(b => b.Users)
                .HasForeignKey(ub => ub.BookId)
                .OnDelete(DeleteBehavior.Restrict);
            #endregion
        }

        public DbSet<User> Users { get; set; }
        public DbSet<Book> Books { get; set; }
        public DbSet<Category> Categories { get; set; }
        public DbSet<UserBook> UserBooks { get; set; }
    }
}
