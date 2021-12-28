using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace BikeSite.Models
{
    public class Rating
    {
        public int RatingId { get; set; }
        public int RouteId { get; set; }
        public int UserId { get; set; }
        public int Value { get; set; }
        public DateTime Date { get; set; }
    }
}
