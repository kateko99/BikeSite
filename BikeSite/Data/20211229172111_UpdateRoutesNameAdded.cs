using System;
using Microsoft.EntityFrameworkCore.Migrations;

namespace BikeSite.Data
{
    public partial class UpdateRoutesNameAdded : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AlterColumn<string>(
                name: "Geometry",
                table: "Routes",
                type: "text",
                nullable: false,
                defaultValue: "",
                oldClrType: typeof(string),
                oldType: "text",
                oldNullable: true);

            migrationBuilder.AddColumn<string>(
                name: "Name",
                table: "Routes",
                type: "text",
                nullable: false,
                defaultValue: "");

            migrationBuilder.InsertData(
                table: "Routes",
                columns: new[] { "RouteId", "Date", "Description", "Geometry", "Length", "Name", "Type", "UserId" },
                values: new object[] { 2, new DateTime(2021, 12, 29, 18, 21, 10, 856, DateTimeKind.Local).AddTicks(3436), "opis trasy", "geometria startowa", 100.0, "pierwsza trasa", "leśna", 2 });
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DeleteData(
                table: "Routes",
                keyColumn: "RouteId",
                keyValue: 2);

            migrationBuilder.DropColumn(
                name: "Name",
                table: "Routes");

            migrationBuilder.AlterColumn<string>(
                name: "Geometry",
                table: "Routes",
                type: "text",
                nullable: true,
                oldClrType: typeof(string),
                oldType: "text");
        }
    }
}
