using System;
using System.Collections.Generic;

namespace DataAccess.Models
{
    public partial class RequestState : IEntity
    {
        public RequestState()
        {
            Requests = new HashSet<Request>();
        }

        public int StateId { get; set; }
        public string State { get; set; } = null!;

        public virtual ICollection<Request> Requests { get; set; }
    }
}
