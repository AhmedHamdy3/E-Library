using E_Library.CusotmValidation;
using System.ComponentModel.DataAnnotations;

namespace E_Library.DTOS.User
{
    public class UserUpdateDTO
    {
        public string Id { get; set; }
        [Required(ErrorMessage = "Name is required")]
        [StringLength(50, MinimumLength = 2, ErrorMessage = "Name must be 2-50 characters")]
        [RegularExpression(@"^[a-zA-Z\s\-']+$",
            ErrorMessage = "Name can only contain letters, spaces, hyphens, and apostrophes")]
        public string Name { get; set; }

        [Required(ErrorMessage = "Email is required")]
        [EmailAddress(ErrorMessage = "Invalid email format")]
        [MaxLength(100, ErrorMessage = "Email cannot exceed 100 characters")]
        [RegularExpression(@"^[^@\s]+@[^@\s]+\.[^@\s]+$",
            ErrorMessage = "Invalid email format (e.g., user@example.com)")]
        public string Email { get; set; }

        [Required(ErrorMessage = "Password is required")]
        [DataType(DataType.Password)]
        public string Password { get; set; }

        [Required(ErrorMessage = "Role is required")]
        [ValidRole(ErrorMessage = "Invalid role selection")]
        public string Role { get; set; }

    }
}
