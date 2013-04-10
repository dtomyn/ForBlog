using GroceryBuddyData.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web;
using System.Web.Http;

namespace GroceryBuddyData.Controllers
{
    public class ProductsController : ApiController
    {
        List<Product> ProductContext;

        public ProductsController()
        {
            if (HttpContext.Current.Application["productContext"] == null)
            {
                HttpContext.Current.Application["productContext"] = new List<Product>();
                ((List<Product>)HttpContext.Current.Application["productContext"]).Add(ProductConstants.Product1);
                ((List<Product>)HttpContext.Current.Application["productContext"]).Add(ProductConstants.Product2);
            }
            ProductContext = (List<Product>)(HttpContext.Current.Application["productContext"]);
        }

        // GET api/values
        public IEnumerable<Product> Get()
        {
            return ProductContext;
        }

        // GET api/values/5
        public Product Get(string sku)
        {
            Product current = ProductContext.FirstOrDefault(b => b.Sku.Equals(sku, StringComparison.OrdinalIgnoreCase) && !b.IsDeleted);
            if (current == null)
            {
                throw new HttpResponseException(HttpStatusCode.NotFound);
            }
            else
            {
                return current;
            }
        }

        // POST api/values
        public void Post([FromBody]Product value)
        {
            //add only if does not exist already... otherwise update
            Product current = ProductContext.FirstOrDefault(b => b.Id.Equals(value.Id));
            if (current == null)
            {
                ProductContext.Add(value);
            }
            else
            {
                current.Id = value.Id;
                current.Name = value.Name;
                current.Description = value.Description;
                current.IsDeleted = value.IsDeleted;
            }
        }

        // PUT api/values/5
        //public void Put(string sku, [FromBody]Product value)
        public void Put(int id, [FromBody]Product value)
        {
            Product current = ProductContext.FirstOrDefault(b => b.Id.Equals(id));
            if (current == null || current.IsDeleted)
            {
                throw new HttpResponseException(HttpStatusCode.NotFound);
            }
            else
            {
                if (value.IsDeleted)
                {
                    Delete(id);
                }
                else
                {
                    current.Id = value.Id;
                    current.Name = value.Name;
                    current.Description = value.Description;
                    current.IsDeleted = value.IsDeleted;
                }
            }
        }

        // DELETE api/values/5
        public void Delete(int id)
        {
            Product current = ProductContext.FirstOrDefault(b => b.Id.Equals(id));
            if (current == null || current.IsDeleted)
            {
                throw new HttpResponseException(HttpStatusCode.NotFound);
            }
            else
            {
                current.IsDeleted = true;
            }
        }

    }
}