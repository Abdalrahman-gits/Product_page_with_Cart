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

  if(clicked.classList.contains("plus")) {
    increment(clicked.closest(".card"))
  }
  
  if(clicked.classList.contains("minus")) {
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
  <img class="minus" src="assets/images/icon-decrement-quantity.svg">
  <span class="quant ml-5 mr-5">${productClass.quantity}</span>
  <img class="plus" src="assets/images/icon-increment-quantity.svg"> 
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
       <div class="delete-btn" name="${product.name}"><img src="assets/images/icon-remove-item.svg"></img></div>
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
    `
    let submit = document.createElement("input");
    submit.type = "submit";
    submit.value = `Order Now`;
    submit.classList.add("submit","mt-30");
    cartBody.innerHTML = content;
    cartBody.innerHTML += order;
    cartBody.appendChild(submit);
  }
}

updateCart();