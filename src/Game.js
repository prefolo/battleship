import Gameboard from './Gameboard';
import Player from './Player';
import PubSub from 'pubsub-js';

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

const Game = () => {
	const playerGb = Gameboard();
	const computerGb = Gameboard(true);

	playerGb.render('gameboard-player-bx');
	computerGb.render('gameboard-cmp-bx');

	const player = Player(playerGb, computerGb);
	const computer = Player(computerGb, playerGb, 1);

	playerGb.placeShip(2, [0, 0], [0, 1]);
	playerGb.placeShip(3, [0, 3], [2, 3]);
	playerGb.placeShip(4, [0, 6], [0, 9]);
	playerGb.placeShip(4, [2, 0], [5, 0]);
	playerGb.placeShip(3, [2, 5], [2, 7]);

	computerGb.placeShip(2, [0, 0], [0, 1]);
	computerGb.placeShip(3, [0, 3], [2, 3]);
	computerGb.placeShip(4, [0, 6], [0, 9]);
	computerGb.placeShip(4, [2, 0], [5, 0]);
	computerGb.placeShip(3, [2, 5], [2, 7]);

	makeCpuGameboardClickable(player, computer);
};

export default Game;
