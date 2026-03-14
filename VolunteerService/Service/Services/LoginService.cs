using AutoMapper;
using Repository.Entities;
using Repository.Interfaces;
using Service.Dto;
using Service.Interfaces;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using System;
using System.Linq;
using System.Threading.Tasks;
using BCrypt.Net;
using Service.Validations;
using System.Security.Cryptography;

namespace Service.Services
{
    public class LoginService : ILoginService
    {
        private readonly IRepository<Users> _repository;
        private readonly IMapper _mapper;
        private readonly IConfiguration _configuration;

        public LoginService(IRepository<Users> repository, IMapper mapper, IConfiguration configuration)
        {
            _repository = repository;
            _mapper = mapper;
            _configuration = configuration;
        }

        public async Task<UsersDto> Authenticate(LoginDto login)
        {
            var user = (await _repository.GetAll()).FirstOrDefault(u => u.Email == login.Email);
            if (user == null)
                throw new ArgumentException("User does not exist.");
            if (!BCrypt.Net.BCrypt.Verify(login.Password, user.EncryptedPassword))
                throw new ArgumentException("Incorrect password");
            if (!ValidationHelper.IsValidEmail(login.Email))
                throw new ArgumentException("Incorrect email");
            return _mapper.Map<UsersDto>(user);
        }

        public string GenerateToken(UsersDto user)
        {
            var securityKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_configuration["Jwt:Key"]));
            var credentials = new SigningCredentials(securityKey, SecurityAlgorithms.HmacSha256);
            var claims = new[]
            {
                new Claim("UserId", user.Id.ToString()), // ← תוקן: שם ה-claim תואם ל-GetUserByToken
                new Claim(ClaimTypes.Name, user.Email),
                new Claim(ClaimTypes.Role, user.UserRole.ToString())
            };
            var token = new JwtSecurityToken(
                _configuration["Jwt:Issuer"],
                _configuration["Jwt:Audience"],
                claims,
                expires: DateTime.Now.AddDays(7), // ← תוקן: 7 ימים במקום 2 שעות
                signingCredentials: credentials);
            return new JwtSecurityTokenHandler().WriteToken(token);
        }

        public async Task<UsersDto> GetUserById(int id)
        {
            var user = (await _repository.GetAll())
                        .FirstOrDefault(u => u.Id == id);
            return user == null ? null : _mapper.Map<UsersDto>(user);
        }
    }
}