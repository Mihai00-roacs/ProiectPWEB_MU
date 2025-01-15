using System;
using System.Collections.Generic;

namespace DataAccess.Models
{
    public partial class Producer : IEntity
    {
        public Producer()
        {
            Offers = new HashSet<Offer>();
        }

        public int ProducerId { get; set; }
        public string ProducerName { get; set; } = null!;

        public virtual ICollection<Offer> Offers { get; set; }
    }
}
