using AutoMapper;
using E_Library.DTOS.Book;
using E_Library.DTOS.Category;
using E_Library.DTOS.User;
using E_Library.Models;
using Microsoft.AspNetCore.Identity;
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

            #region User
            CreateMap<UserCreateDTO, User>()
                .ForMember(dest => dest.UserName,
                    opt => opt.MapFrom(src => src.Email)
                )
                .ReverseMap();

            CreateMap<UserUpdateDTO, User>().ReverseMap();
            CreateMap<User, UserReadDTO>()
                .ForMember(dest => dest.Role,
                    opt => opt.MapFrom( async (src, dest, member, context) => {
                        var _userManager = (UserManager<User>)context.Items["UserManager"];
                        var roles = await _userManager.GetRolesAsync(src);
                        string role = roles.FirstOrDefault().ToString();
                        return role;
                    })                
                )
                .ReverseMap();
            #endregion
        }
    }
}
