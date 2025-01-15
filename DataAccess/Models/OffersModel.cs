using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DataAccess.Models
{
    public class OffersModel
    {
        public List<OfferDetailsModel>? offers { get; set; }
        public bool useInfinityScroll { get; set; }
        public List<Position>? CarsPositions { get; set; }
    }
}
