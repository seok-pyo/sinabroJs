// https://learnwitheunjae.dev/api/sinabro-js/ecommerce
// api

import test from './test.json?raw'; // ?raw Vite이 제공하는 기능

async function getProducts() {
  if (process.env.NODE_ENV === 'development') {
    return JSON.parse(test);
  } else {
    const response = await fetch(
      'https://learnwitheunjae.dev/api/sinabro-js/ecommerce'
    );
    const products = await response.json();
  }
  console.log(products);
}

async function main() {
  // console.log(process.env.NODE_ENV);
  const products = await getProducts();

  document.querySelector('#products').innerHTML = products
    .map(
      (product) => `
      <div class="product">
        <img src="${product.images[0]}" alt="Image of ${product.name}" />
        <p>${product.name}</p>
        <div class="flex items-center justify-between">
          <span>Price: ${product.regularPrice}</span>
          <div>
            <button type="button" class="bg-green-300 hover:bg-green-600 py-1 px-3 rounded-full btn-decrease">-</button>
            <span class="hidden text-green-700">3</span>
            <button type="button" class="bg-green-300 hover:bg-green-600 py-1 px-3 rounded-full btn-increase">+</button>
          </div>
        </div>
      </div>
    `
    )
    .join('');
}

function findElement(startingElement, selector) {
  let currentElement = startingElement;
  while (currentElement) {
    if (currentElement.matches(selector)) {
      return currentElement;
    }
    currentElement = currentElement.parentElement;
  }
  return null;
}

document.querySelector('#products').addEventListener('click', (event) => {
  console.log(event.target);
  const targetElement = event.target;
  const producetElement = findElement(targetElement, '.product');
  if (targetElement.matches('.btn-decrease')) {
    console.log('decrease');
  } else if (targetElement.matches('.btn-increase')) {
    console.log('increase');
  }
});

/*
Advanced event handling
모든 요소를 배열을 순회하면서 이벤트 리스터를 부착
Array.from(document.querySelectorAll(".btn-decrease")).forEach(button => {
    button.addEventListener("click", () => {
      ...
      })
  })

docuemnt.querySelector("#products").addEventLitener("click", (event) => {
  const targetElement = event.target;
  if(targetElement.matches(".btn-decrease")) {
    console.log("decrease")
  } else if(targetElement.maches(".btn-increase")){
    console.log("increase")
  }
  
  })


 */

main();
