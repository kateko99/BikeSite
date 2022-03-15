using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System.ComponentModel.DataAnnotations;

namespace BikeSite.Models
{
    public class Route
    {
        [Key][Required]
        public int RouteId { get; set; }
        [Required]
        public int UserId { get; set; }
        [Required]
        public string Geometry { get; set; }
        [Required]
        public string Name { get; set; }
        public string Description { get; set; }
        public int Asphalt { get; set; }
        public int Cycle { get; set; }
        public int Forest { get; set; }
        public int Other { get; set; }
        public int Rest { get; set; }
        public string Type { get; set; }
        public string Difficulty { get; set; }
        public double Length {get; set;}
        public DateTime Date { get; set; }

    }
}
