using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using System.Net;
using Microsoft.Azure.Documents;
using Microsoft.Azure.Documents.Client;
using Newtonsoft.Json;

namespace HelloGalaxy.Controllers
{
    [Route("api/[controller]")]
    public class ValuesController : Controller
    {
        private const string EndpointUri = "https://prognet2017.documents.azure.com:443/";
        private const string PrimaryKey = "63G0d11iLxiXOnsmfF37aNta1bNc77XirIZzLmLAHFJj879eA4X7zTiurVguoTMVAMszBB2glidAsescSDEraA==";
        private DocumentClient client;
        private readonly string databaseName = "ProgNet_DEMO";
        private readonly string databaseCollectionName = "ProgNetCollection_DEMO";
        public ValuesController()
        {
            this.client = new DocumentClient(new Uri(EndpointUri), PrimaryKey);
            try
            {
                    SeedData().Wait();
            }
            catch (DocumentClientException de)
            {
                    Exception baseException = de.GetBaseException();
                    Console.WriteLine($"{de.StatusCode} error occurred: {de.Message}, Message: {baseException.Message}");
            }
            catch (Exception e)
            {
                    Exception baseException = e.GetBaseException();
                    Console.WriteLine($"Error: {e.Message}, Message: {baseException.Message}");
            }
            finally
            {
                    Console.WriteLine("Client connected");
            }
        }
        // GET api/values
        [HttpGet]
        public IEnumerable<Greeting> Get()
        {
            FeedOptions queryOptions = new FeedOptions { MaxItemCount = -1 };

            // Here we find the Andersen family via its LastName
            IQueryable<Greeting> familyQuery = this.client.CreateDocumentQuery<Greeting>(
                    UriFactory.CreateDocumentCollectionUri(databaseName, databaseCollectionName), queryOptions)
                .Where(f => f.Message == "Hi");

            // The query is executed synchronously here, but can also be executed asynchronously via the IDocumentQuery<T> interface
            Console.WriteLine("Running LINQ query...");
            foreach (Greeting family in familyQuery)
            {
                Console.WriteLine("\tRead {0}", family);
            }

            // Now execute the same query via direct SQL
            IQueryable<Greeting> familyQueryInSql = this.client.CreateDocumentQuery<Greeting>(
                UriFactory.CreateDocumentCollectionUri(databaseName, databaseCollectionName),
                "SELECT * FROM Greeting WHERE Greeting.Message = 'Hi'",
                queryOptions); 
           return familyQueryInSql;
        }

        // GET api/values/5
        [HttpGet("{id}")]
        public async Task<string> Get(string id)
        {
            // await this.client.ReadDocumentAsync(UriFactory.CreateDocumentUri(databaseName, databaseCollectionName, id));
            return id;
        }

        // POST api/values
        [HttpPost]
        public async void Post([FromBody]Greeting value)
        {
            await this.CreateGreetingDocumentIfNotExists(databaseName, databaseCollectionName, value);
        }

        // PUT api/values/5
        [HttpPut("{id}")]
        public void Put(int id, [FromBody]string value)
        {
        }

        // DELETE api/values/5
        [HttpDelete("{id}")]
        public void Delete(int id)
        {
        }
        private async Task SeedData()
        {
            await this.client.CreateDatabaseIfNotExistsAsync(new Database { Id = databaseName });
            await this.client.CreateDocumentCollectionIfNotExistsAsync(UriFactory.CreateDatabaseUri(databaseName), new DocumentCollection { Id = databaseCollectionName });
            await this.CreateGreetingDocumentIfNotExists(databaseName, databaseCollectionName, new Greeting{Message = "Hi"});
            await this.CreateGreetingDocumentIfNotExists(databaseName, databaseCollectionName, new Greeting{Message = "Hello"});
        }
        private async Task CreateGreetingDocumentIfNotExists(string databaseName, string collectionName, Greeting greeting)
        {
            try
            {
                await this.client.ReadDocumentAsync(UriFactory.CreateDocumentUri(databaseName, collectionName, greeting.Message));
                Console.WriteLine($"Found {greeting.Message} : {greeting.Message}");
            }
            catch (DocumentClientException de)
            {
                if (de.StatusCode == HttpStatusCode.NotFound)
                {
                    await this.client.CreateDocumentAsync(UriFactory.CreateDocumentCollectionUri(databaseName, collectionName), greeting);
                    Console.WriteLine($"Created Greeting {greeting.Message}");
                }
                else
                {
                    throw;
                }
            }
        }
    }
}
