using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DataAccess.Models
{
    public class OfferDetailsModel
    {
        public Guid OfferId { get; set; }
        public string OwnerName { get; set; }
        public int Year { get; set; }
        public int Milleage { get; set; }
        public string SizeName { get; set; }
        public string ColorName { get; set; }
        public string Description { get; set; } = null!;
        public string TypeName { get; set; }
        public string ProducerName { get; set; }
        public decimal XCoordinate { get; set; }
        public decimal YCoordinate { get; set; }
        public override int GetHashCode()
        {
            return OfferId.GetHashCode();
        }

        public override bool Equals(object? obj)
        {
            if (obj == null)
                return false;

            OfferDetailsModel model = (OfferDetailsModel) obj;
            return this.OfferId.Equals(model.OfferId);
        }
    }
}
