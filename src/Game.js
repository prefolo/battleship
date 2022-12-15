import Gameboard from './Gameboard';
import Player from './Player';
import PubSub from 'pubsub-js';
import Placeboard from './Placement/Placeboard';
import Dock from './Placement/Dock';
import { randomPlaceShips } from './Placement/PlacementUtils';

const makeCpuGameboardClickable = (player, computer) => {
	document.querySelectorAll('.cmp-cell').forEach((cell) => {
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
				return;
			}
		});
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

	playerGb.render('gameboard-player-bx');
	computerGb.render('gameboard-cmp-bx');

	const player = Player(playerGb, computerGb);
	const computer = Player(computerGb, playerGb, 1);

	addEventListenerToStartButton(playerGb);
	addEventListenerToRandomButton();

	randomPlaceShips(computerGb);

	makeCpuGameboardClickable(player, computer);
};

export default Game;
