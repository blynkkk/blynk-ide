'use babel';

import BaseView from '../base-view';
import {CompositeDisposable} from 'atom';
import {withTemplate} from '../utils';


@withTemplate(__dirname)
export default class AboutView extends BaseView {

  initialize(uri) {
  }

  getTitle() {
    return 'About';
  }

  getIconName() {
    return 'info';
  }

  getURI() {
    return this.uri;
  }

  destroy() {
    super.destroy();
  }
}