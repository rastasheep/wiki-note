import Module from 'quill/core/module';

class ClickableLinks extends Module {
  constructor(quill, options) {
    super(quill, options);

    this.currentLink;
    quill.container.addEventListener('mouseover', this.onMouseOver.bind(this));
  }

  onMouseOver(event) {
    if (event.target.tagName === 'A') {
      this.currentLink = event.target;
      this.currentLink.setAttribute('contenteditable', false);
    } else if (this.currentLink) {
      this.currentLink.removeAttribute('contenteditable');
      this.currentLink = null;
    }
  }
}

export default ClickableLinks;
