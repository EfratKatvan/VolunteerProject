using Repository.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Service.Dto
{
    public class AvailabilitiesDto
    {
        
        public DAY Day { get; set; }
        public TimeSpan From_Time { get; set; }
        public TimeSpan To_Time { get; set; }

    }

}
