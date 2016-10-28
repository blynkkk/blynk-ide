'use babel';

import MainView from './view';
import {CompositeDisposable} from 'atom';

export default {

  view: null,
  modalPanel: null,
  subscriptions: null,

  activate(state) {
    this.view = new MainView(state.blynkIdeViewState);
    //todo validate if login is required
    this.view.showLogin();

    this.modalPanel = atom.workspace.addModalPanel({
      item: this.view.getElement(),
      visible: false
    });

    this.view.handleCancel = () => this.toggle();
    this.view.handleImport = () => this.import();
    this.view.handleLogin = (email, pass) => this.login(email, pass);

    // Events subscribed to in atom's system can be easily cleaned up with a CompositeDisposable
    this.subscriptions = new CompositeDisposable();

    // Register command that toggles this view
    this.subscriptions.add(atom.commands.add('atom-workspace', {
      'blynk-ide:import': () => this.toggle()
    }));
  },

  deactivate() {
    this.modalPanel.destroy();
    this.subscriptions.dispose();
    this.view.destroy();
  },

  serialize() {
    return {
      blynkIdeViewState: this.view.serialize()
    };
  },

  login(email, pass) {
    let req = new XMLHttpRequest();
    let that = this;
    req.addEventListener("load", function () {
      if (req.readyState === XMLHttpRequest.DONE) {
        if (req.status === 200) {
          var response = JSON.parse(req.responseText);
          if (response.pass != pass) {//todo
            that.view.showInitForm(response.profile.dashBoards);
          } else {
            that.view.loginFailed("Failed to login, check your email and password");
          }
        } else {
          that.view.loginFailed("Login failed");
        }
      }
    });
    //mock blynk service
    req.open("GET", `http://127.0.0.1:4400/admin/users/${email}-Blynk`);
    req.send();
  },

  toggle() {
    return (
        this.modalPanel.isVisible() ?
            this.modalPanel.hide() :
            this.modalPanel.show()
    );
  },

  import() {
    console.log("Call platformio api");
  }

};
