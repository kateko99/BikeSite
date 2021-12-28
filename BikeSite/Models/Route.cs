using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace BikeSite.Models
{
    public class Route
    {
        public int RouteId { get; set; }
        public int UserId { get; set; }
        public string Geometry { get; set; }
        public string Description { get; set; }
        public string Type { get; set; }
        public double Length {get; set;}
        public DateTime Date { get; set; }
    }
}
