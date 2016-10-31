'use babel';

import {command as newProject} from './new/command';
import {command as home} from './home/command';
import HomeView from './home/view';
import AboutView from './about/view';
import {CompositeDisposable} from 'atom';
import shell from 'shell';

export default {

  subscriptions: null,

  activate(state) {
    debugger;
    // Events subscribed to in atom's system can be easily cleaned up with a CompositeDisposable
    this.subscriptions = new CompositeDisposable();

    this.setupCommands();
    home();
  },

  setupCommands() {
    // Register command that toggles this view
    this.subscriptions.add(atom.commands.add('atom-workspace', {
      'blynk-ide:new': () => newProject(),
      'blynk-ide:home': () => atom.workspace.open('blynk://home'),
      'blynk-ide:documentation': () => shell.openExternal('http://docs.blynk.cc/'),
      'blynk-ide:help-twitter': () => shell.openExternal('https://twitter.com/blynk_app'),
      'blynk-ide:help-facebook': () => shell.openExternal('https://www.facebook.com/blynkapp/'),
      'blynk-ide:help-website': () => shell.openExternal('http://www.blynk.cc/'),
      'blynk-ide:help-about': () => atom.workspace.open('blynk://about'),
    }));

    this.subscriptions.add(atom.workspace.addOpener((uriToOpen) => {
      if ('blynk://about' === uriToOpen) {
        return new AboutView(uriToOpen);
      } else if ('blynk://home' === uriToOpen) {
        return new HomeView(uriToOpen);
      }
    }));
  },

  deactivate() {
    this.subscriptions.dispose();
  },

  serialize() {
  },

};
