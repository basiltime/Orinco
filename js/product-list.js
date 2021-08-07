window.addEventListener('load', () => {
  apiRequestList.open('GET', 'http://localhost:3000/api/teddies');
  apiRequestList.send();
});


let apiRequestList = new XMLHttpRequest();

apiRequestList.onreadystatechange = () => {
  if (apiRequestList.readyState === 4) {

    // Error Handling
    let statusCode = apiRequestList.status;
    let firstDigit = statusCode.toString()[0];

    if (firstDigit == 4) {
      window.location.href = "frontend/pages/error-page-404.html"

    } else if (firstDigit == 5) {
      window.location.href = "frontend/pages/error-page-500.html"

    // Handle API Response  
    } else {
      let response = JSON.parse(apiRequestList.response);
      let buttons = document.getElementsByClassName('btn');

      response.forEach((item, index) => {
        let id = item._id;
        document.getElementsByClassName('name')[index].textContent = item.name;
        document.getElementsByClassName('description')[index].textContent = item.description;
        document.getElementsByClassName('price')[index].textContent = `$${item.price/100}`;
        document.getElementsByClassName('image')[index].src = item.imageUrl;
        buttons[index].setAttribute('href', `frontend/pages/single-item.html?id=${id}`);
      }) 
    }
  }
};



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