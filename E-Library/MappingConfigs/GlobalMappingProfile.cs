using AutoMapper;
using E_Library.DTOS.Book;
using E_Library.DTOS.Category;
using E_Library.Models;
using System.Runtime.InteropServices;

namespace E_Library.MappingConfigs
{
    public class GlobalMappingProfile: Profile
    {
        public GlobalMappingProfile() {
            #region Category
            CreateMap<CategoryCreateDTO, Category>()
                .ReverseMap();

            CreateMap<Category, CategoryReadDTO>()
                .ReverseMap();

            CreateMap<CategoryUpdateDTO, Category>()
                .ReverseMap();
            #endregion

            #region Book
            CreateMap<Book, BookReadDTO>()
                .ForMember(dest => dest.Category,
                    opt => opt.MapFrom(src => src.Category.Name)
                )
                .ReverseMap();

            CreateMap<BookCreateDTO, Book>()
                .ReverseMap();

            CreateMap<BookUpdateDTO, Book>()
                .ReverseMap();
            #endregion
        }
    }
}
