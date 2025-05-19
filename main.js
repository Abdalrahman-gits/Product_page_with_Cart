 /* =============== Navigation Bar =============== */
let navIcon = document.querySelector(".nav-icon");
let navMenu = document.querySelector(".nav-main");

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
  let resposne = await fetch(url,{"method":"Get"});
  let data = await resposne.json();
  return data;
}

function displayData(data) {
  let cardscontainer = document.querySelector(".main-page .desserts .cards")
  let cardsContent = ``; // Prevent Rewrite in document and print for one Time.

  for (let i = 0; i < data.length; i++) {
    cardsContent += `
        <div class="card" name="${data[i].name}" data-price="${(data[i].price).toFixed(2)}">
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

let cartArray = sessionStorage.getItem("cartContent") ? JSON.parse(sessionStorage.getItem("cartContent")) : [];

function cartInit() {
  let cardsinstorage = document.querySelectorAll(".card");
  if(cardsinstorage) {
    cardsinstorage.forEach((card) => {
      if(cartArray.some((item) => item.name === card.getAttribute("name"))) {
        card.classList.add("added");
        addbtnAdded(card);
      }
    })
  }
  desserts.addEventListener("click",addbtnHandle);
  cartBody.addEventListener("click",deletebtn);
}

function addbtnHandle(event) {
  let clicked = event.target;
  if(clicked.closest(".add-btn") && !clicked.closest(".card").classList.contains("added")) {
    addToCart(clicked.closest(".card"));
  }

  if(clicked.closest(".plus")) {
    increment(clicked.closest(".card"))
  }
  
  if(clicked.closest(".minus")) {
    decrement(clicked.closest(".card"))
  }
}

function deletebtn(event) {
  let clicked = event.target.closest(".delete-btn");
  if(clicked) {
    removeFromCart(clicked.closest(".product"))
    addbtnInit(desserts.querySelector(`[name="${clicked.closest(".product").getAttribute("name")}"]`))
    updateCart();
  }
}

function addToCart(product) {
  product.classList.add("added");
  const info = {
    name: product.getAttribute("name"),
    quantity: 1,
    price: product.dataset.price,
  }
  cartArray.push(info);
  addbtnAdded(product);
  window.sessionStorage.setItem("cartContent",JSON.stringify(cartArray));
  updateCart();
}

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

function addbtnInit(product) {
  let addbtn = product.querySelector(".add-btn");
  addbtn.innerHTML = `
  <img src="assets/images/icon-add-to-cart.svg"></img>Add To Cart
  `;
  product.classList.remove("added");
}

function cartEmpty() {
  cartBody.innerHTML = `
        <div class="Cart-img">
          <img src="assets/images/illustration-empty-cart.svg" alt="">
        </div>
        <p>Your added items will appear here</p>
  `;
}

function increment(product) {
  let item = cartArray.find((pro) => pro.name === product.getAttribute("name"));
  item.quantity++;
  product.querySelector(".quant").innerHTML = item.quantity;
  window.sessionStorage.setItem("cartContent",JSON.stringify(cartArray));
  updateCart();
}

function decrement(product) {
  let item = cartArray.find((pro) => pro.name === product.getAttribute("name"));
  if(item.quantity == 1) {
    addbtnInit(product);
    removeFromCart(product);
  }
  else {
    item.quantity--;
    product.querySelector(".quant").innerHTML = item.quantity;
    window.sessionStorage.setItem("cartContent",JSON.stringify(cartArray));
  }
  updateCart();
}

function removeFromCart(product) {
  cartArray = cartArray.filter((item) => item.name !== product.getAttribute("name"));
  window.sessionStorage.setItem("cartContent",JSON.stringify(cartArray));
}

function updateCart() {
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
    submit.classList.add("submit");
    cartBody.innerHTML = content;
    cartBody.innerHTML += order;
    cartBody.innerHTML += neutral;
    cartBody.appendChild(submit);
  }
}

updateCart();