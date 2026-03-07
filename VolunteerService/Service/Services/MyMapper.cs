using AutoMapper;
using Repository.Entities;
using Service.Dto;
using System;
using System.Linq;
using static System.Runtime.InteropServices.JavaScript.JSType;

namespace Service.Services
{
    public class MyMapper : Profile
    {
        public MyMapper()
        {
            // ================= Users =================
            // ממפה Users ל-UsersDto
            // ================= Users =================
            // ================= Users =================
            CreateMap<Users, UsersDto>()
             .ForMember(dest => dest.Categories,
               opt => opt.MapFrom(src => src.UserCategories
                   .Select(uc => new CategoriesDto { Id = uc.CategoryID }).ToList()))
             .ForMember(dest => dest.Availabilities,
               opt => opt.MapFrom(src => src.Availabilities
        .Select(ua => new AvailabilitiesDto
        {

            Id = ua.Id,
            UserID = ua.UserID,
            Day = ua.Availability.Day,
            From_Time = ua.Availability.From_Time,
            To_Time = ua.Availability.To_Time
        }).ToList()));

            // ממפה UsersDto חזרה ל-Users
            CreateMap<UsersDto, Users>()
                .ForMember(dest => dest.UserCategories, opt => opt.Ignore()) // ימולא ידנית לפי CategoryIds
                .ForMember(dest => dest.Availabilities, opt => opt.Ignore()); // ימולא ידנית לפי AvailabilitiesDto

            // ================= Register/Login =================
            CreateMap<RegisterDto, Users>()
                .ForMember(dest => dest.EncryptedPassword, opt => opt.MapFrom(src => src.Password)); // הצפנה חיצונית
            CreateMap<LoginDto, Users>();

            // ================= Categories =================
            CreateMap<Categories, CategoriesDto>().ReverseMap();

            // ================= Availabilities =================
            CreateMap<AvailabilitiesDto, Availabilities>()
     .ForMember(dest => dest.From_Time, opt => opt.MapFrom(src => src.From_Time))
     .ForMember(dest => dest.To_Time, opt => opt.MapFrom(src => src.To_Time));

            CreateMap<Availabilities, AvailabilitiesDto>()
             .ForMember(dest => dest.From_Time, opt => opt.MapFrom(src => src.From_Time))
             .ForMember(dest => dest.To_Time, opt => opt.MapFrom(src => src.To_Time));

            // ================= HelpRequests =================
            CreateMap<HelpRequests, HelpRequestsDto>().ReverseMap();

            // ================= Assignments =================
            CreateMap<Assignments, AssignmentsDto>().ReverseMap();

            // ================= ChatMessages =================
            CreateMap<ChatMessages, ChatMessagesDto>().ReverseMap();
        }
    }
}