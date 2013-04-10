using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace GroceryBuddyData.Models
{
public class Product
{
    public int Id { get; set; }
    public string Sku { get; set; }
    public string Name { get; set; }
    public string Description { get; set; }
    public bool IsDeleted { get; set; }
}

public static class ProductConstants
{
    public static Product Product1
    {
        get
        {
            var p =
                new Product
                {
                    Id = 0,
                    Sku = "12345",
                    Name = "Product 1",
                    Description = "Description 1"
                };
            //p.StoresAndPrices.Add
            //    (
            //        new ProductStorePrice()
            //        {
            //            TheStore = StoreConstants.Safeway
            //            , Price = 2.25M
            //            , PriceDate = new DateTime(2013, 4, 3)
            //        }
            //    );
            return p;
        }
    }

    public static Product Product2
    {
        get
        {
            var p =
                new Product
                {
                    Id = 1,
                    Sku = "2345",
                    Name = "Product 2",
                    Description = "Description 1"
                };
            return p;
        }
    }
}
}