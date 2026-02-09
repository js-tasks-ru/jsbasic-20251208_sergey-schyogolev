export default class StepSlider {
  constructor({ steps, value = 0 }) {
    this.steps = steps;
    this.value = value;
    this.render();
  }

  render() {
    this.elem = document.createElement('DIV');
    this.elem.classList.add("slider");
    this.elem.innerHTML = `
      <div class="slider__thumb">
        <span class="slider__value">${this.value}</span>
      </div>
      <div class="slider__progress"></div>
      <div class="slider__steps"></div>`;

    this.thumb = this.elem.querySelector(".slider__thumb");
    this.progress = this.elem.querySelector(".slider__progress");
    this.stepsContainer = this.elem.querySelector(".slider__steps");
    this.sections = this.steps - 1;
    
    for (let i = 0; i < this.steps; i++) {
      let step = document.createElement('SPAN');
      if (i === this.value) {
        step.classList.add("slider__step-active");
      }
      this.stepsContainer.append(step);
    }

    this.onClick();
    this.dragNDrop();

    return this.elem;
  }
  
  onClick() {
    this.elem.addEventListener("click", (event) => {
      const left = event.clientX - this.elem.getBoundingClientRect().left;
      const leftRelative = left / this.elem.offsetWidth;
      const approximateValue = leftRelative * this.sections;
      const value = Math.round(approximateValue);
      const valuePercents = value / this.sections * 100;

      this.value = value;
      this.elem.querySelector(".slider__value").textContent = value;
      
      const allSteps = this.stepsContainer.querySelectorAll('span');
      const previousActive = this.stepsContainer.querySelector(".slider__step-active");
      
      previousActive.classList.remove("slider__step-active");
      allSteps[value].classList.add("slider__step-active");
      
      this.thumb.style.left = `${valuePercents}%`;
      this.progress.style.width = `${valuePercents}%`;

      this.elem.dispatchEvent(new CustomEvent("slider-change", {
        detail: this.value,
        bubbles: true,
      }));
    });
  }

  dragNDrop() {
    this.thumb.ondragstart = () => false;
    
    const onPointerMove = (event) => {
      event.preventDefault();
      this.elem.classList.add('slider_dragging');
      
      const left = event.clientX - this.elem.getBoundingClientRect().left;
      let leftRelative = left / this.elem.offsetWidth;
      
      if (leftRelative < 0) {
        leftRelative = 0;
      }

      if (leftRelative > 1) {
        leftRelative = 1;
      }

      const approximateValue = leftRelative * this.sections;
      const value = Math.round(approximateValue);
      
      this.value = value;
      this.elem.querySelector(".slider__value").textContent = value;

      const allSteps = this.stepsContainer.querySelectorAll('span');
      const previousActive = this.stepsContainer.querySelector(".slider__step-active");
      
      previousActive.classList.remove("slider__step-active");
      allSteps[value].classList.add("slider__step-active");

      const leftPercents = leftRelative * 100;

      this.thumb.style.left = `${leftPercents}%`;
      this.progress.style.width = `${leftPercents}%`;

    };

    const onPointerUp = () => {
      document.removeEventListener('pointermove', onPointerMove);
      document.removeEventListener('pointerup', onPointerUp);
      
      this.elem.classList.remove('slider_dragging');
      this.elem.dispatchEvent(new CustomEvent("slider-change", {
        detail: this.value,
        bubbles: true,
      }));
    };

    this.thumb.addEventListener('pointerdown', () => {
      document.addEventListener('pointermove', onPointerMove);
      document.addEventListener('pointerup', onPointerUp);
    });
  }
}
