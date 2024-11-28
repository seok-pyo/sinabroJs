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

function makeTemplate(product, count = 0) {
  return `
    <div class="product" data-product-id="${product.id}">
      <img src="${product.images[0]}" alt="Image of ${product.name}" />
      <p>${product.name}</p>
      <div class="flex items-center justify-between">
        <span>Price: ${product.regularPrice}</span>
        <div>
          <button type="button" class="bg-green-300 hover:bg-green-600 py-1 px-3 rounded-full btn-decrease">-</button>
          <span class="cart-count text-green-700">${
            count === 0 ? '' : count
          }</span>
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
  const products = await getProducts();
  const productMap = {};
  products.forEach((product) => {
    productMap[product.id] = product;
  });
  const countMap = {};

  const updateProductCount = (productId) => {
    const productElement = document.querySelector(
      `.product[data-product-id='${productId}']`
    );
    const cartCount = productElement.querySelector('.cart-count');
    cartCount.innerHTML = countMap[productId];
    if (countMap[productId] === 0) {
      cartCount.innerHTML = '';
    }
  };

  const updateCart = () => {
    const productIds = Object.keys(countMap);
    document.querySelector('.cart_items').innerHTML = productIds
      .map((productId) => {
        const productInCart = productMap[productId];
        if (countMap[productId] === 0) return '';
        return makeTemplate(productInCart, countMap[productId]);
      })
      .join('');
    document.querySelector('.totalCount').innerHTML = sumCounts(countMap);
  };

  const increaseCount = (productId) => {
    if (countMap[productId] === undefined) {
      countMap[productId] = 0;
    }
    countMap[productId] += 1;
    updateProductCount(productId);
    updateCart();
  };

  const decreaseCount = (productId) => {
    if (countMap[productId] === undefined) {
      countMap[productId] = 0;
    }
    countMap[productId] -= 1;
    updateProductCount(productId);
    updateCart();
  };

  document.querySelector('#products').innerHTML = products
    .map((product) => makeTemplate(product))
    .join('');

  document.querySelector('#products').addEventListener('click', (event) => {
    const targetElement = event.target;
    const productElement = findElement(targetElement, '.product');
    const productId = productElement.getAttribute('data-product-id');
    const product = products.find((product) => product.id === productId);

    if (
      targetElement.matches('.btn-decrease') ||
      targetElement.matches('.btn-increase')
    ) {
      if (targetElement.matches('.btn-decrease') && countMap[productId] > 0) {
        decreaseCount(productId);
      } else if (targetElement.matches('.btn-increase')) {
        increaseCount(productId);
      }
    }
  });

  // main 함수 내에서 countMap을 공유하고 있기 떄문에 동일한 메서드 사용 가능
  document.querySelector('.cart_items').addEventListener('click', (event) => {
    const targetElement = event.target;
    const productElement = findElement(targetElement, '.product');
    const productId = productElement.getAttribute('data-product-id');
    const product = products.find((product) => product.id === productId);

    if (
      targetElement.matches('.btn-decrease') ||
      targetElement.matches('.btn-increase')
    ) {
      if (targetElement.matches('.btn-decrease') && countMap[productId] > 0) {
        decreaseCount(productId);
      } else if (targetElement.matches('.btn-increase')) {
        increaseCount(productId);
      }
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

main();
