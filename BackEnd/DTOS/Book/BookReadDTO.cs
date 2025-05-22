using E_Library.Models;

namespace E_Library.DTOS.Book
{
    public class BookReadDTO
    {
        public int Id { get; set; }
        public string Title { get; set; }
        public string Description { get; set; }
        public string Author { get; set; }
        public double Price { get; set; }
        public string Category { get; set; }
    }
}
