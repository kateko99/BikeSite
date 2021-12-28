using BikeSite.Models;
using BikeSite.Services;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using System.Security.Claims;

namespace BikeSite.Controllers
{
    public class HomeController : Controller
    {
        private readonly ILogger<HomeController> _logger;
        private readonly UserService _userService;

        public HomeController(ILogger<HomeController> logger, UserService userService)  //korzystamy z dependency injection
        {
            _logger = logger;
            _userService = userService;  //to dodałam sama bo nie było
        }

        public IActionResult Index()
        {
            return View();
        }

        public IActionResult Privacy()
        {
            return RedirectToAction("MyAccount", "User");
            //return View();
        }

        [HttpGet("denied")]
        public IActionResult Denied()
        {
            return View();
        }

        public IActionResult Dashboard()
        {
            // var test = User.Identity;
            return View();
        }

        public async Task<IActionResult> News()
        {
            var idToken = await HttpContext.GetTokenAsync("id_token");
            return View();
        }
        public IActionResult AboutUs()
        {
            return View();
        }

        public IActionResult UserAccount()
        {
            //string userName = System.Web.HttpContext.Current.User.Identity.Name;
            var providerId = this.User.FindFirstValue(ClaimTypes.NameIdentifier);
            var appUser = _userService.GetUserByIdProvider(providerId);
            return View(appUser);
        }


        [ResponseCache(Duration = 0, Location = ResponseCacheLocation.None, NoStore = true)]
        public IActionResult Error()
        {
            return View(new ErrorViewModel { RequestId = Activity.Current?.Id ?? HttpContext.TraceIdentifier });
        }
    }
}
