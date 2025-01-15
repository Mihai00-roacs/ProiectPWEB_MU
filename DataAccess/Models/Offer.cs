using System;
using System.Collections.Generic;

namespace DataAccess.Models
{
    public class Offer : IEntity
    {
        public Offer()
        {
            Requests = new HashSet<Request>();
            Dates = new HashSet<Interval>();
        }

        public Guid OfferId { get; set; }
        public Guid OwnerId { get; set; }
        public int Year { get; set; }
        public int Milleage { get; set; }
        public int SizeId { get; set; }
        public int ColorId { get; set; }
        public string Description { get; set; } = null!;
        public int TypeId { get; set; }
        public int ProducerId { get; set; }
        public Guid PositionId { get; set; }

        public virtual Color Color { get; set; } = null!;
        public virtual User Owner { get; set; } = null!;
        public virtual Position Position { get; set; } = null!;
        public virtual Producer Producer { get; set; } = null!;
        public virtual Size Size { get; set; } = null!;
        public virtual Type Type { get; set; } = null!;
        public virtual ICollection<Request> Requests { get; set; }

        public virtual ICollection<Interval> Dates { get; set; }
    }
}
