'use babel';

import fs from 'fs';

export default class BaseView {
  constructor() {
    this.element = this.buildElement();
    this.initialize(...arguments);
  }

  /**
   * Creates an HTML element for a view.
   *
   * Subclasses must either provide a __template attribute (e.g., via
   * @withTemplate decorator) or override this method.
   */
  buildElement() {
    const templateString = fs.readFileSync(this.__template, {encoding: 'utf-8'});
    const parser = new DOMParser();
    const doc = parser.parseFromString(templateString, 'text/html');
    return doc.querySelector('.blynk-ide').cloneNode(true);
  }

  /**
   * Performs an initialization of a view instance.
   */
  initialize() {}

  getElement() {
    return this.element;
  }

  destroy() {
    this.element.remove();
  }
}
