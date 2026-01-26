import createElement from "../../assets/lib/create-element.js";

export default class RibbonMenu {
  constructor(categories) {
    this.categories = categories;
    this.render();
    this.initScroll();
    this.ribbonSelect();
  }

  render() {
    this.elem = createElement(`
      <div class="ribbon">
        <button class="ribbon__arrow ribbon__arrow_left ribbon__arrow_visible">
          <img src="/assets/images/icons/angle-icon.svg" alt="icon">
        </button>
        <nav class="ribbon__inner"></nav>
        <button class="ribbon__arrow ribbon__arrow_right ribbon__arrow_visible">
          <img src="/assets/images/icons/angle-icon.svg" alt="icon">
        </button>
      </div>`);

    const categoriesContainer = this.elem.querySelector(".ribbon__inner");
    let linksContainer = "";

    this.categories.forEach(({ id, name }) => {
      linksContainer += `<a href="#" class="ribbon__item" data-id="${id}">${name}</a>`;
    });

    categoriesContainer.innerHTML = linksContainer;

    return this.elem;
  }

  initScroll() {
    const categoriesContainer = this.elem.querySelector(".ribbon__inner");
    const buttonLeft = this.elem.querySelector(".ribbon__arrow_left");
    const buttonRight = this.elem.querySelector(".ribbon__arrow_right");

    function offset(step) {
      categoriesContainer.scrollBy(step, 0);
    }

    buttonLeft.addEventListener("click", () => {
      const offsetStep = -350;

      offset(offsetStep);
    });

    buttonRight.addEventListener("click", () => {
      const offsetStep = 350;

      offset(offsetStep);
    });

    categoriesContainer.addEventListener("scroll", hideButton);

    function hideButton() {
      const scrollLeft = categoriesContainer.scrollLeft;
      const scrollWidth = categoriesContainer.scrollWidth;
      const clientWidth = categoriesContainer.clientWidth;
      const arrowVisibleClass = "ribbon__arrow_visible";

      let scrollRight = scrollWidth - scrollLeft - clientWidth;

      if (scrollLeft === 0) {
        buttonLeft.classList.remove(arrowVisibleClass);
        buttonRight.classList.add(arrowVisibleClass);
      } else {
        buttonLeft.classList.add(arrowVisibleClass);
      }
      if (scrollRight < 1) {
        buttonLeft.classList.add(arrowVisibleClass);
        buttonRight.classList.remove(arrowVisibleClass);
      } else {
        buttonRight.classList.add(arrowVisibleClass);
      }
    }
  }

  ribbonSelect() {
    const items = this.elem.querySelectorAll(".ribbon__item");

    items.forEach((item) => {
      item.addEventListener("click", (event) => {
        event.preventDefault();
        const previousActiveItem = this.elem.querySelector(".ribbon__item_active");

        if (previousActiveItem) {
          previousActiveItem.classList.remove("ribbon__item_active");
        }

        item.classList.add("ribbon__item_active");
        this.elem.dispatchEvent(new CustomEvent("ribbon-select", {
          detail: item.dataset.id,
          bubbles: true,
        }));
      });
    });
  }
}
