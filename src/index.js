import Gameboard from './Gameboard.js';
import './style.css';

console.log('Start!');

const gb = Gameboard();
gb.placeShip(5, [1, 4], [1, 9]);

console.log(gb.map);
