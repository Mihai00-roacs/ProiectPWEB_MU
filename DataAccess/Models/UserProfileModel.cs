using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc.Rendering;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace DataAccess.Models
{
    public class UserProfileModel
    {
        public UserProfileModel()
        {
            Offers = new List<SelectListItem>();
            Requests = new List<SelectListItem>();
        }
        
        public Guid? UserId { get; set; }
        [Required(ErrorMessage = "Required")]
        [RegularExpression("^[a-zA-Z0-9]{5,}$", ErrorMessage = "Username must be of at least length 5 and have no special characters.")]
        [StringLength(50, ErrorMessage = "Max 50 characters")]
        public string UserName { get; set; } = null!;

        [Required(ErrorMessage = "Required")]
        [RegularExpression("^[a-zA-Z]*( [a-zA-Z]+)*$", ErrorMessage = "Given names must have letters and be delimited by only one space.")]
        [StringLength(50, ErrorMessage = "Max 50 characters")]
        public string FirstName { get; set; } = null!;
        [Required(ErrorMessage = "Required")]
        [RegularExpression("^[a-zA-Z]*$", ErrorMessage = "Last name must have only letters.")]
        [StringLength(50, ErrorMessage = "Max 50 characters")]
        public string LastName { get; set; } = null!;

        [RegularExpression("^[a-z0-9_\\+-]+(\\.[a-z0-9_\\+-]+)*@[a-z0-9-]+(\\.[a-z0-9]+)*\\.([a-z]{2,4})$", ErrorMessage = "Invalid email format.")]
        [Required(ErrorMessage = "Required")]
        [StringLength(50, ErrorMessage = "Max 50 characters")]
        public string Email { get; set; } = null!;
        [Required(ErrorMessage = "Required")]
        [RegularExpression("^[0-9]+$", ErrorMessage = "This is a phone number. Only digits!")]
        [StringLength(10, ErrorMessage = "Max 10 characters")]
        public string PhoneNumber { get; set; } = null!;
        public string? Password { get; set; } = null!;
        public string? Photo { get; set; } = null!;
        public IFormFile? Picture { get; set; } = null!;
        public string? City { get; set; }
        public Guid? CityId { get; set; } = Guid.Empty;
        public List<SelectListItem>? Cities { get; set; } = null!;
        public virtual List<SelectListItem> Offers { get; set; }
        public virtual List<SelectListItem> Requests { get; set; }
    }
}
