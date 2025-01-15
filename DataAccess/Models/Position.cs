using System;
using System.Collections.Generic;

namespace DataAccess.Models
{
    public partial class Position : IEntity
    {
        public Position()
        {
            Offers = new HashSet<Offer>();
        }

        public Guid PositionId { get; set; }
        public decimal Xcoordinate { get; set; }
        public decimal Ycoordinate { get; set; }

        public virtual ICollection<Offer> Offers { get; set; }
    }
}
