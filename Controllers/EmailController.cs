using BusinessLogic.Services;


namespace ProiectPWEB_MU.Controllers
{
    public class EmailController : BaseController
    {
        private readonly EmailService Service;
        public EmailController(ControllerDependencies dependencies, EmailService service)
           : base(dependencies)
        {
            Service = service;
        }
    }
}
