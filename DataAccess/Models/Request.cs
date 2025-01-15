using System;
using System.Collections.Generic;

namespace DataAccess.Models
{
    public partial class Request : IEntity
    {
        public Guid RequestId { get; set; }
        public Guid OfferId { get; set; }
        public Guid BorrowerId { get; set; }
        public int StateId { get; set; }
        public Guid IntervalId { get; set; }

        public virtual User Borrower { get; set; } = null!;
        public virtual Interval Interval { get; set; } = null!;
        public virtual Offer Offer { get; set; } = null!;
        public virtual RequestState State { get; set; } = null!;
    }
}
