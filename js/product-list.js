window.onload = () => {
  getProducts()  
};

const getProducts = async () => {
let response = await axios('https://project7-backend.herokuapp.com/api/teddies')
      let buttons = document.getElementsByClassName('btn');
      response.data.forEach((item, index) => {
        let id = item._id;
        document.getElementsByClassName('name')[index].textContent = item.name;
        document.getElementsByClassName('description')[index].textContent = item.description;
        document.getElementsByClassName('price')[index].textContent = `$${item.price/100}`;
        document.getElementsByClassName('image')[index].src = item.imageUrl;
        buttons[index].setAttribute('href', `pages/single-item.html?id=${id}`);
      })

      // Show page content, hide loading spinner
      document.getElementsByClassName("main")[0].classList.remove("d-none")
      document.getElementsByClassName("spinner-background")[0].classList.add("d-none")
  }

function updateCart() {
  let totalQty = 0;

  for (let i = 0; i < localStorage.length; i++) {
    let key = localStorage.key(i); // stores each key in the variable
    let values = parseInt(localStorage.getItem(key));
    totalQty = values + totalQty;
  }

  return document.getElementById('cartQty').textContent = totalQty;
}

updateCart();