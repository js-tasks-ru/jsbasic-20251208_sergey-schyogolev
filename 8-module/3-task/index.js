export default class Cart {
  cartItems = []; // [product: {...}, count: N]

  constructor(cartIcon) {
    this.cartIcon = cartIcon;
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

  onProductUpdate(cartItem) {
    // реализуем в следующей задаче

    this.cartIcon.update(this);
  }
}

