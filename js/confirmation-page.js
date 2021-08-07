// If user refreshes the page, redirects to product list page rather than showing an empty confirmation page
if (localStorage.length === 0) { window.location.href = "../../index.html"}

// Display the order id and total price
let id = document.getElementById('id')
let price = document.getElementById('price')
id.textContent = localStorage.getItem('id');
price.textContent = localStorage.getItem('price')

// Clear localStorage after displaying content
localStorage.clear();

// Updates cart quantity displayed in navbar
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