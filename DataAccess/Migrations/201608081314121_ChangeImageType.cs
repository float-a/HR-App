namespace DataAccess.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class ChangeImageType : DbMigration
    {
        public override void Up()
        {
            AlterColumn("dbo.Offices", "Image", c => c.String());
        }
        
        public override void Down()
        {
            AlterColumn("dbo.Offices", "Image", c => c.Binary());
        }
    }
}
