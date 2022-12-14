import Gameboard from './Gameboard';

const Player = (gameboard, opponentGb, isComputer) => {
	return {
		gameboard,
		opponentGb,
		isComputer,

		attack(x, y) {
			if (this.isComputer) {
				const coordinates = getComputerCoor(this.opponentGb);
				x = coordinates.x;
				y = coordinates.y;
			}

			return this.opponentGb.receiveAttack(x, y);
		},
	};
};

const getComputerCoor = (opponentGb) => {
	let x = Math.floor(Math.random() * (9 + 1));
	let y = Math.floor(Math.random() * (9 + 1));

	while (opponentGb.map[x][y].isHit()) {
		x = Math.floor(Math.random() * (9 + 1));
		y = Math.floor(Math.random() * (9 + 1));
	}

	return { x, y };
};

export default Player;
