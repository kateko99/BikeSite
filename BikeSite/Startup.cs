using BikeSite.Data;
using BikeSite.Services;
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Authentication.OpenIdConnect;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.HttpsPolicy;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.IdentityModel.Tokens;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using Npgsql;
using Microsoft.EntityFrameworkCore.Design;
using Microsoft.AspNetCore.Mvc.TagHelpers;


namespace BikeSite
{
    public class Startup
    {
        public Startup(IConfiguration configuration)
        {
            Configuration = configuration;
        }

        public IConfiguration Configuration { get; }

        // This method gets called by the runtime. Use this method to add services to the container.
        public void ConfigureServices(IServiceCollection services)
        {
            services.AddControllersWithViews();
            IServiceCollection serviceCollection = services.AddDbContext<BikeDbContext>(options => options.UseNpgsql(Configuration.GetConnectionString("DefaultConnection")));
            services.AddScoped<UserService>();  //potrzebne do dependency injection
            services.AddAuthentication(options =>
            {
                options.DefaultScheme = CookieAuthenticationDefaults.AuthenticationScheme;
                options.DefaultChallengeScheme = CookieAuthenticationDefaults.AuthenticationScheme;
            })
                .AddCookie(options =>
                {
                    options.LoginPath = "/login";
                    options.AccessDeniedPath = "/denied";  //pojawi siê gdy u¿ytkownik nie ma odpowiedniej roli ¿eby przejœæ na stronê
                    options.Events = new CookieAuthenticationEvents()
                    {
                        OnSigningIn = async context =>
                        {
                            var scheme = context.Properties.Items.Where(k => k.Key == ".AuthScheme").FirstOrDefault(); //zapisujemy, którym sposobem logowania logowa³ siê u¿ytkownik
                            var claim = new Claim(scheme.Key, scheme.Value); //zapisujemy rodzaj schematu logowania
                            var claimsIdentity = context.Principal.Identity as ClaimsIdentity;
                            var userService = context.HttpContext.RequestServices.GetRequiredService(typeof(UserService)) as UserService;
                            var nameIdentifier = claimsIdentity.Claims.FirstOrDefault(m => m.Type == ClaimTypes.NameIdentifier)?.Value;
                            if (userService != null && nameIdentifier != null)
                            {
                                var appUser = userService.GetUserByExternalProvider(scheme.Value, nameIdentifier);
                                if (appUser is null)
                                {
                                    appUser = userService.AddNewUser(scheme.Value, claimsIdentity.Claims.ToList());

                                }
                                //claimsIdentity.AddClaim(new Claim(ClaimTypes.Role, appUser.Role));
                            }

                            claimsIdentity.AddClaim(claim);
                            await Task.CompletedTask;

                        },
                    };
                })

                .AddOpenIdConnect("google", options =>
                {
                    options.Authority = Configuration["GoogleOpenId:Authority"];
                    options.ClientId = Configuration["GoogleOpenId:ClientId"];
                    options.ClientSecret = Configuration["GoogleOpenId:ClientSecret"];
                    options.CallbackPath = Configuration["GoogleOpenId:CallbackPath"];
                    options.SignedOutCallbackPath = Configuration["GoogleOpenId:SignedOutCallbackPath"];
                    options.SaveTokens = false;
                    options.TokenValidationParameters = new TokenValidationParameters
                    {
                        NameClaimType = "name",
                    };

                }); 
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
            //NpgsqlConnection.GlobalTypeMapper.UseNetTopologySuite();  //dodane ¿eby po³aczyæ z PostGIS
            app.UseHttpsRedirection();
            app.UseStaticFiles();
            app.UseDeveloperExceptionPage();  //dodane

            app.UseRouting();
            app.UseAuthentication();
            app.UseAuthorization();

            app.UseEndpoints(endpoints =>
            {
                endpoints.MapControllerRoute(
                    name: "default",
                    pattern: "{controller=Home}/{action=Index}/{id?}");
            });
        }
    }
}
