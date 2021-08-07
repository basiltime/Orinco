let totalDollarAmt = 0;
let myCart = window.localStorage;

if (myCart.length === 0) {
  // If nothing in localStorage, display alternate content asking user to add items to cart
  document.getElementById("form").classList.add('d-none');
  document.getElementById("summary").classList.add('d-none');
  document.getElementById("cart-empty-wrapper").classList.remove('d-none')

} else {
  document.getElementById("cart-empty-wrapper").classList.add('d-none');
  // Loop through localStorage, adding an event listener to call the GET api and populate the table with 
  // cart values.
  for (let i = 0; i < myCart.length; i++) {

    let key = myCart.key(i); // ** key = item id **
    let values = parseInt(myCart.getItem(key)); // ** values = item quantity **

    window.addEventListener('load', (id) => {
      apiRequestItem.open('GET', `http://localhost:3000/api/teddies/${key}`);
      apiRequestItem.send();
    });


    let apiRequestItem = new XMLHttpRequest();
    apiRequestItem.onreadystatechange = () => {
      if (apiRequestItem.readyState === 4) {

        // Error Handling
        let statusCode = apiRequestItem.status;
        let firstDigit = statusCode.toString()[0];
    
        if (firstDigit == 4) {
          window.location.href = "frontend/pages/error-page-404.html"
    
        } else if (firstDigit == 5) {
          window.location.href = "frontend/pages/error-page-500.html"
    
        // Handle API Response  
        } else {
          //Parses JSON response objects to text and displays requested information
          response = JSON.parse(apiRequestItem.response);

          // Add a new row to table
          let table = document.getElementById("myTable");
          let row = table.insertRow(1);
          let cell1 = row.insertCell(0);
          let cell2 = row.insertCell(1);
          let cell3 = row.insertCell(2);
          let cell4 = row.insertCell(3);

          // Populate table with item name, quantity, unit price and item total price
          cell1.textContent = response.name; // name
          cell2.textContent = values; // quantity
          cell3.textContent = `$${response.price/100}`; // unit price
          cell4.textContent = `$${response.price/100 * values}`; // item total price

          // Calculate order total and add to table
          totalDollarAmt = totalDollarAmt + response.price * values / 100;
          let cartTotal = document.getElementById('cart-total');
          cartTotal.textContent = `$${totalDollarAmt}`;
          
        }
      }
    };
  }
}

// Update quantity displayed in cart icon in navbar
function updateCart() {
  let totalQty = 0;

  for (let i = 0; i < myCart.length; i++) {
    let key = myCart.key(i);
    let values = parseInt(myCart.getItem(key));
    totalQty = values + totalQty;
  }

  return document.getElementById('cartQty').textContent = totalQty;
}

updateCart();



// Form Input Elements
let submitButton = document.getElementById('submit-button');
let firstName = document.getElementById('first-name');
let lastName = document.getElementById('last-name');
let address = document.getElementById('address');
let city = document.getElementById('city');
let email = document.getElementById('email');
let form = document.getElementById('form');
let formFieldArray = [firstName, lastName, address, city, email]

// Adds event listener to remove highlighting when an input has text entered
for (let i = 0; i < formFieldArray.length; i++) {
  formFieldArray[i].addEventListener('blur', () => {
    if (formFieldArray[i].value.length > 1 ) 
      formFieldArray[i].classList.remove('invalid')
      warning.innerHTML = "";
  })
}

// Event listener for submit button 
submitButton.addEventListener('click', ($event) => {
  $event.preventDefault()

  // Highlights empty fields on click
  for (let i = 0; i < formFieldArray.length; i++) {
    if (formFieldArray[i].value.length < 1) {
      formFieldArray[i].classList.add('invalid')
    } else {
      formFieldArray[i].classList.remove('invalid')
    }
  }

  // Creates array of products from local storage
  let productsArray = [];

  for (let i = 0; i < myCart.length; i++) {
    let item = myCart.key(i); // item id
    productsArray.push(item);
  }

  // Creates contact object from input values
  let contactData = {
    firstName: firstName.value,
    lastName: lastName.value,
    address: address.value,
    city: city.value,
    email: email.value,
  }

  // Checks if email input is valid
  const emailIsValid = (email) => {
    if (!/\S+@\S+\.\S+/.test(email)) {
      return false
    }
  }

  // Checks if all fields are filled out
  const allFieldsFilled = () => {
    let values = Object.values(contactData)
    for (let i = 0; i < values.length; i++) {
      if (values[i].length == 0) {
        return false
      }
    }
  }

  // If fields incomplete or invalid, displays warning to fill out missing fields
  if (allFieldsFilled() == false) {
    let warning = document.getElementById("warning");
    warning.innerHTML = "Please fill out highlighted fields";
  } else if (emailIsValid(email.value) == false) {
    let email = document.getElementById('email');
    email.classList.add('invalid');
    warning.innerHTML = "Please enter a valid email address"
  }


  // Create the data object and send POST request IF form is validated
  else {
    let data = {
      contact: contactData,
      products: productsArray
    }

    // POST request
    const xhr = new XMLHttpRequest();

    xhr.open('POST', 'http://localhost:3000/api/teddies/order');
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.responseType = 'json';
    xhr.send(JSON.stringify(data));

    // Handle API Response  
    xhr.onload = () => {
      console.log(xhr.response);
      let total = document.getElementById('cart-total').textContent;
      myCart.setItem("id", xhr.response.orderId)
      myCart.setItem("price", total)
      window.location.href = "/frontend/pages/confirmation-page.html"
    }
  }



let data = {
      contact: contactData,
      products: productsArray
    }

async function postData(url = '', data = {} ) {
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data) 
  })
  return response.json();
}

postData('http://localhost:3000/api/teddies/order', data )
  .then(data => {
    console.log(response.status)
    let total = document.getElementById('cart-total').textContent;
    myCart.setItem("id", data.orderId)
    myCart.setItem("price", total)
    window.location.href = "../../frontend/pages/confirmation-page.html"
  }).catch(window.location.href = "../../frontend/pages/error-page-404.html")
}

)