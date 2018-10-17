import Link from 'quill/formats/link';

class CustomLink extends Link {
  static sanitize(url) {
    return url;
  }

  static create(value) {
    const node = super.create(value);
    if (value.startsWith('#')) {
      node.removeAttribute('target');
    }
    return node;
  }
}

export default CustomLink;
