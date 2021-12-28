using BikeSite.Data;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;

namespace BikeSite.Services
{
    public class UserService
    {
        private readonly BikeDbContext _context;
        public UserService(BikeDbContext context)   //dependency injection system
        {
            _context = context;
        }
        internal AppUser GetUserByExternalProvider(string provider, string nameIdentifier)
        {
            var appUser = _context.AppUsers
                .Where(a => a.Provider == provider)
                .Where(a => a.NameIdentifier == nameIdentifier)
                .FirstOrDefault();
            return appUser;
        }
        internal AppUser GetUserById(int id)
        {
            var appUser = _context.AppUsers.Find(id);
            return appUser;
        }

        internal AppUser GetUserByIdProvider(string id)
        {
            var appUser = _context.AppUsers.FirstOrDefault(x => x.NameIdentifier == id);
            return appUser;
        }

        internal bool TryValidateUser(string username, string password, out List<Claim> claims)
        {
            claims = new List<Claim>();
            var appUser = _context.AppUsers
                .Where(a => a.Username == username)
                .Where(a => a.Password == password)
                .FirstOrDefault();  //jeśli nie znajdzie użytkownika, zwróci null
            if (appUser is null)
            {
                return false;
            }
            else
            {
                claims.Add(new Claim(ClaimTypes.NameIdentifier, username));
                claims.Add(new Claim("username", username));
                claims.Add(new Claim(ClaimTypes.Email, appUser.Email));
                claims.Add(new Claim(ClaimTypes.Role, appUser.Role));
                //tu nie ma wszystkich danych z bazy w claimach
                return true;
            }
        }
        internal AppUser AddNewUser(string provider, List<Claim> claims)
        {
            var appUser = new AppUser();
            appUser.Provider = provider;
            appUser.NameIdentifier = claims.GetClaim(ClaimTypes.NameIdentifier);
            appUser.Username = claims.GetClaim("username");
            appUser.Email = claims.GetClaim(ClaimTypes.Email);
            appUser.Firstname = claims.GetClaim(ClaimTypes.GivenName);
            appUser.Lastname = claims.GetClaim(ClaimTypes.Surname);

            var entity = _context.AppUsers.Add(appUser);
            _context.SaveChanges();
            return entity.Entity;
        }
    }
    public static class Extensions
    {
        public static string GetClaim(this List<Claim> claims, string name)
        {
            return claims.FirstOrDefault(c => c.Type == name)?.Value;
        }
    }
}
