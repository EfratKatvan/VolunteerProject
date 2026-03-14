using AutoMapper;
using Repository.Entities;
using Repository.Interfaces;
using Service.Dto;
using Service.Interfaces;
using Service.Validations;
using System;
using System.Linq;
using System.Threading.Tasks;

namespace Service.Services
{
    public class RegisterService : IRegisterService
    {
        private readonly IRepository<Users> _repository;
        private readonly IRepository<UserCategories> _userCategoriesRepository;
        private readonly IRepository<UserAvailabilities> _userAvailabilitiesRepository;
        private readonly IRepository<Availabilities> _availabilitiesRepository;
        private readonly IMapper _mapper;

        public RegisterService(
            IRepository<Users> repository,
            IRepository<UserCategories> userCategoriesRepository,
            IRepository<UserAvailabilities> userAvailabilitiesRepository,
            IRepository<Availabilities> availabilitiesRepository,
            IMapper mapper)
        {
            _repository = repository;
            _userCategoriesRepository = userCategoriesRepository;
            _userAvailabilitiesRepository = userAvailabilitiesRepository;
            _availabilitiesRepository = availabilitiesRepository;
            _mapper = mapper;
        }

        public async Task<UsersDto> Register(RegisterDto register)
        {
            // בדיקה אם המשתמש כבר קיים
            var existingUser = (await _repository.GetAll())
                                .FirstOrDefault(u => u.Email == register.Email);
            if (existingUser != null)
                return null;

            if (!ValidationHelper.IsValidEmail(register.Email))
                throw new ArgumentException("מייל לא תקין");

            if (!ValidationHelper.IsValidPhone(register.Phone))
                throw new ArgumentException("טלפון לא תקין");

            if (!ValidationHelper.IsValidPassword(register.Password))
                throw new ArgumentException("סיסמה חלשה מדי");

            // יצירת המשתמש

            var user = new Users
            {
                FullName = register.FullName,
                Email = register.Email,
                Phone = register.Phone,
                Adress = register.Adress,
                UserRole = register.UserRole,

                // הצפנת הסיסמה עם BCrypt
                EncryptedPassword = BCrypt.Net.BCrypt.HashPassword(register.Password)
            };
            var addedUser = await _repository.AddItem(user);

            // שמירת קטגוריות
            foreach (var categoryId in register.CategoryIds)
            {
                await _userCategoriesRepository.AddItem(new UserCategories
                {
                    UserID = addedUser.Id,
                    CategoryID = categoryId
                });
            }

            // שמירת זמינויות
            foreach (var availabilityDto in register.Availabilities)
            {
                // קודם שומרים את הזמינות עצמה
                var availability = await _availabilitiesRepository.AddItem(new Availabilities
                {
                    UserID = addedUser.Id,
                    Day = availabilityDto.Day,
                    From_Time = availabilityDto.From_Time,
                    To_Time = availabilityDto.To_Time
                });

                // אחר כך מקשרים את המשתמש לזמינות
                await _userAvailabilitiesRepository.AddItem(new UserAvailabilities
                {
                    UserID = addedUser.Id,
                    AvailabilityID = availability.Id
                });
            }

            // טוענים שוב את המשתמש עם כל הזמינויות והקטגוריות
            var addedUserWithDetails = await _repository.GetById(addedUser.Id);
            return _mapper.Map<UsersDto>(addedUserWithDetails);
        }

        private string HashPassword(string password)
        {
            using (var sha256 = System.Security.Cryptography.SHA256.Create())
            {
                var hashedBytes = sha256.ComputeHash(System.Text.Encoding.UTF8.GetBytes(password));
                return BitConverter.ToString(hashedBytes).Replace("-", "").ToLower();
            }
        }
    }
}
