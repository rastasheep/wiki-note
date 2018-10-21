import { LitElement, html } from '@polymer/lit-element';

class NavElement extends LitElement {
  constructor() {
    super();
    this.history = [];
  }

  static get properties() {
    return {
      history: Array,
    };
  }

  render() {
    const backEnabled = this.history && this.history.length > 1;
    const backDest = backEnabled ? this.history[1] : '';
    const backClass = backEnabled ? '' : 'nav__item--disabled';
    return html`
      <style>
        :host {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          height: 48px;
          display: flex;
          min-width: 320px;
          align-items: center;
          border-bottom: 1px solid rgb(238, 238, 238);
          color: rgb(140, 140, 140);
          user-select: none;
          background-color: #fff;
          z-index: 1;
        }

        .nav__primary {
          overflow: hidden;
          min-width: 0px;
          flex-grow: 1;
          flex-shrink: 1;
          align-items: center;
          -webkit-box-align: center;
          display: flex;
        }
        .nav__secondary {
          align-items: center;
          -webkit-box-align: center;
          display: flex
        }

        .nav__item {
          width: 48px;
          flex-shrink: 0;
          justify-content: center;
          align-items: center;
          display: flex;
          height: 48px;
          color: rgb(85, 85, 85);
        }

        .nav__item--disabled {
          pointer-events: none;
          opacity: .5;
        }
      </style>

      <div class="nav__primary">
        <a href="#" class="nav__item">
          <svg viewBox="0 0 32 32" width="18" height="18" fill="none" stroke="currentcolor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.6">
              <path d="M12 20 L12 30 4 30 4 12 16 2 28 12 28 30 20 30 20 20 Z"></path>
          </svg>
        </a>
        <a href="#index" class="nav__item">
          <svg viewBox="0 0 32 32" width="18" height="18" fill="none" stroke="currentcolor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.6">
              <path d="M6 2 L26 2 26 30 16 20 6 30 Z"></path>
          </svg>
        </a>
      </div>
      <div class="nav__secondary">
        <a href="${backDest}" class="nav__item ${backClass}">
          <svg viewBox="0 0 32 32" width="18" height="18" fill="none" stroke="currentcolor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.6">
              <path d="M10 6 L3 14 10 22 M3 14 L18 14 C26 14 30 18 30 26"></path>
          </svg>
        </a>
        <a class="nav__item nav__item--disabled">
          <svg viewBox="0 0 32 32" width="18" height="18" fill="none" stroke="currentcolor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.6">
              <path d="M16 2 L20 12 30 12 22 19 25 30 16 23 7 30 10 19 2 12 12 12 Z"></path>
          </svg>
        </a>
        <a class="nav__item nav__item--disabled">
          <svg viewBox="0 0 32 32" width="18" height="18" fill="none" stroke="currentcolor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.6">
              <path d="M13 2 L13 6 11 7 8 4 4 8 7 11 6 13 2 13 2 19 6 19 7 21 4 24 8 28 11 25 13 26 13 30 19 30 19 26 21 25 24 28 28 24 25 21 26 19 30 19 30 13 26 13 25 11 28 8 24 4 21 7 19 6 19 2 Z"></path>
              <circle cx="16" cy="16" r="4"></circle>
          </svg>
        </a>
      </div>
    `;
  }
}

export default NavElement;
