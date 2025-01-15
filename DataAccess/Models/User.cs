using System;
using System.Collections.Generic;

namespace DataAccess.Models
{
    public partial class User : IEntity
    {
        public User()
        {
            Offers = new HashSet<Offer>();
            Requests = new HashSet<Request>();
        }

        public Guid UserId { get; set; }
        public string UserName { get; set; } = null!;
        public string FirstName { get; set; } = null!;
        public string LastName { get; set; } = null!;
        public string Email { get; set; } = null!;
        public string PhoneNumber { get; set; } = null!;
        public string Password { get; set; } = null!;
        public byte[] Photo { get; set; } = null!;
        public Guid CityId { get; set; }

        public virtual City City { get; set; } = null!;
        public virtual ICollection<Offer> Offers { get; set; }
        public virtual ICollection<Request> Requests { get; set; }
    }
}
