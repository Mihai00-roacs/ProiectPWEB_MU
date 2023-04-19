using BusinessLogic;

namespace ProiectPWEB_MU
{
    public class ControllerDependencies
    {
        public CurrentUserDTO CurrentUser { get; set; }

        public ControllerDependencies(CurrentUserDTO currentUser)
        {
            this.CurrentUser = currentUser;
        }
    }
}
