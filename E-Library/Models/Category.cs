namespace E_Library.Models
{
    public class Category
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string Description { get; set; }
        
        // Navigation Property
        public virtual ICollection<Book> Books { get; set; }
    }
}
