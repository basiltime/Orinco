// Get the items's ID from the URL string
const queryString = window.location.search;
const urlParam = new URLSearchParams(queryString);
const id = urlParam.get("id");


// Event listener to send GET request on load
window.onload = () => {
  getProduct()
  updateCart()
}

const getProduct = async () => {
  let response = await axios(`https://project7-backend.herokuapp.com/api/teddies/${id}`)
      // Populate the DOM with name, price, image and description
      document.getElementById('name').textContent = response.data.name;
      document.getElementById('price').textContent = `$${response.data.price/100}`;
      document.getElementById('image').setAttribute('src', response.data.imageUrl);
      document.getElementById('description').textContent = response.data.description;

      // Populate color customization drop down
      for (let i in response.data.colors) {
        let dropdown = document.getElementById('dropdown')
        let item = document.createElement('button');
        item.textContent = response.data.colors[i];
        item.setAttribute("class", "dropdown-item");
        item.setAttribute("type", "button");
        dropdown.appendChild(item)
      }
    

      // Customization Dropdown Menu
      let dropdownItems = document.getElementsByClassName('dropdown-item');
      for (let i = 0; i < dropdownItems.length; i++) {
        dropdownItems[i].addEventListener('click', () => {
          document.getElementById('dropdownMenuButton').textContent = dropdownItems[i].textContent;
        });
      }

      // Show page content, hide loading spinner
      document.getElementsByClassName("main")[0].classList.remove("d-none")
      document.getElementsByClassName("spinner-background")[0].classList.add("d-none")
}


/////////////////////////////////////////////////////////////////////////
// Cart Functionality - functions that add and remove items to/from localStorage
const addToCart = itemID => {
  if (!localStorage.getItem(id)) {
    localStorage.setItem(id, 1)
  } else {
    let addOne = parseInt(localStorage.getItem(id)) + 1;
    localStorage.setItem(id, addOne);
  }
}

const removeItem = itemID => {
  let minusOne = parseInt(localStorage.getItem(id)) - 1;
  if (parseInt(localStorage.getItem(id)) >= 1) {
    localStorage.setItem(id, minusOne);
  } else {
    localStorage.removeItem(id);
  }
}


/////////////////////////////////////////////////////////////////////////

function updateCart() {
  let totalQty = 0;

  for (let i = 0; i < localStorage.length; i++) {
    let key = localStorage.key(i); // stores each key in the variable
    let values = parseInt(localStorage.getItem(key));
    totalQty = values + totalQty;
    if (totalQty == 0) {
      removeItem(i)
    } // and if quantity of an item is 0, remove it from local storage with the removeItem function
  }

  return document.getElementById('cartQty').textContent = totalQty;

}


updateCart();


////////////////////////////////////////////////////////////////////////
// Add to Cart event listener
document.getElementById('addToCartBtn').addEventListener('click', ($event) => {
  $event.preventDefault();
  addToCart(id);
  updateCart()
});


////////////////////////////////////////////////////////////////////////
// Remove item event listener
document.getElementById('removeItemBtn').addEventListener('click', ($event) => {
  $event.preventDefault();
  removeItem(id);
  updateCart()
});