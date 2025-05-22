using System.ComponentModel;

namespace E_Library.Models
{
    public class Book
    {
        public int Id { get; set; }
        public string Title { get; set; }
        public string Description { get; set; }
        public string Author { get; set; }
        public double Price { get; set; }

        // Foreign Key
        public int CategoryId { get; set; }
        // Navigation Property
        public virtual Category Category { get; set; }
        public virtual ICollection<UserBook> Users { get; set; }
    }
}
