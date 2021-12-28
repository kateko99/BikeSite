using Microsoft.EntityFrameworkCore.Migrations;

namespace BikeSite.Data
{
    public partial class UpdateRoutesTable : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "Description",
                table: "Routes",
                type: "text",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "Type",
                table: "Routes",
                type: "text",
                nullable: true);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Description",
                table: "Routes");

            migrationBuilder.DropColumn(
                name: "Type",
                table: "Routes");
        }
    }
}
