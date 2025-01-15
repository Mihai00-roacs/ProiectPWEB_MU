using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc.Rendering;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using Microsoft.AspNetCore.Mvc;

namespace DataAccess.Models
{
    public class AddOfferIntervalsModel : IEntity
    {
        public AddOfferIntervalsModel()
        {
        }

        public Guid OfferId { get; set; }
        [Required(ErrorMessage = "Required")]
        public DateTime StartDate { get; set; }
        [Required(ErrorMessage = "Required")]
        public DateTime EndDate { get; set; }
    }
}
