using BikeSite.Models;
using BikeSite.Services;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc.TagHelpers;

namespace BikeSite.Controllers
{
    public class UserController : Controller
    {
        private readonly ILogger<UserController> _logger;
        private readonly UserService _userService;

        public UserController(ILogger<UserController> logger, UserService userService)  //korzystamy z dependency injection
        {
            _logger = logger;
            _userService = userService;
        }
        public IActionResult Index()
        {
            return View();
        }
        
        public async Task<IActionResult> MyAccount()
        {
           var idToken = await HttpContext.GetTokenAsync("id_token");
            return View();
        }
        
        /*
        public IActionResult MyAccount()
        {
            return View();
        }  */


        [HttpGet("login")]
        public IActionResult Login(string returnUrl)
        {
            ViewData["returnUrl"] = returnUrl;
            return View();
        }

        [HttpGet("login/{provider}")]
        public IActionResult LoginExternal([FromRoute] string provider, [FromQuery] string returnUrl)
        {
            if (User != null && User.Identities.Any(identity => identity.IsAuthenticated))
            {
                RedirectToAction("", "Home");
            }
            returnUrl = string.IsNullOrEmpty(returnUrl) ? "/" : returnUrl;
            var authenticationProperties = new AuthenticationProperties { RedirectUri = returnUrl };
            return new ChallengeResult(provider, authenticationProperties);
        }

        [HttpPost("login")]
        public async Task<IActionResult> Validate(string username, string password, string returnUrl)
        {
            ViewData["ReturnUrl"] = returnUrl;
            if (_userService.TryValidateUser(username, password, out List<Claim> claims))
            {
                var claimsIdentity = new ClaimsIdentity(claims, CookieAuthenticationDefaults.AuthenticationScheme);
                //tworzymy cookie
                var claimsPrincipal = new ClaimsPrincipal(claimsIdentity); //tworzymy "bilet" z cookie
                var items = new Dictionary<string, string>();
                items.Add(".AuthScheme", CookieAuthenticationDefaults.AuthenticationScheme);
                var properties = new AuthenticationProperties(items);
                await HttpContext.SignInAsync(claimsPrincipal, properties); //logujemy się z konkretnym biletem cookie, 
                //powstaje cookie, możemy zobaczyć je w narzędziach deweloperskich - "Aplikacja"
                return Redirect(returnUrl);
            }
            else
            {
                TempData["Error"] = "Error. Username or password is invalid";
                return View("login");
            }

        }

        [Authorize]
        public async Task<IActionResult> Logout()
        {
            var scheme = User.Claims.FirstOrDefault(c => c.Type == ".AuthScheme").Value;
            if (scheme == "google")
            {
                await HttpContext.SignOutAsync();
                return Redirect(@"https://www.google.com/accounts/Logout?continue=https://appengine.google.com/_ah/logout?continue=https://localhost:44359");
            }
            else
            {
                return new SignOutResult(new[] { CookieAuthenticationDefaults.AuthenticationScheme, scheme });
            }

            await HttpContext.SignOutAsync(); //cookie jest usuwane z przeglądarki, wylogowuje tylko ze schematu
            // domyślnego (z default scheme)
            return Redirect(@"https://www.google.com/accounts/Logout?continue=https://appengine.google.com/_ah/logout?continue=https://localhost:5001");  //link mówi nam gdzie wrócić po wylogowaniu, wraca do aplikacji
        }

        public IActionResult Register()
        {
            return View();
        }
    }
}
