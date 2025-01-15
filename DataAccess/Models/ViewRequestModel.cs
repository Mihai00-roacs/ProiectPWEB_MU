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
    public class ViewRequestModel : IEntity
    {
        public ViewRequestModel()
        {

        }
        public Guid RequestId { get; set; }
        public DateTime StartDate { get; set; }
        public DateTime EndDate { get; set; }
        public Guid OfferId { get; set; }
        public string BorrowerName { get; set; }
        public string State { get; set; }
    }
}
