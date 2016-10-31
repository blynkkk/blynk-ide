'use babel';

import BaseView from '../base-view';
import {CompositeDisposable} from 'atom';
import {withTemplate} from '../utils';
import {command as newProject} from '../new/command';

@withTemplate(__dirname)
export default class HomeView extends BaseView {

  initialize(uri) {
    this.element.querySelector('.new-project').onclick = () => {
      newProject();
    };
  }

  getTitle() {
    return 'Blynk Home';
  }

  getIconName() {
    return 'home';
  }

  getURI() {
    return this.uri;
  }

  destroy() {
    super.destroy();
  }
}