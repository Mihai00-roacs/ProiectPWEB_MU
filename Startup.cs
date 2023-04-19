using AutoMapper;
using DataAccess;
using Microsoft.EntityFrameworkCore;

namespace ProiectPWEB_MU
{
    public class Startup
    {
        readonly String MyAllowSpecificOrigins = "_myAllowSpecificOrigins";
        public Startup(IConfiguration configuration)
        {
            Configuration = configuration;
        }

        public IConfiguration Configuration { get; }

        // This method gets called by the runtime. Use this method to add services to the container.
        public void ConfigureServices(IServiceCollection services)
        {
            services.AddSingleton<IHttpContextAccessor, HttpContextAccessor>();

            services.AddTransient<IEmailSender, EmailSender>();

            services.AddControllersWithViews(options =>
            {
                options.Filters.Add(typeof(GlobalExceptionFilterAttribute));
            });
            services.AddDbContext<ProiectPWEBContext>(options =>
            {
                options.UseSqlServer(Configuration["ConnectionStrings:DefaultConnection"]);
            });
            services.AddScoped<UnitOfWork>();

            services.AddSocializRCurrentUser();

            services.AddPresentation();
            services.AddSocializRBusinessLogic();

            services.AddAuthentication("SocializRCookies")
                   .AddCookie("SocializRCookies", options =>
                   {
                       options.AccessDeniedPath = new PathString("/Exception/AccessDenied");
                       options.LoginPath = new PathString("/UserAccount/Login");
                   });
            var mapperConfig = new MapperConfiguration(mc =>
            {
                mc.AddProfile(new MappingProfile());
            });

            IMapper mapper = mapperConfig.CreateMapper();
            services.AddSingleton(mapper);
            services.AddCors(o => o.AddPolicy("ReactPolicy", builder =>
            {
                builder.AllowAnyOrigin()
                       .AllowAnyMethod()
                       .AllowAnyHeader();
            }));
            services.AddMvc();
        }

        // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
        public void Configure(IApplicationBuilder app, IWebHostEnvironment env)
        {
            if (env.IsDevelopment())
            {
                app.UseDeveloperExceptionPage();
            }
            else
            {
                app.UseExceptionHandler("/Home/Error");
                // The default HSTS value is 30 days. You may want to change this for production scenarios, see https://aka.ms/aspnetcore-hsts.
                app.UseHsts();
            }
            app.UseHttpsRedirection();
            app.UseStaticFiles();
            app.UseRouting();
            app.UseCors("ReactPolicy");
            app.UseAuthentication();
            app.UseAuthorization();

            app.UseEndpoints(endpoints =>
            {
                endpoints.MapControllerRoute(
                    name: "default",
                    pattern: "{controller=Home}/{action=Index}");
            });
        }
    }
}
