import Gameboard from './Gameboard';
import Player from './Player';
import PubSub from 'pubsub-js';
import Placeboard from './Placement/Placeboard';
import Dock from './Placement/Dock';
import { randomPlaceShips } from './Placement/PlacementUtils';

/* const makeCpuGameboardClickable = (player, computer) => {
	document.querySelectorAll('.cpuCell').forEach((cell) => {
		cell.addEventListener('click', function () {
			const coor = this.dataset.coor.split(',');

			const thisCellIsYetHit = player.attack(coor[0], coor[1]);
			if (thisCellIsYetHit) return;

			if (computer.gameboard.allShipsHaveBeenSunk()) {
				PubSub.publish('Player won', {});
				return;
			}

			computer.attack();

			if (player.gameboard.allShipsHaveBeenSunk()) {
				PubSub.publish('Computer won', {});
				document.querySelector('#playagainBtn').style.display = 'block';
				return;
			}
		});
	});
}; */

const makeCpuGameboardClickable = (player, computer) => {
	document
		.querySelector('#cpuboard-bx')
		.addEventListener('click', function (ev) {
			const coor = ev.target.dataset.coor.split(',');

			const thisCellIsYetHit = player.attack(coor[0], coor[1]);
			if (thisCellIsYetHit) return;

			if (computer.gameboard.allShipsHaveBeenSunk()) {
				PubSub.publish('Player won', {});
				return;
			}

			computer.attack();

			if (player.gameboard.allShipsHaveBeenSunk()) {
				PubSub.publish('Computer won', {});
				document.querySelector('#playagainBtn').style.display = 'block';
				return;
			}
		});
};

const addEventListenerToResetButton = () => {
	document.querySelector('#resetBtn').addEventListener('click', () => {
		Dock().reset();
		Placeboard().reset();

		document.querySelector('#startBtn').disabled = true;
	});
};

const addEventListenerToStartButton = (gb) => {
	document.querySelector('#startBtn').addEventListener('click', () => {
		Placeboard().setOwnShipPlacementsOnOtherGb(gb);
		Dock().reset();
		Placeboard().reset();

		document.querySelector('#startBtn').disabled = true;

		document.querySelector('#placement-screen').style.display = 'none';
		document.querySelector('#game-screen').style.display = 'block';
	});
};

const addEventListenerToRandomButton = () => {
	document.querySelector('#randomBtn').addEventListener('click', () => {
		Placeboard().reset();
		randomPlaceShips(Placeboard());
		Dock().disable();

		document.querySelector('#startBtn').disabled = false;
	});
};

const Game = () => {
	Placeboard().render('pboard-bx');
	Dock().render('dock-bx');

	addEventListenerToResetButton();

	//-----------------------------

	const playerGb = Gameboard();
	const computerGb = Gameboard(true);

	playerGb.render('playerboard-bx');
	computerGb.render('cpuboard-bx');

	const player = Player(playerGb, computerGb);
	const computer = Player(computerGb, playerGb, 1);

	addEventListenerToStartButton(playerGb);
	addEventListenerToRandomButton();

	randomPlaceShips(computerGb);

	makeCpuGameboardClickable(player, computer);
};

export default Game;
