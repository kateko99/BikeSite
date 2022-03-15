using System;
using Microsoft.EntityFrameworkCore.Migrations;

namespace BikeSite.Data
{
    public partial class RoutesAddDifficulty : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "Difficulty",
                table: "Routes",
                type: "text",
                nullable: true);

            migrationBuilder.UpdateData(
                table: "Routes",
                keyColumn: "RouteId",
                keyValue: 2,
                column: "Date",
                value: new DateTime(2022, 2, 10, 22, 40, 36, 989, DateTimeKind.Local).AddTicks(9026));
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Difficulty",
                table: "Routes");

            migrationBuilder.UpdateData(
                table: "Routes",
                keyColumn: "RouteId",
                keyValue: 2,
                column: "Date",
                value: new DateTime(2022, 1, 26, 9, 23, 5, 900, DateTimeKind.Local).AddTicks(9368));
        }
    }
}
