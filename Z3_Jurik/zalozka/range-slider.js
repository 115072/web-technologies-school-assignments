class RangeSlider extends HTMLElement {
  constructor() {
    super();

    this.attachShadow({ mode: "open" });

    this.min = this.getAttribute("minimal") ? this.getAttribute("minimal") : 0;
    this.max = this.getAttribute("maximal") ? this.getAttribute("maximal") : 10;

    this.inputTypeNumber = document.createElement("input");
    this.inputTypeNumber.type = "number";
    this.inputTypeNumber.className = "custom-number";
    this.inputTypeNumber.setAttribute("min", this.min);
    this.inputTypeNumber.setAttribute("max", this.max);

    this.inputTypeRange = document.createElement("input");
    this.inputTypeRange.type = "range";
    this.inputTypeRange.className = "custom-range";
    this.inputTypeRange.setAttribute("min", this.min);
    this.inputTypeRange.setAttribute("max", this.max);

    this.thumbContainer = document.createElement("div");
    this.thumbContainer.className = "thumb-container";

    this.thumb = document.createElement("div");
    this.thumb.className = "thumb";
    this.thumbValue = document.createElement("div");
    this.thumbValue.className = "thumb-value";

    this.container = document.createElement("div");
    this.container.className = "container";

    this.container.appendChild(this.inputTypeRange);
    this.thumb.appendChild(this.thumbValue);
    this.thumbContainer.appendChild(this.thumb);
    this.container.appendChild(this.thumbContainer);
    this.container.appendChild(this.inputTypeNumber);

    const style = document.createElement("style");
    style.innerHTML = `
        .container {
          display: flex;
          flex-direction: column;
          width: 10rem;
          position: relative;
        }

        .thumb-container {
          position: relative;
          width: 100%;
          height: 20px;
          margin-top: -20px;
          pointer-events: none;
        }

        .thumb {
          position: absolute;
          width: 40px;
          height: 20px;
          background-color: #ffffff;
          border-radius: 5px;
          border-style: solid;
          border-color: black;
          border-width: thin;
        }

        .thumb-value {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          color: black;
        }
      `;

    this.shadowRoot.appendChild(this.container);
    this.shadowRoot.appendChild(style);

    // Set initial value display
    this.updateValueDisplay();

    // Attach event listeners
    this.inputTypeRange.addEventListener("input", () =>
      this.updateValueDisplay()
    );
    this.inputTypeNumber.addEventListener("input", () =>
      this.updateSliderFromNumber()
    );

    this.inputTypeNumber.value = this.min;
    this.inputTypeRange.value = this.min;
    this.updateSliderFromNumber();
  }

  updateValueDisplay() {
    const sliderValue = this.inputTypeRange.value;
    this.inputTypeNumber.value = sliderValue;
    this.thumbValue.textContent = sliderValue;
    const thumbPosition = this.calculateThumbPosition();
    this.thumb.style.left = thumbPosition + "px";
  }

  updateSliderFromNumber() {
    const value = parseFloat(this.inputTypeNumber.value);
    if (!isNaN(value) && value >= this.min && value <= this.max) {
      this.inputTypeRange.value = value;
      this.updateValueDisplay();
    }
  }

  calculateThumbPosition() {
    const range = this.max - this.min;
    const ratio = (this.inputTypeRange.value - this.min) / range;
    const containerWidth = this.thumbContainer.clientWidth;
    const thumbWidth = this.thumb.clientWidth;
    return ratio * (containerWidth - thumbWidth);
  }
}

customElements.define("range-slider", RangeSlider);
