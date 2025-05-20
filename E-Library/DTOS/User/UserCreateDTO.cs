using Microsoft.Extensions.Diagnostics.HealthChecks;
using System.ComponentModel.DataAnnotations;

namespace E_Library.DTOS.User
{
    public class UserCreateDTO
    {
        public string Name { get; set; }

        [DataType(DataType.Password)]
        public string Password { get; set; }

        [DataType(DataType.Password)]
        [Compare("Password")]
        public string ConfirmPassword { get; set; }

        [EmailAddress(ErrorMessage = "Invalid email address! ")]
        public string Email { get; set; }
        public string Role { get; set; }
    }
}
