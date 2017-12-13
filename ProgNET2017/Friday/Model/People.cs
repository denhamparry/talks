using Microsoft.EntityFrameworkCore;

namespace Friday.Model
{
    public class Person
    {
        public int Id { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
    }

    public class MyContext : DbContext
    {
        public DbSet<Person> People { get; set; }
        protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)  
        {
            optionsBuilder.UseSqlite("DataSource=databaseFile.db");
            base.OnConfiguring(optionsBuilder);
        }
    }
}