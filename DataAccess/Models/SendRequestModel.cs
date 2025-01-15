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
    public class SendRequestModel : IEntity
    {
        public SendRequestModel()
        {

        }

        public Guid OfferId { get; set; }
        [Required(ErrorMessage = "Required")]
        public DateTime StartDate { get; set; }
        [Required(ErrorMessage = "Required")]
        public DateTime EndDate { get; set; }

        public List<Interval> availableIntervals { get; set; }

        public List<Interval> unavailableIntervals { get; set; }
    }
}
