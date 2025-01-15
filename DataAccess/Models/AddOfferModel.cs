using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc.Rendering;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace DataAccess.Models
{
    public class AddOfferModel : IEntity
    {
    
        public AddOfferModel()
        {

        }

        [Required(ErrorMessage = "Required")]
        public Guid OfferId { get; set; } = Guid.NewGuid();
        public Guid? OwnerId { get; set; }
        [Required(ErrorMessage = "Required")]

        [RegularExpression("^[0-9]{4}$", ErrorMessage = "Only 4 digits!")]
        public int Year { get; set; }
        [Required(ErrorMessage = "Required")]
        [RegularExpression("^[0-9]{1,7}$", ErrorMessage = "Max 7 digits!")]
        public int Milleage { get; set; }
        [Required(ErrorMessage = "Required")]
        public int SizeId { get; set; }
        [Required(ErrorMessage = "Required")]
        public int ColorId { get; set; }
        [Required(ErrorMessage = "Required")]
        public string Description { get; set; }
        [Required(ErrorMessage = "Required")]
        public int TypeId { get; set; }
        [Required(ErrorMessage = "Required")]
        public int ProducerId { get; set; }
        public List<SelectListItem>? Colors { get; set; }
        public List<SelectListItem>? Producers { get; set; }
        public List<SelectListItem>? Sizes { get; set; }
        public List<SelectListItem>? Types { get; set; }
        public List<Position>? CarsPositions { get; set; }
        public decimal Xcoordinate { get; set; }  // Property renamed to match JSON
        public decimal Ycoordinate { get; set; }  // Property renamed to match JSON
        public Position? currentCarPosition { get; set; }
    }
}
