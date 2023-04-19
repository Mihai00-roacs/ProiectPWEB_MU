using BusinessLogic;
using BusinessLogic.Services;
using System.Security.Claims;

namespace ProiectPWEB_MU
{
    public static class ServiceCollectionExtensionMethods
    {
        public static IServiceCollection AddPresentation(this IServiceCollection services)
        {
            services.AddScoped<ControllerDependencies>();

            return services;
        }

        public static IServiceCollection AddSocializRBusinessLogic(this IServiceCollection services)
        {
            services.AddScoped<ServiceDependencies>();
            services.AddScoped<UserAccountService>();
            services.AddScoped<OfferService>();
            services.AddScoped<RequestService>();
            services.AddScoped<EmailService>();
            return services;
        }

        public static IServiceCollection AddSocializRCurrentUser(this IServiceCollection services)
        {
            services.AddScoped(s =>
            {
                var accessor = s.GetService<IHttpContextAccessor>();
                var httpContext = accessor.HttpContext;
                var claims = httpContext.User.Claims;
                var userIdClaim = claims?.FirstOrDefault(c => c.Type == "Id")?.Value;
                var isGood = Guid.TryParse(userIdClaim, out var id);
                return new CurrentUserDTO
                {
                    UserId = id,
                    IsAuthenticated = httpContext.User.Identity.IsAuthenticated,
                    Email = claims?.FirstOrDefault(c => c.Type == ClaimTypes.Email)?.Value,
                    FirstName = claims?.FirstOrDefault(c => c.Type == ClaimTypes.Name)?.Value,
                    UserName = claims?.FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier)?.Value
                };
            });

            return services;
        }
    }
}
