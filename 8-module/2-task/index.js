import createElement from '../../assets/lib/create-element.js';
import ProductCard from '../../6-module/2-task/index.js';

export default class ProductGrid {
  constructor(products) {
    this.products = products;
    this.filters = {};
    this.render();
  }

  render() {
    this.elem = createElement(`
      <div class="products-grid">
        <div class="products-grid__inner"></div>
      </div>
    `);

    this.productsGrid = this.elem.querySelector('.products-grid__inner');

    this.products.forEach(product => {
      const productCard = new ProductCard(product);
      this.productsGrid.append(productCard.elem);
    });

    return this.elem;
  }

  updateFilter(filters) {
    Object.assign(this.filters, filters);

    const filteredProducts = this.products.filter((product) => 
      (!this.filters.noNuts || !product.nuts) &&
      (!this.filters.vegeterianOnly || product.vegeterian) &&
      (!this.filters.maxSpiciness || product.spiciness <= this.filters.maxSpiciness) &&
      (!this.filters.category || product.category === this.filters.category)
    );

    this.productsGrid.innerHTML = '';

    filteredProducts.forEach(product => {
      const productCard = new ProductCard(product);
      this.productsGrid.append(productCard.elem);
    });
  }
}
