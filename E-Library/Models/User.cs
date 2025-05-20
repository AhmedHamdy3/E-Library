using Microsoft.AspNetCore.Identity;

namespace E_Library.Models
{
    public class User : IdentityUser
    {
        public string Name { get; set; }
        // Navigation Property
        public virtual ICollection<UserBook> Books { get; set; }
    }
}
