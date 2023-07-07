 // Shopping cart data
 let cartItems = [];
 let cartTotal = 0;

 // Function to fetch product data from the API
 async function fetchProductData() {
   try {
     const response = await fetch("https://fakestoreapi.com/products/");
     const data = await response.json();
     return data;
   } catch (error) {
     console.error("Error fetching product data:", error);
     return [];
   }
 }

 // Function to render the product list
 async function renderProductList() {
   const productList = document.getElementById("product-list");
   let div = '';
   productList.innerHTML = "";

   try {
     const products = await fetchProductData();

     products.forEach((product, index) => {
        div += `
        <article class="rounded-xl bg-white p-3 shadow-lg hover:shadow-xl hover:transform hover:scale-105 duration-300">
        <a href="#">
          <div class="relative h-[200px] w-full flex items-end overflow-hidden rounded-xl">
            <img src=${product.image} class='h-full mx-auto'  alt="Product Photo" />
          </div>
          <div class="mt-1 p-2">
            <h2 class="text-slate-700">${product.title}</h2>
            <p class="mt-1 text-sm text-slate-400">${product.description.slice(0, 30)}</p>
            <div class="mt-3 flex items-end justify-between">
              <p class="text-lg font-bold text-blue-500">$${product.price.toFixed(2)}</p>
              <button onclick="addToCart(${product.id})"
               class="flex items-center space-x-1.5 rounded-lg bg-blue-500 px-4 py-1.5 text-white duration-100 hover:bg-blue-600 cursor-pointer">           <a  class="text-sm">Add to cart</a>
              </button>
            </div>
          </div>
        </a>
      </article>
        `;
     });
     productList.innerHTML = div;
   } catch (error) {
     console.error("Error rendering product list:", error);
   }
 }

 // Function to add an item to the cart
async function addToCart(id) {
   console.log(id)
  // Check if the product already exists in the cart
   const existingItem = cartItems.find(item => item.id === id);
   const products = await fetchProductData();
   const product = products.find(pd=>pd.id === id)
   console.log(existingItem)

   if (existingItem) {
     existingItem.totalPrice = existingItem.quantity * existingItem.price;
   } else {
     // Add the product to the cart with a quantity of 1
     const cartItem = {
       id: product.id,
       name: product.title,
       price: product.price,
       quantity: 1,
       totalPrice: product.price
     };
     cartItems.push(cartItem);
   }

   // Update the cart display
   updateCart();
   // Update the local store
   updateCartLocalStorage()
 }

 // Function to update the cart display
 function updateCart() {
   const cartItemsElement = document.getElementById("cart-items");
   const cartTotalElement = document.getElementById("cart-total");
   let div = '';

   // Clear the existing cart items
   cartItemsElement.innerHTML = '';

   // Display each cart item
   cartItems.forEach((item) => {
     div += `
       <div class="flex justify-between border mb-1 p-1">
         <div class='text-md font-bold py-2'>${item.name}</div>
         <div class="flex flex-col justify-between">
         <div class="flex gap-1 text-lg">
            <button onclick="decreaseQuantity(${item.id})">-</button>
            <span>${item.quantity}</span>
           <button onclick="increaseQuantity(${item.id})">+</button>
           </div>
            <p class="text-sm">${item.totalPrice}$</p>
         </div>
         <button onclick="removeFromCart(${item.id})" class="border py-1 px-2 m-2 justify-center items-center my-auto bg-[#bb1111a1] rounded">x</button>
       </div>
     `;
   });

   cartItemsElement.innerHTML = div;

   // Recalculate the total price
   cartTotal = cartItems.reduce((total, item) => total + item.totalPrice, 0);

   // Display the total price and quantity
   cartTotalElement.innerText = `Total Price: $${cartTotal.toFixed(2)}`;

   // Update local storage
   updateCartLocalStorage();
 }

 // Function to increase the quantity of an item in the cart
 function increaseQuantity(itemId) {
   const cartItem = cartItems.find(item => item.id === itemId);
   if (cartItem) {
     cartItem.quantity += 1;
     cartItem.totalPrice = cartItem.price * cartItem.quantity;
     updateCartLocalStorage();
     updateCart();
   }
 }

 // Function to decrease the quantity of an item in the cart
 function decreaseQuantity(itemId) {
   const cartItem = cartItems.find(item => item.id === itemId);
   if (cartItem) {
     if (cartItem.quantity > 1) {
       cartItem.quantity -= 1;
       cartItem.totalPrice = cartItem.price * cartItem.quantity;
       updateCartLocalStorage();
       updateCart();
     }
   }
 }

 // Rest of the code...
 // Function to store the cart items in local storage
 function updateCartLocalStorage() {
   localStorage.setItem('cartItems', JSON.stringify(cartItems));
 }

 // Function to retrieve cart items from local storage
 function retrieveCartFromLocalStorage() {
   const storedCartItems = localStorage.getItem('cartItems');
   if (storedCartItems) {
     cartItems = JSON.parse(storedCartItems);
     updateCart();
   }
 }

 // Event listener for checkout button
 const checkoutBtn = document.getElementById("checkout-btn");
 checkoutBtn.addEventListener("click", checkout);

 // Function to handle checkout
 function checkout() {
   // Clear the cart and update the display
   cartItems = [];
   cartTotal = 0;
   updateCart();

   // Clear the cart items from local storage
   localStorage.removeItem('cartItems');
 }

 // Function to remove a single item from the cart
 function removeFromCart(itemId) {
   cartItems = cartItems.filter(item => item.id !== itemId);
   updateCart();
   updateCartLocalStorage();
 }

 // Retrieve cart items from local storage on page load
 retrieveCartFromLocalStorage();

 // Render the product list initially
 renderProductList();
