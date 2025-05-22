using System.ComponentModel.DataAnnotations;
using System.ComponentModel.Design;

namespace E_Library.CusotmValidation
{
    public class ValidRoleAttribute : ValidationAttribute
    {
        protected override ValidationResult IsValid(object? value, ValidationContext context)
        {
            if(value is string role)
            {
                if(role == "Admin" || role == "User")
                {
                    return ValidationResult.Success;
                }
                return new ValidationResult("Invalid Role");
            }
            return new ValidationResult("Invalid Role");
        }
    }
}
