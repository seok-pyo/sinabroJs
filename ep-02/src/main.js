// https://learnwitheunjae.dev/api/sinabro-js/ecommerce
// api

async function main() {
  const response = await fetch(
    'https://learnwitheunjae.dev/api/sinabro-js/ecommerce'
  );
  const products = await response.json();
  console.log(products);

  document.querySelector('#products').innerHTML = products
    .map(
      (product) => `
      <div class="product">
        <img src="${product.images[0]}" alt="Image of ${product.name}" />
        <p>${product.name}</p>
      </div>
    `
    )
    .join('');
}

main();
