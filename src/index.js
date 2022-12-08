import Gameboard from './Gameboard.js';
import DOMController from './DOMController.js';
import Game from './Game.js';
import './style.css';

DOMController.suscribe();

const { player, computer, playCpuTurn } = Game();

document.querySelectorAll('.cmp-cell').forEach((cell) => {
	cell.addEventListener('click', function () {
		const coor = this.dataset.coor.split(',');
		player.attack(coor[0], coor[1]);
		playCpuTurn();
	});
});
