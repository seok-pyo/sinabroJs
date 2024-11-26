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
    return await response.json();
  }
}

async function main() {
  // console.log(process.env.NODE_ENV);
  const products = await getProducts();
  const countMap = {};

  document.querySelector('#products').innerHTML = products
    .map(
      (product, index) => `
      <div class="product" data-product-id="${product.id}" data-product-index="${index}">
        <img src="${product.images[0]}" alt="Image of ${product.name}" />
        <p>${product.name}</p>
        <div class="flex items-center justify-between">
          <span>Price: ${product.regularPrice}</span>
          <div>
            <button type="button" class="bg-green-300 hover:bg-green-600 py-1 px-3 rounded-full btn-decrease">-</button>
            <span class="cart-count text-green-700"></span>
            <button type="button" class="bg-green-300 hover:bg-green-600 py-1 px-3 rounded-full btn-increase">+</button>
          </div>
        </div>
      </div>
    `
    )
    .join('');

  document.querySelector('#products').addEventListener('click', (event) => {
    const targetElement = event.target;
    const productElement = findElement(targetElement, '.product');
    const productId = productElement.getAttribute('data-product-id');
    const productIndex = productElement.getAttribute('data-product-index');
    const product = products[productIndex];

    if (
      targetElement.matches('.btn-decrease') ||
      targetElement.matches('.btn-increase')
    ) {
      if (countMap[productId] === undefined) {
        countMap[productId] = 0;
      }
      if (targetElement.matches('.btn-decrease') && countMap[productId] > 0) {
        countMap[productId] -= 1;
      } else if (targetElement.matches('.btn-increase')) {
        countMap[productId] += 1;
      }
      const cartCount = productElement.querySelector('.cart-count');
      cartCount.innerHTML = countMap[productId];
      if (countMap[productId] === 0) cartCount.innerHTML = '';

      document.querySelector('.totalCount').innerHTML = sumCounts(countMap);
    }
  });
}

function sumCounts(countMap) {
  return Object.values(countMap).reduce((acc, cur) => {
    acc += cur;
    return acc;
  }, 0);
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
