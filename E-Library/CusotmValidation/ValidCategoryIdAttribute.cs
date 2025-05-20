using E_Library.Models;
using E_Library.UOW;
using System.ComponentModel.DataAnnotations;

namespace E_Library.CusotmValidation
{
    public class ValidCategoryIdAttribute : ValidationAttribute
    {
        protected override ValidationResult IsValid(object? value, ValidationContext context)
        {
            //return ValidationResult.Success;
            if(value is int categoryId)
            {
                var _dbContext = (ELibraryContext)context.GetService(typeof(ELibraryContext));
                if (!_dbContext.Categories.Any(c => c.Id == categoryId))
                {
                    return new ValidationResult("Invalid Category Id");
                }
            }
            return ValidationResult.Success;
        }
    }
}
