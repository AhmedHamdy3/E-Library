using E_Library.CusotmValidation;
using System.ComponentModel.DataAnnotations;

namespace E_Library.DTOS.Book
{
    public class BookCreateDTO
    {
        [Required(ErrorMessage = "Title is required")]
        [MaxLength(100, ErrorMessage = "Title cannot exceed 100 characters")]
        [MinLength(2, ErrorMessage = "Title must be at least 2 characters")]
        public string Title { get; set; }

        [Required(ErrorMessage = "Description is required")]
        [MaxLength(1000, ErrorMessage = "Description cannot exceed 1000 characters")]
        [MinLength(10, ErrorMessage = "Description must be at least 10 characters")]
        public string Description { get; set; }

        [Required(ErrorMessage = "Author is required")]
        [MaxLength(100, ErrorMessage = "Author name cannot exceed 100 characters")]
        [RegularExpression(@"^[a-zA-Z\s\-\.]+$",
            ErrorMessage = "Author name can only contain letters, spaces, hyphens, and periods")]
        public string Author { get; set; }

        [Required(ErrorMessage = "Price is required")]
        [Range(0, 10000, ErrorMessage = "Price must be between 0 and 10,000")]
        [DataType(DataType.Currency)]
        public double Price { get; set; }

        [ValidCategoryId]
        [Required(ErrorMessage = "Category is required")]
        public int CategoryId { get; set; }
    }
}
