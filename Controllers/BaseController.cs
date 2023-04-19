using BusinessLogic;
using Microsoft.AspNetCore.Mvc;

namespace ProiectPWEB_MU.Controllers
{
    public class BaseController : Controller
    {
        protected readonly CurrentUserDTO CurrentUser;

        public BaseController(ControllerDependencies dependencies)
            : base()
        {
            CurrentUser = dependencies.CurrentUser;
        }
    }
}
