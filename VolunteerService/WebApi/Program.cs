using AutoMapper;
using CodeFirst.Models;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.IdentityModel.Tokens;
using Repository.Entities;
using Repository.Interfaces;
using Repository.Repositories;
using Service; // אם יש לך Profile ל-AutoMapper
using Service.Dto;
using Service.Interfaces;
using Service.Services;
using System.Text;
//הי
var builder = WebApplication.CreateBuilder(args);

// ==========================
// 0️⃣ AutoMapper

// ==========================



builder.Services.AddAutoMapper(typeof(MyMapper));

// ==========================
// 1️⃣ DbContext + IContext
// ==========================
builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection"))
);

// רישום IContext כך ש-Repositories יקבלו אותו
builder.Services.AddScoped<IContext>(provider => provider.GetRequiredService<AppDbContext>());

// ==========================
// 2️⃣ Repositories
// ==========================
builder.Services.AddScoped<IRepository<Users>, UsersRepository>();
builder.Services.AddScoped<IRepository<HelpRequests>, HelpRequestsRepository>();
builder.Services.AddScoped<IRepository<Assignments>, AssignmentsRepository>();
builder.Services.AddScoped<IRepository<Categories>, CategoriesRepository>();
builder.Services.AddScoped<IRepository<Availabilities>, AvailabilitiesRepository>();
builder.Services.AddScoped<IRepository<UserAvailabilities>, UserAvailabilitiesRepository>();
builder.Services.AddScoped<IRepository<UserCategories>, UserCategoriesRepository>();
builder.Services.AddScoped<IRepository<ChatMessages>, ChatMessagesRepository>();

// ==========================
// 3️⃣ Services
// ==========================
builder.Services.AddScoped<IService<UsersDto>, UsersService>();
builder.Services.AddScoped<IService<AssignmentsDto>, AssignmentsService>();
builder.Services.AddScoped<IService<HelpRequestsDto>, HelpRequestsService>();
builder.Services.AddScoped<IService<CategoriesDto>, CategoriesService>();
builder.Services.AddScoped<IService<AvailabilitiesDto>, AvailabilitiesService>();
builder.Services.AddScoped<IService<ChatMessagesDto>, ChatMessagesService>();
builder.Services.AddScoped<ILoginService, LoginService>();
builder.Services.AddScoped<IRegisterService, RegisterService>();

// ==========================
// 4️⃣ JWT Authentication
// ==========================
builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer = true,
            ValidateAudience = true,
            ValidateLifetime = true,
            ValidateIssuerSigningKey = true,
            ValidIssuer = builder.Configuration["Jwt:Issuer"],
            ValidAudience = builder.Configuration["Jwt:Audience"],
            IssuerSigningKey = new SymmetricSecurityKey(
                Encoding.UTF8.GetBytes(builder.Configuration["Jwt:Key"])
            )
        };
    });

builder.Services.AddAuthorization();

// ==========================
// 5️⃣ Controllers + Swagger
// ==========================
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(c =>
{
    // אפשרות להזין JWT ב-Swagger
    c.AddSecurityDefinition("Bearer", new Microsoft.OpenApi.Models.OpenApiSecurityScheme
    {
        Name = "Authorization",
        Type = Microsoft.OpenApi.Models.SecuritySchemeType.ApiKey,
        Scheme = "Bearer",
        BearerFormat = "JWT",
        In = Microsoft.OpenApi.Models.ParameterLocation.Header,
        Description = "Enter 'Bearer' [space] and then your token"
    });

    c.AddSecurityRequirement(new Microsoft.OpenApi.Models.OpenApiSecurityRequirement
    {
        {
            new Microsoft.OpenApi.Models.OpenApiSecurityScheme
            {
                Reference = new Microsoft.OpenApi.Models.OpenApiReference
                {
                    Type = Microsoft.OpenApi.Models.ReferenceType.SecurityScheme,
                    Id = "Bearer"
                }
            },
            new string[]{ }
        }
    });
});

var app = builder.Build();

// ==========================
// Middleware Pipeline
// ==========================
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

app.UseAuthentication();   // חייב לפני Authorization
app.UseAuthorization();

app.MapControllers();

app.Run();