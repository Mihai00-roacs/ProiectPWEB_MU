﻿using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc.Rendering;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
namespace DataAccess.Models
{
    public class RegisterModel :IEntity
    {
        public List<SelectListItem>? Cities { get; set; }

        [RegularExpression("^[a-z0-9_\\+-]+(\\.[a-z0-9_\\+-]+)*@[a-z0-9-]+(\\.[a-z0-9]+)*\\.([a-z]{2,4})$", ErrorMessage = "Invalid email format.")]
        [Required(ErrorMessage = "Required")]
        [StringLength(50, ErrorMessage = "Max 50 characters")]
        public string Email { get; set; }

        [Required(ErrorMessage = "Required")]
        [RegularExpression("^(?=.*[0-9])(?=.*[!@#$%^&*])(?=.*[A-Z])[0-9a-zA-Z!@#$%^&*0-9]{10,}$", ErrorMessage = "The Password must have at least one numeric, one special character, one uppercase letter and have a length of at least 10.")]
        [StringLength(50, ErrorMessage = "Max 50 characters")]
        public string Password { get; set; }

        [Required(ErrorMessage = "Required")]
        [Compare(nameof(Password), ErrorMessage = "Passwords don't match.")]
        [StringLength(50, ErrorMessage = "Max 50 characters")]
        public string ConfirmPassword { get; set; }
        [Required(ErrorMessage = "Required")]
        [RegularExpression("^[a-zA-Z]*( [a-zA-Z]+)*$", ErrorMessage = "Given names must have letters and be delimited by only one space.")]
        [StringLength(50, ErrorMessage = "Max 50 characters")]
        public string FirstName { get; set; }

        [Required(ErrorMessage = "Required")]
        [RegularExpression("^[a-zA-Z]*$", ErrorMessage = "Last name must have only letters.")]
        [StringLength(50, ErrorMessage = "Max 50 characters")]
        public string LastName { get; set; }
        [Required(ErrorMessage = "Required")]
        [RegularExpression("^[a-zA-Z0-9]{5,}$", ErrorMessage = "Username must be of at least length 5 and have no special characters.")]
        [StringLength(50, ErrorMessage = "Max 50 characters")]
        public string UserName { get; set; }
        [Required(ErrorMessage = "Required")]
        public Guid CityId { get; set; }
        [Required(ErrorMessage = "Required")]
        public IFormFile Picture { get; set; }
        [Required(ErrorMessage = "Required")]
        [RegularExpression("^[0-9]+$", ErrorMessage = "This is a phone number. Only digits!")]
        [StringLength(10, ErrorMessage = "Max 10 characters")]
        public string PhoneNumber { get; set; }
        public Guid UserId { get; set; }

        public RegisterModel()
        {
        }
    }
}