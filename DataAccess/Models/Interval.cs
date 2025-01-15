using System;
using System.Collections.Generic;

namespace DataAccess.Models
{
    public partial class Interval : IEntity
    {
        public Interval()
        {
            Requests = new HashSet<Request>();
            Offers = new HashSet<Offer>();
        }

        public Guid DateId { get; set; }
        public DateTime StartDate { get; set; }
        public DateTime EndDate { get; set; }

        public virtual ICollection<Request> Requests { get; set; }

        public virtual ICollection<Offer> Offers { get; set; }
    }
}
