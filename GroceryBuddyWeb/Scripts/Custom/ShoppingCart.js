/// <reference path="_references.js" />

//#region CONSTANTS
(function () {
    GB_BASE_DATA_LOCATION = 'http://grocerybuddydata.azurewebsites.net';
    //GB_BASE_DATA_LOCATION = 'http://localhost:54328';

    //application stores all carts to localStorage (if available)... this is the storage key
    GB_STORAGEKEY_CARTS = 'MyCarts';

    //each page has a "constant"
    GB_PAGE_CARTS_LIST = '#cartsPage';
    GB_PAGE_ADD_CART = '#addCartPage';
    GB_PAGE_CART_ITEMS = '#cartItemsPage';
    GB_PAGE_ADD_CART_ITEM = '#addCartItemPage';
})();
//#endregion CONSTANTS

$(function () {

    /// Class to represent a category
    var Category = function (value, name, icon) {
        var self = this;

        // #region Properties
        self.value = value;
        self.name = name;
        // #endregion Properties

        return self;
    };

    /// Class to represent a measurement
    var Measurement = function (value, name, icon) {
        var self = this;

        // #region Properties
        self.value = value;
        self.name = name;
        // #endregion Properties

        return self;
    };

    /// Class to represent a product
    var Product = function (id, sku, name, description, isNew) {
        var self = this;

        // #region Properties
        Id: id;
        Sku: sku;
        Name: name;
        Description: description;
        // #endregion Properties

        return self;
    };

    /// Class to represent an item in a cart
    var CartItem = function (sku, name, category, numberOfPieces, size, measurement) {
        var self = this;

        // #region Properties
        self.sku = ko.observable(sku);
        self.name = ko.observable(name);
        self.category = ko.observable(category);
        self.numberOfPieces = ko.observable(numberOfPieces);
        self.size = ko.observable(size);
        self.measurement = ko.observable(measurement);
        // #endregion Properties

        // #region Computed properties
        self.displayValue = ko.computed(function () {
            return self.name() + ' (' + self.category() + ') ' + self.numberOfPieces() + ' x ' + self.size() + ' @ ' + self.measurement();
        });
        // #endregion Computed properties

        return self;
    };

    /// Class to represent a grocery cart
    var GroceryCart = function (name) {
        var self = this;

        // #region Properties
        /// Cart has a name...
        self.name = ko.observable(name);
        /// Cart has items...
        self.cartItems = ko.observableArray([]);
        // #endregion Properties

        // #region Computed properties
        /// Make english wording better for number of items in a cart
        self.numberOfItemsDisplay = ko.computed(function () {
            if (self.cartItems().length == 0) {
                return 'There are no items in the cart';
            } else {
                if (self.cartItems().length == 1) {
                    return 'There is 1 item in the cart';
                } else {
                    return 'There are ' + self.cartItems().length + ' items in this cart';
                }
            }
        });

        // Simply returns the number of items
        self.numberOfItems = ko.computed(function () {
            return self.cartItems().length;
        });
        // #endregion Computed properties

        // #region Operations
        self.addItem = function (item) {
            self.cartItems.push(item);
        };

        self.removeItem = function (item) {
            //self.cartItems.destroy(item); //This is probably the better way, but causes complication with count
            self.cartItems.remove(item);
        };
        // #endregion Operations

        return self;
    };

    /// Overall view model for the application
    var ShoppingCartViewModel = function () {
        var self = this;

        var
// #region Properties
            /// Main carts collection
            carts = ko.observableArray([])
            /// Used to store the currently selected shopping cart
            , selectedCart = ko.observable()
            /// A list of all available categories that may be selected when entering an item
            , availableCategories = ko.observableArray([])
            /// A list of all available measurements that may be selected when entering an item
            , availableMeasurements = ko.observableArray([])
            /// A list of all available products... pretty heavy handed but...
            , products = ko.observableArray([])
// #endregion Properties

// #region Operations
            /// Loads up carts collection with a couple of sample grocery carts
            , getCarts = function () {
                carts = ko.observableArray([]);
                carts.push(new GroceryCart("Shopping Cart 1"));
                carts.push(new GroceryCart("Shopping Cart 2"));
            }
            /// Loads up availableCategories collection with a few category types
            , getCategories = function () {
                availableCategories = ko.observableArray([]);
                availableCategories.push(new Category("Produce", "Produce", "TODO"));
                availableCategories.push(new Category("Dairy", "Dairy", "TODO"));
                availableCategories.push(new Category("Junk Food", "Junk Food", "TODO"));
            }
            /// Loads up availableMeasurements collection with a few measurement types
            , getMeasurements = function () {
                availableMeasurements = ko.observableArray([]);
                availableMeasurements.push(new Measurement("Grams", "Grams", "TODO"));
                availableMeasurements.push(new Measurement("KG", "KG", "TODO"));
                availableMeasurements.push(new Measurement("ML", "ML", "TODO"));
                availableMeasurements.push(new Measurement("L", "L", "TODO"));
            }
// #region NAVIGATION operations
            ///Navigates to the "cartsPage". Wrapped to ensure jQuery mobile "redraws" screen correctly
            , navigateToCartsPage = function () {
                $.mobile.changePage("#cartsPage");
                $('#cartsPage').trigger('pagecreate');
                $('#theCartList').listview('refresh');
            }

            ///Navigates to the "addCartPage". Wrapped to ensure jQuery mobile "redraws" screen correctly
            , navigateToAddCartPage = function () {
                $.mobile.changePage("#addCartPage");
                $('#addCartPage').trigger('pagecreate');
            }

            ///Navigates to the "cartItemsPage". Wrapped to ensure jQuery mobile "redraws" screen correctly
            , navigateToCartItemsPage = function () {
                $.mobile.changePage("#cartItemsPage");
                //clear out previous values...

                $('#cartItemsPage').trigger('pagecreate');
                $('#cartItemsListView').listview('refresh');
            }

            ///Navigates to the "addCartItemPage". Wrapped to ensure jQuery mobile "redraws" screen correctly
            , navigateToAddCartItemPage = function () {
                $.mobile.changePage("#addCartItemPage");
                $('#addCartItemPage').trigger('pagecreate');
            }
// #endregion NAVIGATION operations
            /// Called when want to start adding a new cart
            , addCartBegin = function () {
                $('#currentCartName').val('');
                navigateToAddCartPage();
            }
            /// Cancels the save cart operation and navigates back to the main carts page
            , addCartCancel = function () {
                navigateToCartsPage();
            }
            /// Saves a cart to the carts collection and then navigates back to the main carts page
            , addCartSave = function () {
                var gc = new GroceryCart($('#currentCartName').val());
                carts.push(gc);
                $('#currentCartName').val('');
                navigateToCartsPage();
            }

            /// Called when want to start adding a new item into a cart
            , addCartItemBegin = function () {
                $('#itemName').val('');
                $('#itemCategory').val('');
                $('#itemNumberOfPieces').val('');
                $('#itemSize').val('');
                $('#itemMeasurement').val('');
                navigateToAddCartItemPage();
            }
            /// Saves a cart items to the currently selected cart
            , addCartItemSave = function () {
                var ci = new CartItem($('#sku').val(), $('#itemName').val(), $('#itemCategory').val(), $('#itemNumberOfPieces').val(), $('#itemSize').val(), $('#itemMeasurement').val());
                if (selectedCart() != null) {
                    selectedCart().addItem(ci);
                }
                navigateToCartItemsPage();
            }
            /// Removes the currently selected cart from the collection after confirming that want to delete it
            , removeCartItem = function (cartItem) {
                //TODO... better confirm needed!... look at split listview
                if (confirm('Are you sure you want to remove this item?')) {
                    selectedCart().removeItem(cartItem);
                    $('#cartItemsListView').listview('refresh');
                }
            }

            /// Removes the currently selected cart from the collection after confirming that want to delete it
            , removeCart = function (cart) {
                //TODO... better confirm needed!... look at split listview
                if (confirm('Are you sure you want to remove the following cart: ' + cart.name() + ' that currently has ' + cart.numberOfItems() + ' number of items?')) {
                    //carts.destroy(cart); //This is probably the better way, but causes complication with count
                    carts.remove(cart);
                    $('#theCartList').listview("refresh");
                }
            }
            /// Shows the contents of the cart
            , viewCartBegin = function (cart) {
                selectedCart(cart);
                navigateToCartItemsPage();
            }

            , startBarCodeScanning = function () {
                alert('start scanner here...');
                //scanner.scan();
            }

// #region Product stuff
            , selectedProduct = ko.observable(null)
            , numberOfProductsCached = function () {
                return this.products().length;
            }
            , newProduct = function () {
                this.products.push({
                    Id: ko.observable(this.products().length + 1),
                    Sku: ko.observable(this.products().length + 1),
                    Name: ko.observable("New " + this.products().length),
                    Description: ko.observable("Description " + this.products().length),
                    IsNew: ko.observable(true)
                });
            }
            , getProducts = function () {
                jsonp((dataLocation + "/api/Products?callback=?"),
                       function (data) {
                           //viewModel.items([]);
                           shoppingCartViewModel.products([]);
                           //shoppingCartViewModel.products.removeAll();
                           $.each(data, function (index) {
                               shoppingCartViewModel.products.push(toProductKoObservable(data[index]));
                           });
                       });
            }
        //#endregion Product stuff

        // #endregion Operations
        ;

        /// Make the call to initialize the carts
        getCarts();
        /// Make the call to initialize the categories
        getCategories();
        /// Make the call to initialize the measurements
        getMeasurements();

        /* NOTE: if want to do the "best practice" of selectively determining what to expose, would do the below */
        return {
            carts: carts
            , availableCategories: availableCategories
            , availableMeasurements: availableMeasurements
            , products: products
            , numberOfProductsCached: numberOfProductsCached

            , getCarts: getCarts
            , getCategories: getCategories
            , getMeasurements: getMeasurements
            , getProducts: getProducts

            , addCartBegin: addCartBegin
            , addCartCancel: addCartCancel
            , addCartSave: addCartSave

            , viewCartBegin: viewCartBegin

            , addCartItemBegin: addCartItemBegin
            , addCartItemSave: addCartItemSave

            , selectedCart: selectedCart

            , removeCart: removeCart

            , removeCartItem: removeCartItem

            , startBarCodeScanning: startBarCodeScanning

            , navigateToCartsPage: navigateToCartsPage
            , navigateToAddCartPage: navigateToAddCartPage
            , navigateToCartItemsPage: navigateToCartItemsPage
            , navigateToAddCartItemPage: navigateToAddCartItemPage
        };
    };
});
