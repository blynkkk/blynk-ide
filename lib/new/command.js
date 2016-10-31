'use babel';

import NewView from './view';
import {getPioDashBoard} from '../pio';
import {spawnPlatformIOCommand} from '../utils';

export function command() {
  let view = new NewView();
  var panel = atom.workspace.addModalPanel({item: view.getElement()});

  view.handleCancel = () => {
    return (panel.isVisible() ? panel.hide() : panel.show());
  };

  view.handleImport = () => {
    const dashBoard = view.getDashBoard();
    const directory = view.getDirectory();

    spawnPlatformIOCommand("blynk", ["init", "—-project-dir", directory, "—-board", getPioDashBoard(dashBoard.boardType)])
  };

  view.handleLogin = (email, pass) => {
    let req = new XMLHttpRequest();
    req.addEventListener("load", function () {
      if (req.readyState === XMLHttpRequest.DONE) {
        if (req.status === 200) {
          var response = JSON.parse(req.responseText);
          if (response.pass != pass) {//todo
            view.showInitForm(response.profile.dashBoards);
          } else {
            view.loginFailed("Failed to login, check your email and password");
          }
        } else {
          view.loginFailed("Login failed");
        }
      }
    });
    //mock blynk service
    req.open("GET", `http://127.0.0.1:4400/admin/users/${email}-Blynk`);
    req.send();
  };
}
