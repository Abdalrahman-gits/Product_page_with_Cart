 /* =============== Navigation Bar =============== */
let navIcon = document.querySelector(".nav-icon");
let navMenu = document.querySelector(".nav-main");

// Validation on Values
if(navIcon && navMenu) {
  navIcon.addEventListener("click", _ => {
  navMenu.classList.toggle("show");
  });
}
else {
  console.log(Error("Menu or Icon are Not found in NavBar"))
}

/* =============== Fetching Data =============== */
async function getData(url) {
  try {
    let response = await fetch(url,{"method":"Get"});
    if(!response.ok) {
      throw new Error("Problems in Network");
    }
    let data = await response.json();
    return data;
  }
  catch (err) {
    console.error("Fetching Error : ",err);
    throw err;
  }
}


// Displaying Data on Document
function displayData(data) {
  let cardscontainer = document.querySelector(".main-page .desserts .cards")
  let cardsContent = ``; // Prevent Rewrite in document and print for one Time.

  for (let i = 0; i < data.length; i++) {
    cardsContent += `
        <div class="card" name="${data[i].name}" data-price="${(data[i].price).toFixed(2)}" data-thumbnailImg="${data[i].image.thumbnail}">
          <div class="img">
            <img src="${data[i].image.tablet}" alt="">
          </div>
          <button class="add-btn" data-count=0><img src="assets/images/icon-add-to-cart.svg"></img>Add To Cart</button>
          <div class="card-body">
            <p class="category">${data[i].category}</p>
            <p class="name">${data[i].name}</p>
            <p class="price">$${(data[i].price).toFixed(2)}</p>
          </div>
        </div>`
  }
  cardscontainer.innerHTML = cardsContent;
}

let dataFetched = getData("./data.json")
dataFetched
.then((data) => {
  displayData(data);
  cartInit();
})
.catch((fail) => console.log(Error("There is a problem Happened")))

/* =============== Controlling cart =============== */
let desserts = document.querySelector(".desserts")
let cartBody = document.querySelector(".Cart-body");
let counter = document.querySelector(".counter");

// Getting Data From SessionStorage
let cartArray = sessionStorage.getItem("cartContent") ? JSON.parse(sessionStorage.getItem("cartContent")) : [];


// Intializing Cart 
function cartInit() {
  let cardsinstorage = document.querySelectorAll(".card");
  if(cardsinstorage) {
    cardsinstorage.forEach((card) => {
      // If item Found in Cart => add the class Added to it & Editin Shape
      if(cartArray.some((item) => item.name === card.getAttribute("name"))) {
        card.classList.add("added");
        addbtnAdded(card);
      }
    })
  }

  // Events in Page
  desserts.addEventListener("click",dessertEvents);
  cartBody.addEventListener("click",cartEvents);
  document.body.addEventListener("click",modalEvents);
}


// Events in Dessert Section
function dessertEvents(event) {
  let clicked = event.target;

  // This is add-btn But dont have the class added (Added to Cart)
  if(clicked.closest(".add-btn") && !clicked.closest(".card").classList.contains("added")) {
    // Add Product to Cart
    addToCart(clicked.closest(".card"));
  }

  // Click on inc. Button
  if(clicked.closest(".plus")) {
    increment(clicked.closest(".card"))
  }
  
  // Click on Dec. Button
  if(clicked.closest(".minus")) {
    decrement(clicked.closest(".card"))
  }
}


// Events on Cart Elements
function cartEvents(event) {
  let clicked = event.target;

  // Delete Icon
  if(clicked.closest(".delete-btn")) {
    removeFromCart(clicked.closest(".product"))
    addbtnInit(desserts.querySelector(`[name="${clicked.closest(".product").getAttribute("name")}"]`))
    updateCart();
  }

  // Confirm Button => Create Modal
  if( clicked.closest(".confirm") ) {
    createModal();
  }
}


// Events On Modal
function modalEvents(event) {
  let clicked = event.target;
  
  // On clicking Any where on screen the modal will be removed
  if( document.body.classList.contains("modal-opened") && clicked.closest(".modal") && !clicked.closest(".modal-content") ) {
    removeModal();
  }

  // (New Order) Button Event => Remove modal and All Products from Cart
  if(clicked.classList.contains("new-order")) {
    removeModal();
    cartArray.forEach((item) => {
      addbtnInit(document.querySelector(`[name="${item.name}"]`));
    });

    cartArray = [];
    window.sessionStorage.removeItem("cartContent");
    updateCart();
  }
}


