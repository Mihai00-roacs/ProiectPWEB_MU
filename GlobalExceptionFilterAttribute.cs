using Microsoft.AspNetCore.Mvc.Filters;
using Microsoft.AspNetCore.Mvc;

namespace ProiectPWEB_MU
{
    [AttributeUsage(AttributeTargets.Class | AttributeTargets.Method, AllowMultiple = true, Inherited = true)]
    public sealed class GlobalExceptionFilterAttribute : ExceptionFilterAttribute
    {
        private readonly ILogger<GlobalExceptionFilterAttribute> logger;

        public GlobalExceptionFilterAttribute(ILogger<GlobalExceptionFilterAttribute> logger)
        {
            this.logger = logger;
        }

        public override void OnException(ExceptionContext context)
        {
            context.ExceptionHandled = true;

            switch (context.Exception)
            {
                case NotFoundErrorException notFound:
                    context.Result = new ViewResult
                    {
                        ViewName = "Views/Shared/Error_NotFound.cshtml"
                    };

                    break;

                case UnauthorizedAccessException unauthorizedAccess:
                    context.Result = new ViewResult
                    {
                        ViewName = "Views/Shared/Error_Unauthorized.cshtml"
                    };
                    break;

                default:
                    context.Result = new ViewResult
                    {
                        ViewName = "Views/Shared/Error_InternalServerError.cshtml"
                    };
                    break;
            }
        }
    }
}
