using Repository.Entities;
using System;
using System.Collections.Generic;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Service.Dto
{
    public class UsersDto
    {
        public int Id { get; set; }

        [Required(ErrorMessage = "שם הוא שדה חובה")]
        [StringLength(100, MinimumLength = 2)]
        public string FullName { get; set; }

        [Required]
        [EmailAddress(ErrorMessage = "מייל לא תקין")]
        public string Email { get; set; }

        [Required]
        [RegularExpression(@"^\d{9,10}$", ErrorMessage = "טלפון לא תקין")]
        public string Phone { get; set; }

        public string Adress { get; set; }
        public UserRole UserRole { get; set; }
        public double Rating { get; set; }
        public List<CategoriesDto> Categories { get; set; } = new List<CategoriesDto>();
        public List<AvailabilitiesDto> Availabilities { get; set; } = new List<AvailabilitiesDto>();
    }
}