// Add to Cart Function
function addToCart(product) {
  
  // Adding (added) Class to Product 
  product.classList.add("added");

  // Object For Each Product
  const info = {
    name: product.getAttribute("name"),
    quantity: 1,
    price: product.dataset.price,
    thumbnailImg: product.getAttribute("data-thumbnailImg"),
  }

  cartArray.push(info);
  addbtnAdded(product);
  window.sessionStorage.setItem("cartContent",JSON.stringify(cartArray));
  updateCart();
}


// Creating Shape of (add-btn) After Adding to Cart.
function addbtnAdded(product) {
  let addbtn = product.querySelector(".add-btn");
  let productClass = cartArray.find((item) => item.name === product.getAttribute("name"));
  addbtn.innerHTML = `
  <div class="minus">
    <svg xmlns="http://www.w3.org/2000/svg" width="10" height="2" fill="none" viewBox="0 0 10 2">
      <path fill="#fff" d="M0 .375h10v1.25H0V.375Z"/>
    </svg>
  </div>
  <span class="quant ml-5 mr-5">${productClass.quantity}</span>
  <div class="plus">
    <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" fill="none" viewBox="0 0 10 10">
      <path fill="#fff" d="M10 4.375H5.625V0h-1.25v4.375H0v1.25h4.375V10h1.25V5.625H10v-1.25Z"/>
    </svg>
  </div> 
  `;
}


// (add-btn) intital Shape (Before adding to Cart)
function addbtnInit(product) {
  let addbtn = product.querySelector(".add-btn");
  addbtn.innerHTML = `
  <img src="assets/images/icon-add-to-cart.svg"></img>Add To Cart
  `;
  product.classList.remove("added");
}

// Shape of Cart When Empty
function cartEmpty() {
  cartBody.innerHTML = `
    <div class="Cart-img">
      <img src="assets/images/illustration-empty-cart.svg" alt="">
    </div>
    <p>Your added items will appear here</p>
  `;
}


// Incrementing The Quantity of a Product.
function increment(product) {
  let item = cartArray.find((pro) => pro.name === product.getAttribute("name"));
  item.quantity++;
  product.querySelector(".quant").innerHTML = item.quantity;
  window.sessionStorage.setItem("cartContent",JSON.stringify(cartArray));
  updateCart();
}

// Decrementing The Quantity of a Product.
function decrement(product) {
  let item = cartArray.find((pro) => pro.name === product.getAttribute("name"));

  // if (quantity == 1)  => remove product from cart
  if(item.quantity == 1) {
    addbtnInit(product);
    removeFromCart(product);
  }

  // else => decrement
  else {
    item.quantity--;
    product.querySelector(".quant").innerHTML = item.quantity;
    window.sessionStorage.setItem("cartContent",JSON.stringify(cartArray));
  }

  updateCart();
}



// Removing From Cart
function removeFromCart(product) {
  cartArray = cartArray.filter((item) => item.name !== product.getAttribute("name"));
  window.sessionStorage.setItem("cartContent",JSON.stringify(cartArray));
}


// Update the Cart Content
function updateCart() {

  // If Cart is Empty
  if(!cartArray.length) {
    counter.textContent = 0;
    cartEmpty();
  }
  else {
    let numofproducts = 0;
    let totalPrice = 0;
    let content = ``;
    cartBody.innerHTML = "";
    for(let product of cartArray) {
      content += `
      <div class="product" name="${product.name}">
        <div class="details">
          <h5>${product.name}</h5>
          <span class="quant">${product.quantity}x</span>
          <span class="price">@ $${product.price}</span>
          <span class="total-price">$${(+product.quantity * +product.price).toFixed(2)}</span>
        </div>
        <div class="delete-btn" name="${product.name}">
          <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" fill="none" viewBox="0 0 10 10">
            <path fill="#CAAFA7" d="M8.375 9.375 5 6 1.625 9.375l-1-1L4 5 .625 1.625l1-1L5 4 8.375.625l1 1L6 5l3.375 3.375-1 1Z"/>
          </svg>
        </div>
      </div> 
      `;
      numofproducts += +product.quantity;
      totalPrice += (+product.quantity * +product.price);
    }
    counter.textContent = numofproducts;
    let order = `
    <div class="order mt-30 between-align-c">
      <span>Order Total</span>
      <p class="bill">$${(totalPrice.toFixed(2))}</p>
    </div>
    `;
    let neutral = `
    <div class="neutral">
      <svg class="mr-5" xmlns="http://www.w3.org/2000/svg" width="21" height="20" fill="none" viewBox="0 0 21 20">
        <path fill="#1EA575" d="M8 18.75H6.125V17.5H8V9.729L5.803 8.41l.644-1.072 2.196 1.318a1.256 1.256 0 0 1 .607 1.072V17.5A1.25 1.25 0 0 1 8 18.75Z"/><path fill="#1EA575" d="M14.25 18.75h-1.875a1.25 1.25 0 0 1-1.25-1.25v-6.875h3.75a2.498 2.498 0 0 0 2.488-2.747 2.594 2.594 0 0 0-2.622-2.253h-.99l-.11-.487C13.283 3.56 11.769 2.5 9.875 2.5a3.762 3.762 0 0 0-3.4 2.179l-.194.417-.54-.072A1.876 1.876 0 0 0 5.5 5a2.5 2.5 0 1 0 0 5v1.25a3.75 3.75 0 0 1 0-7.5h.05a5.019 5.019 0 0 1 4.325-2.5c2.3 0 4.182 1.236 4.845 3.125h.02a3.852 3.852 0 0 1 3.868 3.384 3.75 3.75 0 0 1-3.733 4.116h-2.5V17.5h1.875v1.25Z"/>
      </svg>
      <p class="txt-cap">this is a <span class="carbon">carbon-neutral</span> delivery</p>
    </div>
    `;
    let submit = document.createElement("input");
    submit.type = "submit";
    submit.value = `Confirm Order`;
    submit.classList.add("confirm","main-btn");
    cartBody.innerHTML = content + order + neutral;
    cartBody.appendChild(submit);
  }
}


