import Gameboard from './Gameboard.js';

console.log('Ciao!');

const gb = Gameboard();
gb.placeShip(5, [1, 4], [1, 9]);

console.log(gb.map);
