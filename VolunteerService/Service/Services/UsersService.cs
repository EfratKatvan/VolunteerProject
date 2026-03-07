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

namespace Service.Services
{
    public class UsersService : IService<UsersDto>
    {
        private readonly IRepository<Users> _repository;
        private readonly IMapper _mapper;
        private readonly IRepository<UserCategories> _userCategoriesRepository;


        public UsersService(IRepository<Users> repository, IRepository<UserCategories> userCategoriesRepository, IMapper mapper)
        {
            _repository = repository;
            _userCategoriesRepository = userCategoriesRepository;
            _mapper = mapper;
        }
        public async Task<List<UsersDto>> GetAll()
            => _mapper.Map<List<UsersDto>>(await _repository.GetAll());

        public async Task<UsersDto> GetById(int id)
            => _mapper.Map<UsersDto>(await _repository.GetById(id));

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

        public async Task<List<UsersDto>> GetUsersByCategory(int categoryId)
        {
            var users = (await _repository.GetAll())
                .Where(u => u.UserCategories.Any(uc => uc.CategoryID == categoryId))
                .ToList();
            return _mapper.Map<List<UsersDto>>(users);
        }

        public async Task<List<UsersDto>> GetUsersByDay(DAY day, IRepository<Availabilities> availabilityRepo)
        {
            var allAvailabilities = await availabilityRepo.GetAll();
            var users = (await _repository.GetAll())
                .Where(u => u.Availabilities.Any(ua =>
                    allAvailabilities.Any(a => a.Id == ua.AvailabilityID && a.Day == day)))
                .ToList();
            return _mapper.Map<List<UsersDto>>(users);
        }
        public async Task RemoveCategoryFromUser(int userId, int categoryId)
        {
            var user = await _repository.GetById(userId);
            if (user == null) throw new Exception("משתמש לא נמצא");

            var existing = user.UserCategories.FirstOrDefault(uc => uc.CategoryID == categoryId);
            if (existing != null)
            {
                user.UserCategories.Remove(existing);
                await _repository.UpdateItem(userId, user);
            }
        }

        

        public async Task AddCategoryToUser(int userId, int categoryId)
        {
            // בודקים אם הקטגוריה כבר קיימת
            var exists = (await _userCategoriesRepository.GetAll())
                .Any(uc => uc.UserID == userId && uc.CategoryID == categoryId);
            if (exists) return;

            var userCategory = new UserCategories
            {
                UserID = userId,
                CategoryID = categoryId
            };

            await _userCategoriesRepository.AddItem(userCategory); // הוספה ישירה לטבלת הקישור
        }
    }
}

