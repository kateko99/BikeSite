using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace BikeSite.Data
{
    public class AppUser
    {
        public int UserId { get; set; }
        public string Provider { get; set; }
        public string NameIdentifier { get; set; }
        public string Username { get; set; }
        public string Password { get; set; }
        public string Firstname { get; set; }
        public string Lastname { get; set; }
        public string Email { get; set; }
        public DateTime BirthDate { get; set; }
        public DateTime StartDate { get; set; }
        public string Role { get; set; }
    }
}
