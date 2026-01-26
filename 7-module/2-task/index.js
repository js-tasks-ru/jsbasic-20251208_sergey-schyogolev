import createElement from "../../assets/lib/create-element.js";

export default class Modal {
  constructor() {}

  open() {
    const modal = createElement(`
      <div class="modal">
        <div class="modal__overlay"></div>
        <div class="modal__inner">
          <div class="modal__header">
            <button type="button" class="modal__close">
              <img src="/assets/images/icons/cross-icon.svg" alt="close-icon" />
            </button>
            <h3 class="modal__title"></h3>
          </div>
          <div class="modal__body"></div>
        </div>
      </div>
      `);

    const title = modal.querySelector(".modal__title");
    const modalBody = modal.querySelector(".modal__body");
    title.innerHTML = this.title;
    modalBody.append(this.modalBody);

    document.body.append(modal);
    document.body.classList.add("is-modal-open");
    this.elem = modal;

    const closeButton = this.elem.querySelector(".modal__close");
    closeButton.addEventListener("click", () => {
      this.close();
    });

    this.clickEscape = (event) => {
      if (event.code === "Escape") {
        this.close();
      }
    };

    document.addEventListener("keydown", this.clickEscape);
  }

  setTitle(titleStr) {
    this.title = titleStr;
    if (this.elem) {
      this.elem.querySelector(".modal__title").innerHTML = this.title;
    }
  }

  setBody(node) {
    this.modalBody = node;
    if (this.elem) {
      this.elem.querySelector(".modal__body").append(this.modalBody);
    }
  }

  close() {
    this.elem.remove();
    document.body.classList.remove("is-modal-open");
    document.removeEventListener("keydown", this.clickEscape);
  }
}
