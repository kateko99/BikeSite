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
using System.Text.Json;

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

        /*
        [HttpPost]
        public IActionResult Register(string username, string email, string password)
        {

            _userService.AddNewUser("cookies", )
        }  */


        public class JsonRoute {
            public string Geometry { get; set; }
            public string Name { get; set; }
            public string Description { get; set; }
            public int Asphalt { get; set; }
            public int Cycle { get; set; }
            public int Forest { get; set; }
            public int Other { get; set; }
            public int Rest { get; set; }
            public string Type { get; set; }
            public double Length { get; set; }
            public bool Fav { get; set; }
            public DateTime Date { get; set; }
            public string Difficulty { get; set; }
        }

        //[FromBody]string name, string desc, string geo, string pave, double length, bool fav, DateTime date
        [HttpPost]
        public ActionResult CreateRoute([FromBody] JsonRoute result)    // tu być może trzeba [FromBody] przed całością
        {
            string user_nameid = User.FindFirst(ClaimTypes.NameIdentifier).Value;
            var user = _userService.GetUserByIdProvider(user_nameid);
            Route new_route = new Route();
            new_route.UserId = user.UserId;
            new_route.Geometry = result.Geometry;
            new_route.Name = result.Name;
            new_route.Description = result.Description;
            new_route.Asphalt = result.Asphalt;
            new_route.Cycle = result.Cycle;
            new_route.Forest = result.Forest;
            new_route.Other = result.Other;
            new_route.Rest = result.Rest;
            new_route.Type = result.Type;
            new_route.Length = result.Length;
            new_route.Date = result.Date;
            new_route.Difficulty = result.Difficulty;
            string u_name = user.Firstname;
            string u_lastname = user.Lastname;
            if(result.Fav)
            {
                _userService.AddNewFavRoute(new_route, user_nameid);
            }
            else
            {
                _userService.AddNewRoute(new_route);
            }
            //string message = "SUCCESS";
            return Json(new { name = u_name, lastname = u_lastname });
        }

        public class JsonSearch
        {
            public string Length { get; set; }
            public string Difficulty { get; set; }
            public string Pavement { get; set; }
        }
        public ActionResult SearchRoutes([FromBody] JsonSearch search)
        {
            double min = 0;
            double max = 1000;
            if(search.Length=="len1")
            {
                max = 10;
            }
            else if(search.Length=="len2") {
                min = 10;
                max = 30;
            }
            else if(search.Length=="len3")
            {
                min = 30;
                max = 60;
            }
            else
            {
                min = 60;
            }
            var list = _userService.FindRoutes(min, max, search.Difficulty, search.Pavement);
            var json = JsonSerializer.Serialize(list);
            return Json(json);
        }

        /*
        public ActionResult GetFavRoutes(string id)
        {
            var providerId = this.User.FindFirstValue(ClaimTypes.NameIdentifier);
            var appUser = _userService.GetUserByIdProvider(providerId);
            string name_id = appUser.NameIdentifier;
            var list = _userService.
            var json = JsonSerializer.Serialize(list);
            return Json(json);
            return x;
        }
        */
    }
}
