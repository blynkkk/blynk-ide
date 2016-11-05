'use babel';

import fs from 'fs';
import path from 'path';
import BaseView from '../base-view';
import {withTemplate} from '../utils';

@withTemplate(__dirname)
export default class NewView extends BaseView {

  initialize(serializedState) {
    this.cancelLoginButton = this.element.querySelector('.cancel-login');
    this.cancelImportButton = this.element.querySelector('.cancel-import');
    this.importButton = this.element.querySelector('.import');
    this.loginButton = this.element.querySelector('.login'); //todo atom-text-editor?
    this.passInput = this.element.querySelector('.password');
    this.emailInput = this.element.querySelector('.email');
    this.importForm = this.element.querySelector('.import-form');
    this.loginForm = this.element.querySelector('.login-form');
    this.dashBoardSelect = this.element.querySelector('.dashboards');
    this.directoryInput = this.element.querySelector('.directory-input');
    this.pickDirectoryButton = this.element.querySelector('.pick-directory');

    this.addEventHandlers();

    //todo validate if login is required
    this.setLoadingState(false);
    this.showLogin();
  }

  addEventHandlers() {
    let that = this;

    this.cancelLoginButton.onclick = () => this.handleCancel();
    this.cancelImportButton.onclick = () => this.handleCancel();
    this.importButton.onclick = () => this.handleImport();
    this.loginButton.onclick = () => {
      if (that.validateLogin()) {
        that.handleLogin(that.email, that.pass);
      }
    };
    this.emailInput.onchange = () => {
      that.email = event.target.value;
    };

    this.passInput.onchange = () => {
      that.pass = event.target.value;
    };

    this.dashBoardSelect.onchange = () => {
      that.validateImport();
    };

    this.pickDirectoryButton.onclick = () => {
      atom.pickFolder((selectedPaths) => {
        if (!selectedPaths) {
          return;
        }
        if (selectedPaths.length > 1) {
          atom.notifications.addWarning('Blynk: Multiple directories have been selected', {
            detail: 'Importing more than one project at a time is not allowed.'
          });
        }
        if (fs.statSyncNoException(path.join(selectedPaths[0], 'platformio.ini'))) {//todo what?
          atom.notifications.addWarning('Blynk: Invalid directory', {
            detail: 'Selected directory is already a Blynk project.'
          });
          return;
        }

        this.directoryInput.value = selectedPaths[0];
        this.validateImport();
      });
    };
  }

  validateImport() {
    this.importButton.disabled = !this.getDirectory() || this.getDashBoard() == -1;
  }

  getDirectory() {
    return this.directoryInput.value.toString();
  }

  getDashBoard() {
    return this.dashBoards[this.dashBoardSelect.value];
  }

  validateLogin() {
    if (!this.email) {
      this.emailInput.focus();
      return false;
    }

    if (!this.pass) {
      this.passInput.focus();
      return false;
    }
    return true;
  }

  loginFailed(msg) {
    atom.notifications.addError(`Blynk: ${msg}`);
    this.setLoadingState(false);
    this.emailInput.focus();
  }

  showLogin() {
    this.importForm.style.display = 'none';
    this.loginForm.style.display = 'flex';
  }

  showInitForm(dashBoards) {
    let that = this;
    this.loginForm.style.display = 'none';
    this.importForm.style.display = 'flex';

    this.dashBoardSelect.innerHTML = '';

    let defaultOption = document.createElement('option');
    defaultOption.textContent = 'Select dashboard';
    defaultOption.disabled = true;
    defaultOption.value = -1;
    that.dashBoardSelect.appendChild(defaultOption);

    dashBoards.forEach(function(d) {
      let option = document.createElement('option');
      option.textContent = d.name;
      option.value = d.id;

      if (!that.dashBoards) {
        that.dashBoards = {};
      }
      that.dashBoards[d.id] = d;
      that.dashBoardSelect.appendChild(option);
    });

    this.dashBoardSelect.value = -1;
  }

  setLoadingState(state) {
    this.loginButton.textContent = state ? 'Authorizing...' : 'Authorize';
    this.loginButton.disabled = state;
    this.emailInput.disabled = state;
    this.passInput.isDisabled = state;
  }

  // Returns an object that can be retrieved when package is activated
  serialize() {
  }

  // Tear down any state and detach
  destroy() {
    this.element.remove();
  }

  getElement() {
    return this.element;
  }

}
