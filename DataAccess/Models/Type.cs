using System;
using System.Collections.Generic;

namespace DataAccess.Models
{
    public partial class Type : IEntity
    {
        public Type()
        {
            Offers = new HashSet<Offer>();
        }

        public int TypeId { get; set; }
        public string TypeName { get; set; } = null!;

        public virtual ICollection<Offer> Offers { get; set; }
    }
}
