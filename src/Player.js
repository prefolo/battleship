import Gameboard from './Gameboard';

const Player = (opponentGb = null, isComputer) => {
	return {
		opponentGb,
		isComputer,
		gameboard: Gameboard(),

		attack(x, y) {
			if (this.isComputer) {
				const coordinates = computerCoor(this.opponentGb);
				x = coordinates.x;
				y = coordinates.y;
			}

			this.opponentGb.receiveAttack(x, y);
		},

		setOpponentGameboard(opponentGb) {
			this.opponentGb = opponentGb;
		},
	};
};

const computerCoor = (opponentGb) => {
	let x = Math.floor(Math.random() * (9 + 1));
	let y = Math.floor(Math.random() * (9 + 1));

	while (opponentGb.map[x][y].isHit()) {
		x = Math.floor(Math.random() * (9 + 1));
		y = Math.floor(Math.random() * (9 + 1));
	}

	return { x, y };
};

export default Player;
