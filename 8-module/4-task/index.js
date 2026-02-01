import createElement from '../../assets/lib/create-element.js';
import escapeHtml from '../../assets/lib/escape-html.js';

import Modal from '../../7-module/2-task/index.js';

export default class Cart {
  cartItems = []; // [product: {...}, count: N]

  constructor(cartIcon) {
    this.cartIcon = cartIcon;

    this.addEventListeners();
  }

  addProduct(product) {
    if (!product) { return; }

    const foundedProduct = this.cartItems.find(item => item.product.id === product.id);
    
    if (foundedProduct) {
      foundedProduct.count += 1;
      this.onProductUpdate(foundedProduct);
    } else {
      const newCartItem = { product, count: 1 };
      
      this.cartItems.push(newCartItem);
      this.onProductUpdate(newCartItem);
    }
  }

  updateProductCount(productId, amount) {
    const foundedProduct = this.cartItems.find(item => item.product.id === productId);

    foundedProduct.count += amount;
    
    if (foundedProduct.count === 0) {
      this.cartItems.splice(this.cartItems.indexOf(foundedProduct), 1);
      this.onProductUpdate();
    } else {
      this.onProductUpdate(foundedProduct);
    }
  }

  isEmpty() {
    return this.cartItems.length === 0;
  }

  getTotalCount() {
    return this.cartItems.reduce((sum, item) => sum + item.count, 0);
  }

  getTotalPrice() {
    return this.cartItems.reduce((sum, item) => sum + item.product.price * item.count, 0);
  }

  renderProduct(product, count) {
    return createElement(`
    <div class="cart-product" data-product-id="${
      product.id
    }">
      <div class="cart-product__img">
        <img src="/assets/images/products/${product.image}" alt="product">
      </div>
      <div class="cart-product__info">
        <div class="cart-product__title">${escapeHtml(product.name)}</div>
        <div class="cart-product__price-wrap">
          <div class="cart-counter">
            <button type="button" class="cart-counter__button cart-counter__button_minus">
              <img src="/assets/images/icons/square-minus-icon.svg" alt="minus">
            </button>
            <span class="cart-counter__count">${count}</span>
            <button type="button" class="cart-counter__button cart-counter__button_plus">
              <img src="/assets/images/icons/square-plus-icon.svg" alt="plus">
            </button>
          </div>
          <div class="cart-product__price">€${product.price.toFixed(2)}</div>
        </div>
      </div>
    </div>`);
  }

  renderOrderForm() {
    return createElement(`<form class="cart-form">
      <h5 class="cart-form__title">Delivery</h5>
      <div class="cart-form__group cart-form__group_row">
        <input name="name" type="text" class="cart-form__input" placeholder="Name" required value="Santa Claus">
        <input name="email" type="email" class="cart-form__input" placeholder="Email" required value="john@gmail.com">
        <input name="tel" type="tel" class="cart-form__input" placeholder="Phone" required value="+1234567">
      </div>
      <div class="cart-form__group">
        <input name="address" type="text" class="cart-form__input" placeholder="Address" required value="North, Lapland, Snow Home">
      </div>
      <div class="cart-buttons">
        <div class="cart-buttons__buttons btn-group">
          <div class="cart-buttons__info">
            <span class="cart-buttons__info-text">total</span>
            <span class="cart-buttons__info-price">€${this.getTotalPrice().toFixed(
              2
            )}</span>
          </div>
          <button type="submit" class="cart-buttons__button btn-group__button button">order</button>
        </div>
      </div>
    </form>`);
  }

  renderModal() {
    this.modal = new Modal();
    
    this.modal.setTitle("Your order");
    this.modal.open();
    
    const rootElement = createElement(`
      <div></div>
      `);

    this.cartItems.forEach(item => {
      rootElement.append(this.renderProduct(item.product, item.count));
    });

    rootElement.append(this.renderOrderForm());

    this.modal.setBody(rootElement);

    rootElement.addEventListener('click', (event) =>{
      const button = event.target.closest('.cart-counter__button');
      const currentProduct = button.closest('[data-product-id]');
      
      if (button.classList.contains('cart-counter__button_minus')) {
        this.updateProductCount(currentProduct.dataset.productId, -1);
      }

      if (button.classList.contains('cart-counter__button_plus')) {
        this.updateProductCount(currentProduct.dataset.productId, 1);
      }
    });

    this.form = rootElement.querySelector('.cart-form');

    this.form.addEventListener('submit', (event) => {
      this.onSubmit(event);
    });
  }

  onProductUpdate(cartItem) {
    this.cartIcon.update(this);

    if (this.isEmpty()) {
      this.modal.close();
      return;
    }

    if (!cartItem) {
      return;
    }
    
    if (document.body.classList.contains('is-modal-open')) {
      const productCount = this.modal.elem.querySelector(`[data-product-id=${cartItem.product.id}] .cart-counter__count`);
      const productPrice = this.modal.elem.querySelector(`[data-product-id=${cartItem.product.id}] .cart-product__price`);
      const infoPrice = this.modal.elem.querySelector('.cart-buttons__info-price');
  
      productCount.innerHTML = cartItem.count;
      productPrice.innerHTML = `€${(cartItem.product.price * cartItem.count).toFixed(2)}`;
      infoPrice.innerHTML = `€${this.getTotalPrice().toFixed(2)}`;
    }
  }

  onSubmit(event) {
    event.preventDefault();

    const submitButton = this.modal.elem.querySelector('[type="submit"]');
    submitButton.classList.add('is-loading');

    fetch('https://httpbin.org/post', {
      method: 'POST',
      body: new FormData(this.form)
    })
    .then((response) => {
      if (response.ok) {
        this.modal.setTitle("Success!");
        this.cartItems.length = 0;
        
        const orderSuccessful = createElement(`
          <div class="modal__body-inner">
            <p>
              Order successful! Your order is being cooked :) <br>
              We’ll notify you about delivery time shortly.<br>
              <img src="/assets/images/delivery.gif">
            </p>
          </div>
          `);
    
        this.modal.setBody(orderSuccessful);
      }
    });
  }

  addEventListeners() {
    this.cartIcon.elem.onclick = () => this.renderModal();
  }
}

