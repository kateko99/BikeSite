using System;
using Microsoft.EntityFrameworkCore.Migrations;
using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata;

namespace BikeSite.Data
{
    public partial class Initial : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "AppUsers",
                columns: table => new
                {
                    UserId = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    Provider = table.Column<string>(type: "character varying(250)", maxLength: 250, nullable: true),
                    NameIdentifier = table.Column<string>(type: "character varying(500)", maxLength: 500, nullable: true),
                    Username = table.Column<string>(type: "character varying(15)", maxLength: 15, nullable: true),
                    Password = table.Column<string>(type: "character varying(20)", maxLength: 20, nullable: true),
                    Firstname = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: true),
                    Lastname = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: true),
                    Email = table.Column<string>(type: "character varying(250)", maxLength: 250, nullable: true),
                    BirthDate = table.Column<DateTime>(type: "timestamp without time zone", maxLength: 250, nullable: false),
                    StartDate = table.Column<DateTime>(type: "timestamp without time zone", maxLength: 250, nullable: false),
                    Role = table.Column<string>(type: "character varying(20)", maxLength: 20, nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_AppUsers", x => x.UserId);
                });

            migrationBuilder.CreateTable(
                name: "FavRoutes",
                columns: table => new
                {
                    UserId = table.Column<string>(type: "text", nullable: false),
                    RouteId = table.Column<int>(type: "integer", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_FavRoutes", x => new { x.UserId, x.RouteId });
                });

            migrationBuilder.CreateTable(
                name: "Routes",
                columns: table => new
                {
                    RouteId = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    UserId = table.Column<int>(type: "integer", nullable: false),
                    Geometry = table.Column<string>(type: "text", nullable: false),
                    Name = table.Column<string>(type: "text", nullable: false),
                    Description = table.Column<string>(type: "text", nullable: true),
                    Asphalt = table.Column<int>(type: "integer", nullable: false),
                    Cycle = table.Column<int>(type: "integer", nullable: false),
                    Forest = table.Column<int>(type: "integer", nullable: false),
                    Other = table.Column<int>(type: "integer", nullable: false),
                    Rest = table.Column<int>(type: "integer", nullable: false),
                    Type = table.Column<string>(type: "text", nullable: true),
                    Length = table.Column<double>(type: "double precision", nullable: false),
                    Date = table.Column<DateTime>(type: "timestamp without time zone", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Routes", x => x.RouteId);
                });

            migrationBuilder.InsertData(
                table: "AppUsers",
                columns: new[] { "UserId", "BirthDate", "Email", "Firstname", "Lastname", "NameIdentifier", "Password", "Provider", "Role", "StartDate", "Username" },
                values: new object[] { 1, new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified), "janek@gmail.com", "Jan", "Kowalski", null, "haslo", "cookies", null, new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified), "start_user" });

            migrationBuilder.InsertData(
                table: "Routes",
                columns: new[] { "RouteId", "Asphalt", "Cycle", "Date", "Description", "Forest", "Geometry", "Length", "Name", "Other", "Rest", "Type", "UserId" },
                values: new object[] { 2, 0, 0, new DateTime(2022, 1, 26, 9, 23, 5, 900, DateTimeKind.Local).AddTicks(9368), "opis trasy", 0, "geometria startowa", 100.0, "pierwsza trasa", 0, 0, "leśna", 2 });
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "AppUsers");

            migrationBuilder.DropTable(
                name: "FavRoutes");

            migrationBuilder.DropTable(
                name: "Routes");
        }
    }
}
