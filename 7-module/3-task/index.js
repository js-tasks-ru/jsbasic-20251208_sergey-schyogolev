export default class StepSlider {
  constructor({ steps, value = 0 }) {
    this.steps = steps;
    this.value = value;
    this.render();
    this.onClick();
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

    this.stepsContainer = this.elem.querySelector(".slider__steps");
    
    for (let i = 0; i < this.steps; i++) {
      let step = document.createElement('SPAN');
      if (i === this.value) {
        step.classList.add("slider__step-active");
      }
      this.stepsContainer.append(step);
    }

    return this.elem;
  }
  
  onClick() {
    const sections = this.steps - 1;
    
    this.elem.addEventListener("click", (event) => {
      const left = event.clientX - this.elem.getBoundingClientRect().left;
      const leftRelative = left / this.elem.offsetWidth;
      const approximateValue = leftRelative * sections;
      const value = Math.round(approximateValue);
      const valuePercents = value / sections * 100;

      this.value = value;
      this.elem.querySelector(".slider__value").textContent = value;
      
      const allSteps = this.stepsContainer.querySelectorAll('span');
      const previousActive = this.stepsContainer.querySelector(".slider__step-active");
      
      previousActive.classList.remove("slider__step-active");
      allSteps[value].classList.add("slider__step-active");
      
      const thumb = this.elem.querySelector(".slider__thumb");
      const progress = this.elem.querySelector(".slider__progress");

      thumb.style.left = `${valuePercents}%`;
      progress.style.width = `${valuePercents}%`;

      this.elem.dispatchEvent(new CustomEvent("slider-change", {
        detail: this.value,
        bubbles: true,
      }));
    });
  }
}
