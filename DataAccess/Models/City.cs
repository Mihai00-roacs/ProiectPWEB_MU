using System;
using System.Collections.Generic;

namespace DataAccess.Models
{
    public partial class City : IEntity
    {
        public City()
        {
            Users = new HashSet<User>();
        }

        public Guid CityId { get; set; }
        public string Nume { get; set; } = null!;
        public string Judet { get; set; } = null!;

        public virtual ICollection<User> Users { get; set; }
    }
}
