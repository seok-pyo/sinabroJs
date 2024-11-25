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
            <button type="button" class="bg-green-300 hover:bg-green-600 py-1 px-3 rounded-full">-</button>
            <span class="hidden text-green-700">3</span>
            <button type="button" class="bg-green-300 hover:bg-green-600 py-1 px-3 rounded-full">+</button>
          </div>
        </div>
      </div>
    `
    )
    .join('');
}

main();