// Creating Modal Page in Body
function createModal() {
  let totalPrice = 0;
  let modalEle = document.createElement("div");
  let orders = ``;
  for(const product of cartArray) {
    orders += `
    <div class="item d-flex">
      <img src="${product.thumbnailImg}">
      <div class="details">
        <h5>${product.name}</h5>
        <span class="quant">${product.quantity}x</span>
        <span class="price">@ $${product.price}</span>
      </div>
      <span class="total-price">$${(+product.quantity * +product.price).toFixed(2)}</span>
    </div>
    `;
    totalPrice += (+product.quantity * +product.price);
  }
  orders += `
    <div class="order mt-25 between-align-c">
      <span class="fs-14">Order Total</span>
      <p class="bill fs-24 bold">$${(totalPrice.toFixed(2))}</p>
    </div>
  `;
  let modal = `
    <div class="modal-content p-20 fs-14">
      <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 48 48" fill="none">
        <path d="M21 32.121L13.5 24.6195L15.6195 22.5L21 27.879L32.3775 16.5L34.5 18.6225L21 32.121Z" fill="#1EA575"/>
        <path d="M24 3C19.8466 3 15.7865 4.23163 12.333 6.53914C8.8796 8.84665 6.18798 12.1264 4.59854 15.9636C3.0091 19.8009 2.59323 24.0233 3.40352 28.0969C4.21381 32.1705 6.21386 35.9123 9.15077 38.8492C12.0877 41.7861 15.8295 43.7862 19.9031 44.5965C23.9767 45.4068 28.1991 44.9909 32.0364 43.4015C35.8736 41.812 39.1534 39.1204 41.4609 35.667C43.7684 32.2135 45 28.1534 45 24C45 18.4305 42.7875 13.089 38.8493 9.15076C34.911 5.21249 29.5696 3 24 3ZM24 42C20.4399 42 16.9598 40.9443 13.9997 38.9665C11.0397 36.9886 8.73256 34.1774 7.37018 30.8883C6.0078 27.5992 5.65134 23.98 6.34587 20.4884C7.04041 16.9967 8.75474 13.7894 11.2721 11.2721C13.7894 8.75473 16.9967 7.0404 20.4884 6.34587C23.98 5.65133 27.5992 6.00779 30.8883 7.37017C34.1774 8.73255 36.9886 11.0397 38.9665 13.9997C40.9443 16.9598 42 20.4399 42 24C42 28.7739 40.1036 33.3523 36.7279 36.7279C33.3523 40.1036 28.7739 42 24 42Z" fill="#1EA575"/>
      </svg>
      <div class="order-confirmed mt-15 mb-30">
        <h2 class="fs-22">Order Confirmed</h2>
        <span class="fs-13">We hope you enjoy your food!</span>
      </div>
      <div class="order-done">
        ${orders}
      </div>
      <input class="new-order main-btn mt-30" type="submit" value="Start New Order">
    </div>
  `;
  modalEle.innerHTML = modal;
  modalEle.classList.add("modal");

  document.body.appendChild(modalEle);
  document.body.classList.add("modal-opened");
}


// Removing Modal
function removeModal() {
  document.body.removeChild(document.querySelector(".modal"));
  document.body.classList.remove("modal-opened");
}


// Updating Cart On Starting
updateCart();