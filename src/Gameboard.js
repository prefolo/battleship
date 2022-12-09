import PubSub from 'pubsub-js';
import Ship from './ship';

const Gameboard = (isComputer = false) => {
	const cell = (coordinates, ship = null) => {
		return {
			coordinates,
			ship,
			state: ship ? 'ship' : 'sea',

			receiveAttack() {
				// console.log(this.coordinates);
				if (this.isHit()) {
					PubSub.publish(
						'Tried Attack Yet Hit Cell',
						this.coordinates
					);

					return true;
				}
				if (this.state == 'sea') {
					this.state = 'hit-sea';
					PubSub.publish('Attacked Sea', {
						coordinates: this.coordinates,
						gameboard: this.gameboard,
					});
				}
				if (this.state == 'ship') {
					this.state = 'hit-ship';
					this.ship.hit();

					PubSub.publish('Attacked Ship', {
						coordinates: this.coordinates,
						gameboard: this.gameboard,
					});
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

	const gb = {
		isComputer,
		map,
		ships: [],

		/*
		  @startCoor - [x:int,y:int]
		  @endCoor - [x:int,y:int]
		*/
		placeShip(length, startCoor, endCoor) {
			// Position not vertical, not horizontal
			if (startCoor[0] != endCoor[0] && startCoor[1] != endCoor[1]) {
				PubSub.publish('Provided Wrong Ship Placement Coordinates', {
					startCoor,
					endCoor,
				});
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

			PubSub.publish('Placed Ship', {
				startCoor,
				endCoor,
				map: this.map,
			});
		},

		receiveAttack(x, y) {
			return this.map[x][y].receiveAttack();
		},

		allShipsHaveBeenSunk() {
			return this.ships.every((ship) => {
				return ship.isSunk();
			});
		},

		render(htmlContainerID) {
			const container = document.querySelector(`#${htmlContainerID}`);
			container.innerHTML = '';

			const cellClass = this.isComputer ? 'cmp-cell' : 'cell';

			for (let i = 0; i < 10; i++) {
				const row = document.createElement('div');

				for (let j = 0; j < 10; j++) {
					const cell = document.createElement('div');
					cell.className = cellClass;
					cell.id = `${cellClass}${i}-${j}`;
					cell.dataset.coor = `${i},${j}`;

					row.appendChild(cell);
				}

				container.appendChild(row);
			}
		},
	};

	for (let i = 0; i < 10; i++) {
		for (let j = 0; j < 10; j++) {
			map[i][j].gameboard = gb;
		}
	}

	return gb;
};

export default Gameboard;
