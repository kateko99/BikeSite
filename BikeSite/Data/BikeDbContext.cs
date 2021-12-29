using BikeSite.Models;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using Npgsql;
using Npgsql.NetTopologySuite;
using NetTopologySuite;

namespace BikeSite.Data
{
    public class BikeDbContext : DbContext
    {
        public DbSet<AppUser> AppUsers { get; set; }
        public DbSet<Comment> Comments { get; set; }
        public DbSet<Rating> Ratings { get; set; }
        public DbSet<Route> Routes { get; set; }
        public DbSet<FavRoute> FavRoute { get; set; }

        public BikeDbContext(DbContextOptions<BikeDbContext> options) : base(options)
        {
        }
        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<AppUser>(entity =>
            {
                entity.HasKey(e => e.UserId);
                entity.Property(e => e.UserId);
                entity.Property(e => e.Provider).HasMaxLength(250);
                entity.Property(e => e.NameIdentifier).HasMaxLength(500);
                entity.Property(e => e.Username).HasMaxLength(15);
                entity.Property(e => e.Password).HasMaxLength(20);
                entity.Property(e => e.Firstname).HasMaxLength(100);
                entity.Property(e => e.Lastname).HasMaxLength(100);
                entity.Property(e => e.Email).HasMaxLength(250);
                entity.Property(e => e.BirthDate).HasMaxLength(250);
                entity.Property(e => e.StartDate).HasMaxLength(250);
                entity.Property(e => e.Role).HasMaxLength(20);

                entity.HasData(new AppUser
                {
                    UserId = 1,
                    Provider = "cookies",
                    Username = "start_user",
                    Password = "haslo",
                    Firstname = "Jan",
                    Lastname = "Kowalski",
                    Email = "janek@gmail.com",

                });


            });

            modelBuilder.Entity<Route>(entity =>
            {
                entity.HasKey(e => e.RouteId);
                entity.Property(e => e.RouteId);
                entity.Property(e => e.UserId);
                entity.Property(e => e.Name);
                entity.Property(e => e.Geometry);
                entity.Property(e => e.Description);
                entity.Property(e => e.Type);
                entity.Property(e => e.Length);
                entity.Property(e => e.Date);

                entity.HasData(new Route
                {
                    RouteId = 2,
                    UserId = 2,
                    Name = "pierwsza trasa",
                    Geometry = "geometria startowa",
                    Description = "opis trasy",
                    Type = "leśna",
                    Length = 100,
                    Date = DateTime.Now,
                });
            });

            modelBuilder.Entity<Comment>(entity =>
            {
                entity.HasKey(e => e.CommentId);
                entity.Property(e => e.RouteId);
                entity.Property(e => e.UserId);
                entity.Property(e => e.Content).HasMaxLength(500);
                entity.Property(e => e.Date);
            });

            modelBuilder.Entity<Rating>(entity =>
            {
                entity.HasKey(e => e.RatingId);
                entity.Property(e => e.RatingId);
                entity.Property(e => e.RouteId);
                entity.Property(e => e.UserId);
                entity.Property(e => e.Value);
                entity.Property(e => e.Date);
            });

            modelBuilder.Entity<FavRoute>(entity =>
            {
                entity.HasKey(e => new {e.UserId, e.RouteId });
                entity.Property(e => e.UserId);
                entity.Property(e => e.RouteId);
            });
        }
    }
}
