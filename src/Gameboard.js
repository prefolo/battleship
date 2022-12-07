import Ship from './ship';

const Gameboard = () => {
	const cell = (coordinates, ship = null) => {
		return {
			coordinates,
			ship,
			state: ship ? 'ship' : 'sea',

			receiveAttack() {
				if (this.isHit()) {
					// pubSub.publish('attackedYetHitCell', this.coordinates);
				}
				if (this.state == 'sea') {
					this.state = 'hit-sea';
					// pubSub.publish('attackedSea', this.coordinates);
				}
				if (this.state == 'ship') {
					this.state = 'hit-ship';
					// pubSub.publish('attackedShip', this.coordinates);
				}
			},

			isHit() {
				return this.state == 'hit-sea' || this.state == 'hit-ship';
			},

			setShip(ship) {
				this.ship = ship;
				this.state = 'ship';
			},
		};
	};

	const map = [
		new Array(10),
		new Array(10),
		new Array(10),
		new Array(10),
		new Array(10),
		new Array(10),
		new Array(10),
		new Array(10),
		new Array(10),
		new Array(10),
	];

	for (let i = 0; i < 10; i++) {
		for (let j = 0; j < 10; j++) {
			map[i][j] = cell([i, j]);
		}
	}

	return {
		map,
		ships: [],

		/*
		  @startCoor - [x:int,y:int]
		  @endCoor - [x:int,y:int]
		*/
		placeShip(length, startCoor, endCoor) {
			// Position not vertical, not horizontal
			if (startCoor[0] != endCoor[0] && startCoor[1] != endCoor[1]) {
				// pubSub.publish('providedWrongShipPlacementCoordinates', {});
				return;
			}

			const ship = Ship(length);

			// startX == endX => vertical position
			if (startCoor[0] == endCoor[0]) {
				for (let i = 0; i < ship.length; i++) {
					this.map[startCoor[0]][startCoor[1] + i].setShip(ship);
				}
			}
			// startY == endY => horizontal position
			else if (startCoor[1] == endCoor[1]) {
				for (let i = 0; i < ship.length; i++) {
					this.map[startCoor[0] + i][startCoor[1]].setShip(ship);
				}
			}

			this.ships.push(ship);
		},

		receiveAttack(x, y) {
			this.map[x][y].receiveAttack();
		},

		allShipsHaveBeenSunk() {
			this.ships.every((ship) => {
				return ship.isSunk();
			});
		},
	};
};

export default Gameboard;
