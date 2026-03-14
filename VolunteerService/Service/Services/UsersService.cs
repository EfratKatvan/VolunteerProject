using AutoMapper;
using Repository.Entities;
using Repository.Interfaces;
using Service.Dto;
using Service.Interfaces;
using Service.Validations;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using BCrypt.Net;
namespace Service.Services
{
    public class UsersService : IUserService
    {
        private readonly IRepository<Users> _repository;
        private readonly IRepository<UserCategories> _userCategoriesRepository;
        private readonly IRepository<Categories> _categoriesRepository;
        private readonly IMapper _mapper;

        public UsersService(IRepository<Users> repository,
                            IRepository<UserCategories> userCategoriesRepository,
                            IRepository<Categories> categoriesRepository,
                            IMapper mapper)
        {
            _repository = repository;
            _userCategoriesRepository = userCategoriesRepository;
            _categoriesRepository = categoriesRepository;
            _mapper = mapper;
        }

        public async Task<List<UsersDto>> GetAll()
        {
            var users = await _repository.GetAll();
            var allCategories = await _categoriesRepository.GetAll();
            var userCategories = await _userCategoriesRepository.GetAll();

            var result = users.Select(user =>
            {
                var dto = _mapper.Map<UsersDto>(user);
                dto.Categories = userCategories
                    .Where(uc => uc.UserID == user.Id)
                    .Select(uc => allCategories
                        .Where(c => c.Id == uc.CategoryID)
                        .Select(c => _mapper.Map<CategoriesDto>(c))
                        .FirstOrDefault())
                    .Where(c => c != null)
                    .ToList();
                return dto;
            }).ToList();

            return result;
        }

        public async Task<UsersDto> GetById(int id)
        {
            var user = await _repository.GetById(id);
            if (user == null) return null;

            var dto = _mapper.Map<UsersDto>(user);
            var allCategories = await _categoriesRepository.GetAll();
            var userCategories = (await _userCategoriesRepository.GetAll())
                                 .Where(uc => uc.UserID == id);

            dto.Categories = userCategories
                .Select(uc => allCategories
                    .Where(c => c.Id == uc.CategoryID)
                    .Select(c => _mapper.Map<CategoriesDto>(c))
                    .FirstOrDefault())
                .Where(c => c != null)
                .ToList();

            return dto;
        }

        public async Task<UsersDto> AddItem(UsersDto item)
        {
            var entity = _mapper.Map<Users>(item);
            var added = await _repository.AddItem(entity);
            return _mapper.Map<UsersDto>(added);
        }

        public async Task UpdateItem(int id, UsersDto item)
        {
            if (!ValidationHelper.IsValidEmail(item.Email))
                throw new ArgumentException("פורמט המייל אינו תקין");

            if (!ValidationHelper.IsValidPhone(item.Phone))
                throw new ArgumentException("פורמט הטלפון אינו תקין");

            var emailExists = (await _repository.GetAll())
                .Any(u => u.Email == item.Email && u.Id != id);
            if (emailExists)
                throw new ArgumentException("המייל כבר קיים במערכת עבור משתמש אחר");

            var existing = await _repository.GetById(id);
            if (existing != null)
            {
                _mapper.Map(item, existing);
                await _repository.UpdateItem(id, existing);
            }
            else
            {
                throw new Exception("משתמש לא נמצא");
            }
        }

        public async Task DeleteItem(int id)
            => await _repository.DeleteItem(id);

        public async Task RemoveCategoryFromUser(int userId, int categoryId)
        {
            var existing = (await _userCategoriesRepository.GetAll())
                .FirstOrDefault(uc => uc.UserID == userId && uc.CategoryID == categoryId);

            if (existing != null)
                await _userCategoriesRepository.DeleteItem(existing.Id);
        }

        public async Task AddCategoryToUser(int userId, int categoryId)
        {
            var exists = (await _userCategoriesRepository.GetAll())
                .Any(uc => uc.UserID == userId && uc.CategoryID == categoryId);
            if (exists) return;

            var userCategory = new UserCategories
            {
                UserID = userId,
                CategoryID = categoryId
            };

            await _userCategoriesRepository.AddItem(userCategory);
        }
        // בתוך UsersService.cs

        public async Task CreateAdminIfNotExists()
        {
            // בדיקה אם קיים מנהל כלשהו במסד הנתונים
            var allUsers = await _repository.GetAll();
            if (!allUsers.Any(u => u.UserRole == UserRole.Admin))
            {
                var admin = new Users
                {
                    FullName = "Admin",
                    Email = "admin@mail.com",
                    // הצפנת הסיסמה 123456
                    EncryptedPassword = BCrypt.Net.BCrypt.HashPassword("123456"),
                    UserRole = UserRole.Admin,
                    Phone = "0500000000",
                    Adress = "System",
                    Latitude = 32.0,
                    Longitude = 34.0,
                    Rating = 0
                };

                await _repository.AddItem(admin);
            }
        }
        // בתוך UsersService.cs
        public async Task<Users> GetEntityByEmail(string email)
        {
            var users = await _repository.GetAll();
            return users.FirstOrDefault(u => u.Email == email);
        }
    }
}