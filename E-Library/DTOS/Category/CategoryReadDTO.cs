using E_Library.DTOS.Book;

namespace E_Library.DTOS.Category
{
    public class CategoryReadDTO
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string Description { get; set; }

        // Navigation Property
        public virtual ICollection<BookReadDTO> Books { get; set; }
    }
}
