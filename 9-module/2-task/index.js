import Carousel from '../../6-module/3-task/index.js';
import slides from '../../6-module/3-task/slides.js';

import RibbonMenu from '../../7-module/1-task/index.js';
import categories from '../../7-module/1-task/categories.js';

import StepSlider from '../../7-module/4-task/index.js';
import ProductsGrid from '../../8-module/2-task/index.js';

import CartIcon from '../../8-module/1-task/index.js';
import Cart from '../../8-module/4-task/index.js';

export default class Main {

  constructor() {
  }

  async render() {
    this.carousel = new Carousel(slides);
    this.ribbonMenu = new RibbonMenu(categories);
    this.stepSlider = new StepSlider({ steps: 5, value: 3 });
    this.cartIcon = new CartIcon();
    this.cart = new Cart(this.cartIcon);
    
    this.dataCarouselHolder = document.querySelector("[data-carousel-holder]");
    this.dataRibbonHolder = document.querySelector("[data-ribbon-holder]");
    this.dataSliderHolder = document.querySelector("[data-slider-holder]");
    this.dataCartIconHolder = document.querySelector("[data-cart-icon-holder]");
    
    this.dataCarouselHolder.append(this.carousel.elem);
    this.dataRibbonHolder.append(this.ribbonMenu.elem);
    this.dataSliderHolder.append(this.stepSlider.elem);
    this.dataCartIconHolder.append(this.cartIcon.elem);
    
    const response = await fetch('products.json');
    this.productsArray = await response.json();
    
    this.productsGrid = new ProductsGrid(this.productsArray);
    this.dataProductsGridHolder = document.querySelector("[data-products-grid-holder]");

    this.dataProductsGridHolder.innerHTML = "";
    this.dataProductsGridHolder.append(this.productsGrid.elem);

    this.productsGrid.updateFilter({
      noNuts: document.getElementById('nuts-checkbox').checked,
      vegeterianOnly: document.getElementById('vegeterian-checkbox').checked,
      maxSpiciness: this.stepSlider.value,
      category: this.ribbonMenu.value
    });

    document.querySelector('body').addEventListener('product-add', (event) => {
      const currentProduct = this.productsArray.find(product => product.id === event.detail);
      
      this.cart.addProduct(currentProduct);
    });

    this.stepSlider.elem.addEventListener('slider-change', (event) => {
      this.productsGrid.updateFilter({
        maxSpiciness: event.detail,
      });
    });

    this.ribbonMenu.elem.addEventListener('ribbon-select', (event) => {
      this.productsGrid.updateFilter({
        category: event.detail,
      });
    });

    document.getElementById('nuts-checkbox').addEventListener('change', (event) => {
      this.productsGrid.updateFilter({
        noNuts: event.target.checked,
      });
    });
    
    document.getElementById('vegeterian-checkbox').addEventListener('change', (event) => {
      this.productsGrid.updateFilter({
        vegeterianOnly: event.target.checked,
      });
    });
  }
}
