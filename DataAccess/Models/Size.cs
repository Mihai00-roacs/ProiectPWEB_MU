using System;
using System.Collections.Generic;

namespace DataAccess.Models
{
    public partial class Size : IEntity
    {
        public Size()
        {
            Offers = new HashSet<Offer>();
        }

        public int SizeId { get; set; }
        public string SizeName { get; set; } = null!;

        public virtual ICollection<Offer> Offers { get; set; }
    }
}
