let navIcon = document.querySelector(".nav-icon");
let navMenu = document.querySelector(".nav-main");


navIcon.addEventListener("click", (e) => {
  navMenu.classList.toggle("show");
});


// 


async function getData(url) {
  let resposne = await fetch(url,{"method":"Get"});
  let data = await resposne.json();
  return data;
}

function displayData(data) {
  let cardimgs = document.querySelectorAll(".main-page .desserts .card .img img")
  let cardName = document.querySelectorAll(".main-page .desserts .card .name")
  let cardPrice = document.querySelectorAll(".main-page .desserts .card .price")
  let cardCategory = document.querySelectorAll(".main-page .desserts .card .category")

  for (let i = 0; i < data.length; i++) {
    cardimgs[i].src = data[i].image.mobile;
    cardName[i].innerHTML = data[i].name;
    cardPrice[i].innerHTML = `$${data[i].price}`;
    cardCategory[i].innerHTML = data[i].category;
  }
  
}

let dataFetched = getData("./data.json")
dataFetched
.then((data) => {
  displayData(data)
})
.catch((fail) => console.log(Error("There is a problem Happened")))

