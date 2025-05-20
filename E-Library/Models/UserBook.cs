namespace E_Library.Models
{
    public class UserBook
    {
        public string UserId { get; set; }
        public int BookId { get; set; }

        public virtual User User { get; set; }
        public virtual Book Book { get; set; }

    }
}
