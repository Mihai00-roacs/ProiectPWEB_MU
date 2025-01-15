using BusinessLogic.Services;
using BusinessLogic;
using DataAccess.Models;
using DataAccess;
using Google.Authenticator;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Rendering;
using System.Security.Claims;
using System.Text;
using System.Text.Json;
using Microsoft.AspNetCore.Cors;
using Microsoft.AspNetCore.Authorization;

namespace ProiectPWEB_MU.Controllers
{
    [Route("useraccount")]
    [ApiController]
    [EnableCors("ReactPolicy")]
    public class UserAccountController : BaseController
    {
        private readonly UserAccountService Service;
        private readonly IEmailSender Sender;
        public IConfiguration Configuration { get; }
        public UserAccountController(ControllerDependencies dependencies, UserAccountService service, IEmailSender sender, IConfiguration configuration)
           : base(dependencies)
        {
            Sender = sender;
            Service = service;
            Configuration = configuration;
        }

        [Route("emailAvailability")]
        public async Task<bool> CheckEmailAvailability(String email) => await Service.CheckEmailAvailability(email);

        [Route("userAvailability")]
        public async Task<bool> CheckUsernameAvailability(String userName) => await Service.CheckUsernameAvailability(userName);

        [Route("Register")]
        [HttpPost]
        public async Task<bool> Register( RegisterModel model)
        {
            var emailAvailable = await Service.CheckEmailAvailability(model.Email);
            var userAvailable = await Service.CheckUsernameAvailability(model.UserName);
          
            if (!emailAvailable || !userAvailable)
            {
                return false;
            }

            await Service.RegisterNewUser(model);
            return true;
        }
        [Route("GetCities")]
        [HttpGet]
        public async Task<List<SelectListItem>> GetCities(string search, int page)
        {
            if (search != null)
            {
                return await Service.AddCitiesForUserRegister(search);
            }
            return new List<SelectListItem>();
        }
        public IActionResult Preview(string act, string ctl, string obj)
        {
            TempData["Data"] = obj;
            return RedirectToAction(act, ctl);
        }
        [HttpPost]
        [Route("Login")]
        public async Task<bool> Login(LoginModel model)
        {
            var checkEmail = await Service.CheckEmail(model.Email);
            var checkCredentials = await Service.CheckUserCredentials(model.Email, model.Password);

            if (!checkEmail || !checkCredentials || model.Password == String.Empty)
            {
                return false;
            }
            return true;
        }
        [HttpGet]
        [Route("GetImage")]
        public Image2FactorModel GetImageFor2Factor(String Email)
        {
      
            var twoFactorAuthenticator = new TwoFactorAuthenticator();
            var TwoFactorSecretCode = Configuration["CommonSettings:SecretCode"];
            var accountSecretKey = $"{TwoFactorSecretCode}-{Email}";
            var setupCode = twoFactorAuthenticator.GenerateSetupCode("CarSharing", "Peer to Peer Car Sharing",
                Encoding.ASCII.GetBytes(accountSecretKey));
            Image2FactorModel image2FactorModel = new()
            {
                Key = accountSecretKey,
                BarcodeImageUrl = setupCode.QrCodeSetupImageUrl,
                SetupCode = setupCode.ManualEntryKey
            };
          
            return image2FactorModel;
        }

        [HttpPost]
        [Route("Login2FactorPost")]
        public async Task<bool> LoginWith2Factor(LoginWith2FactorModel loginModel)
        {
            var twoFactorAuthenticator = new TwoFactorAuthenticator();
            var checkValidity = twoFactorAuthenticator.ValidateTwoFactorPIN(loginModel.Key, loginModel.InputCode);
            if (loginModel.Email == null || loginModel.Password==null)
            {
                return false;
            }
            if (!checkValidity)
            {
                return false;
            }
            var user = await Service.LoginAsync(loginModel.Email, loginModel.Password);

            if (!user.IsAuthenticated)
            {
                return false;
            }

            await LogIn(user);
            return true;
        }
        [Route("currentUser")]
        public CurrentUserDTO GetCurrentUser()
        {
            return CurrentUser;
        }
        [HttpGet]
        [Route("Logout")]
        public async Task<bool> Logout()
        {
            await LogOut();

            return true;
        }
        private async Task LogIn(CurrentUserDTO user)
        {
            var claims = new List<Claim>
            {
                new Claim("Id", user.UserId.ToString()),
                new Claim(ClaimTypes.Name, $"{user.FirstName} {user.LastName}"),
                new Claim(ClaimTypes.Email, user.Email),
                new Claim(ClaimTypes.NameIdentifier,user.UserName)
            };
            var identity = new ClaimsIdentity(claims, "Cookies");
            var principal = new ClaimsPrincipal(identity);
            await HttpContext.SignInAsync(
                    scheme: "SocializRCookies",
                    principal: principal);
        }
        /*[HttpGet]
        [Authorize]
        public async Task<ActionResult> UserProfile(Guid id)
        {
            var model = await Service.GetUserProfileModel(id);
            return View(model);
        }*/
        /*[HttpGet]
        [Authorize]
        public async Task<ActionResult> EditUser(Guid id)
        {
            if (CurrentUser.UserId == id)
            {
                var model = await Service.GetUserProfileModel(id);
                model.Cities = new List<SelectListItem>();
                await Service.AddCitiesForUserRegister(model);
                return View("EditUser", model);
            }
            return View("AccessDenied");
        }*/
        /*[HttpPost]
        [Authorize]
        public async Task<IActionResult> EditUser(UserProfileModel model)
        {
            if (CurrentUser.UserId == model.UserId)
            {
                if (!ModelState.IsValid)
                {
                    await Service.AddCitiesForUserRegister(model);
                    return View(model);
                }
                var OK = 1;
                if (!await Service.CheckEmailAvailability(model.Email, CurrentUser.Email))
                {
                    OK = 0;
                    ModelState.AddModelError("Email", "Email is already in base");
                }
                if (!await Service.CheckUsernameAvailability(model.UserName, CurrentUser.UserName))
                {
                    OK = 0;
                    ModelState.AddModelError("UserName", "UserName is already in base");
                }
                if (OK == 0)
                {
                    await Service.AddCitiesForUserRegister(model);
                    return View(model);
                }

                await Service.EditUser(model);

                return RedirectToAction("UserProfile", "UserAccount", new { id = model.UserId.ToString() });
            }
            else
            {
                return View("AccessDenied");
            }
        }*/
        private async Task LogOut() => await HttpContext.SignOutAsync(scheme: "SocializRCookies");
    }
}
