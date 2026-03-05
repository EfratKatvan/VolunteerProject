using AutoMapper;
using Repository.Entities;
using Repository.Interfaces;
using Service.Dto;
using Service.Interfaces;
using Service.Validations;
using System;
using System.Linq;
using System.Security.Cryptography;
using System.Text;
using System.Threading.Tasks;

namespace Service.Services
{
    public class LoginService : ILoginService
    {
        private readonly IRepository<Users> _repository;
        private readonly IMapper _mapper;

        public LoginService(IRepository<Users> repository, IMapper mapper)
        {
            _repository = repository;
            _mapper = mapper;
        }

        public async Task<UsersDto> Authenticate(LoginDto login)
        {
            var user = (await _repository.GetAll())
                        .FirstOrDefault(u => u.Email == login.Email);

            if (user == null)
                throw new ArgumentException("המשתמש לא קיים.");

            if (!ValidationHelper.IsValidPassword(login.Password))
                throw new ArgumentException("סיסמה חלשה מדי");

            if (!VerifyPassword(login.Password, user.EncryptedPassword))
                return null;

            if (!ValidationHelper.IsValidEmail(login.Email))
                throw new ArgumentException("מייל לא תקין");

            return _mapper.Map<UsersDto>(user);
        }

        private bool VerifyPassword(string plainPassword, string storedHash)
        {
            using (var sha256 = SHA256.Create())
            {
                var hashedBytes = sha256.ComputeHash(Encoding.UTF8.GetBytes(plainPassword));
                var hashString = BitConverter.ToString(hashedBytes).Replace("-", "").ToLower();
                return hashString == storedHash;
            }
        }

        public static string HashPassword(string password)
        {
            using (var sha256 = SHA256.Create())
            {
                var hashedBytes = sha256.ComputeHash(Encoding.UTF8.GetBytes(password));
                return BitConverter.ToString(hashedBytes).Replace("-", "").ToLower();
            }
        }
        public async Task<UsersDto> GetUserById(int id)
        {
            // שולף את כל המשתמשים ומחזיר את זה עם ה־Id המתאים
            var user = (await _repository.GetAll())
                        .FirstOrDefault(u => u.Id == id);

            if (user == null)
                return null;

            return _mapper.Map<UsersDto>(user);
        }
    }
}