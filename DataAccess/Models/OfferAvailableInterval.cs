using DataAccess;
using System;
using System.Collections.Generic;

namespace DataAccess.Models
{
    public partial class OfferAvailableInterval : IEntity
    {
        public Guid DateId { get; set; }
        public Guid OfferId { get; set; }
        public string? Dadas { get; set; }

        public virtual Interval Date { get; set; } = null!;
        public virtual Offer Offer { get; set; } = null!;
    }
}
