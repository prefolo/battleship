import Gameboard from './Gameboard';
import Player from './Player';
import PubSub from 'pubsub-js';
import Placeboard from './Placement/Placeboard';
import Dock from './Placement/Dock';
import { randomPlaceShips } from './Placement/PlacementUtils';

let isGameOver = true;
let playerGb;
let computerGb;

const doCpuboardClickable = (player, computer) => {
	document
		.querySelector('#cpuboard-bx')
		.addEventListener('click', function (ev) {
			if (isGameOver) return;

			const coor = ev.target.dataset.coor.split(',');

			const thisCellIsYetHit = player.attack(coor[0], coor[1]);
			if (thisCellIsYetHit) return;

			if (computer.gameboard.allShipsHaveBeenSunk()) {
				isGameOver = true;
				PubSub.publish('Player won', {});
				document.querySelector('#playagainBtn').style.display =
					'inline';
				return;
			}

			computer.attack();

			if (player.gameboard.allShipsHaveBeenSunk()) {
				isGameOver = true;
				PubSub.publish('Computer won', {});
				document.querySelector('#playagainBtn').style.display =
					'inline';
				return;
			}
		});
};

const doResetButtonClickable = () => {
	document.querySelector('#resetBtn').addEventListener('click', () => {
		Dock().reset();
		Placeboard().reset();

		document.querySelector('#startBtn').disabled = true;
	});
};

const doStartButtonClickable = () => {
	document.querySelector('#startBtn').addEventListener('click', () => {
		Placeboard().setOwnShipPlacementsOnOtherGb(playerGb);
		randomPlaceShips(computerGb);

		Dock().reset();
		Placeboard().reset();
		document.querySelector('#startBtn').disabled = true;

		document.querySelector('#placement-screen').style.display = 'none';
		document.querySelector('#game-screen').style.display = 'block';

		isGameOver = false;
	});
};

const doRandomButtonClickable = () => {
	document.querySelector('#randomBtn').addEventListener('click', () => {
		Dock().disable();
		Placeboard().reset();
		randomPlaceShips(Placeboard());

		document.querySelector('#startBtn').disabled = false;
	});
};

const doPlayagainButtonClickable = () => {
	document.querySelector('#playagainBtn').addEventListener('click', () => {
		playerGb.reset();
		computerGb.reset();
		document.querySelector('#playagainBtn').style.display = 'none';

		document.querySelector('#placement-screen').style.display = 'block';
		document.querySelector('#game-screen').style.display = 'none';
	});
};

const Game = () => {
	// placement screen
	Placeboard().render('pboard-bx');
	Dock().render('dock-bx');

	// game screen
	playerGb = Gameboard();
	computerGb = Gameboard(true);

	playerGb.render('playerboard-bx');
	computerGb.render('cpuboard-bx');

	const player = Player(playerGb, computerGb);
	const computer = Player(computerGb, playerGb, 1);

	// events
	doResetButtonClickable();
	doStartButtonClickable();
	doRandomButtonClickable();

	doCpuboardClickable(player, computer);
	doPlayagainButtonClickable();
};

export default Game;
