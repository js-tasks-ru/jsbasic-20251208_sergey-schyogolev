import createElement from "../../assets/lib/create-element.js";

export default class Carousel {
  constructor(slides) {
    this.slides = slides;
    this.render();
    this.addToCart();
    this.initCarousel();
  }

  render() {
    this.elem = createElement(`
      <div class="carousel">
        <div class="carousel__arrow carousel__arrow_right">
        <img src="/assets/images/icons/angle-icon.svg" alt="icon">
      </div>
      <div class="carousel__arrow carousel__arrow_left">
        <img src="/assets/images/icons/angle-left-icon.svg" alt="icon">
      </div>
        <div class="carousel__inner"></div>
      </div>
      `);
    const carouselContainer = this.elem.querySelector(".carousel__inner");
    let slidesContainer = "";

    this.slides.forEach(({ name, price, image, id }) => {
      slidesContainer += `<div class="carousel__slide" data-id="${id}">
          <img src="/assets/images/carousel/${image}" class="carousel__img" alt="slide">
          <div class="carousel__caption">
            <span class="carousel__price">€${price.toFixed(2)}</span>
            <div class="carousel__title">${name}</div>
            <button type="button" class="carousel__button">
              <img src="/assets/images/icons/plus-icon.svg" alt="icon">
            </button>
          </div>
        </div>`;
    });

    carouselContainer.innerHTML = slidesContainer;
    
    return this.elem;
  }

  initCarousel() {
    const carouselContainer = this.elem.querySelector(".carousel__inner");
    const carouselButtonLeft = this.elem.querySelector(".carousel__arrow_left");
    const carouselButtonRight = this.elem.querySelector(".carousel__arrow_right");
    const carouselItems = carouselContainer.querySelectorAll(".carousel__slide");
    let currentIndex = 0;

    function hideArrow(index) {
      if (index === 0) {
        carouselButtonLeft.style.display = "none";
        carouselButtonRight.style.display = "";
      } else {
        carouselButtonLeft.style.display = "";
      }
      if (index === carouselItems.length - 1) {
        carouselButtonRight.style.display = "none";
      } else {
        carouselButtonRight.style.display = "";
      }
    }

    //Вызов для проверки состояния при загрузке страницы
    hideArrow(currentIndex);

    function offset(index) {
      carouselContainer.style.transform = `translateX(-${
        carouselItems[index].offsetWidth * index
      }px)`;
    }

    carouselButtonRight.addEventListener("click", () => {
      currentIndex += 1;

      hideArrow(currentIndex);
      offset(currentIndex);
    });

    carouselButtonLeft.addEventListener("click", () => {
      currentIndex -= 1;

      hideArrow(currentIndex);
      offset(currentIndex);
    });
  }

  addToCart() {
    const buttons = this.elem.querySelectorAll(".carousel__button");
    
    buttons.forEach(button => {
      button.addEventListener("click", () => {
        this.elem.dispatchEvent(new CustomEvent("product-add", {
          detail: button.closest(".carousel__slide").dataset.id,
          bubbles: true
        }));
      });
    });
  }
}
