'use babel';

export const dashBoards = {
  "Arduino UNO": "uno",
  "Arduino Micro": "micro",
  "RedBear Duo": "???"
};

export function getPioDashBoard(blynkType) {
  return dashBoards[blynkType];
}