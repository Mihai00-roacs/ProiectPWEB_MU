using System;
using System.Collections.Generic;

namespace DataAccess.Models
{
    public partial class Color : IEntity
    {
        public Color()
        {
            Offers = new HashSet<Offer>();
        }

        public int ColorId { get; set; }
        public string ColorName { get; set; } = null!;

        public virtual ICollection<Offer> Offers { get; set; }
    }
}
