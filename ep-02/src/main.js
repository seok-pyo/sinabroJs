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

function makeTemplate(product) {
  return `
    <div class="product" data-product-id="${product.id}">
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
  `;
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

async function main() {
  // console.log(process.env.NODE_ENV);
  const products = await getProducts();
  const productMap = {};
  products.forEach((product) => {
    productMap[product.id] = product;
  });
  const countMap = {};

  document.querySelector('#products').innerHTML = products
    .map((product) => makeTemplate(product))
    .join('');

  document.querySelector('#products').addEventListener('click', (event) => {
    const targetElement = event.target;
    const productElement = findElement(targetElement, '.product');
    const productId = productElement.getAttribute('data-product-id');
    const product = products.find((product) => product.id === productId);

    console.log(productId);
    console.log(countMap);

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

      if (countMap[productId] === 0) {
        cartCount.innerHTML = '';
      } else {
        const productIds = Object.keys(countMap);
        document.querySelector('.cart_items').innerHTML = productIds
          .map((productId) => {
            const productInCart = productMap[productId];
            return makeTemplate(productInCart);
          })
          .join('');
      }

      document.querySelector('.totalCount').innerHTML = sumCounts(countMap);
    }
  });

  document.querySelector('#cart-button').addEventListener('click', (event) => {
    document.body.classList.add('displaying-cart');
  });

  document.querySelector('.close-btn').addEventListener('click', (event) => {
    document.body.classList.remove('displaying-cart');
  });
  document.querySelector('.cart-left').addEventListener('click', (event) => {
    document.body.classList.remove('displaying-cart');
  });
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
