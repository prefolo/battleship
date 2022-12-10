import PubSub from 'pubsub-js';
import Ship from './ship';

const cell = (coordinates, ship = null) => {
	return {
		coordinates,
		ship,
		state: ship ? 'ship' : 'sea',

		receiveAttack() {
			// console.log(this.coordinates);
			if (this.isHit()) {
				PubSub.publish('Tried Attack Yet Hit Cell', this.coordinates);

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

const Gameboard = (isComputer = false) => {
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
		  @startCoor - [y:int,x:int]
		  @endCoor - [y:int,x:int]
		*/
		checkPlacement(length, startCoor, endCoor) {
			// Ship overflows the gamaboard
			if (startCoor.concat(endCoor).some((coor) => coor < 0)) {
				return false;
			}

			if (startCoor.concat(endCoor).some((coor) => coor > 9)) {
				return false;
			}

			// Ship is not vertical, nor horizontal
			if (startCoor[0] != endCoor[0] && startCoor[1] != endCoor[1]) {
				return false;
			}

			let adjacentCoor = [];

			// Ship is horizontal, check if overlaps other ships
			if (startCoor[0] == endCoor[0]) {
				for (let i = 0; i < length; i++) {
					if (
						this.map[startCoor[0]][startCoor[1] + i].state == 'ship'
					)
						return false;

					adjacentCoor.push([startCoor[0] - 1, startCoor[1] + i]);
					adjacentCoor.push([startCoor[0] + 1, startCoor[1] + i]);
				}
			}
			// Ship is vertical, check if overlaps other ships
			else if (startCoor[1] == endCoor[1]) {
				for (let i = 0; i < length; i++) {
					if (
						this.map[startCoor[0] + i][startCoor[1]].state == 'ship'
					)
						return false;

					adjacentCoor.push([startCoor[0] + i, startCoor[1] - 1]);
					adjacentCoor.push([startCoor[0] + i, startCoor[1] + 1]);
				}
			}

			// Complete add adjacent cell coordinates to [adjacentCoor]

			// Ship is horizontal, add 3 left and 3 right cell
			if (startCoor[0] == endCoor[0]) {
				const leftX = startCoor[1] - 1;
				const startY = startCoor[0] - 1;

				adjacentCoor = adjacentCoor.concat([
					[startY, leftX],
					[startY + 1, leftX],
					[startY + 2, leftX],
					[startY, leftX + length + 1],
					[startY + 1, leftX + length + 1],
					[startY + 2, leftX + length + 1],
				]);
			}

			// Ship is vertical, add 3 top and 3 bottom cell
			if (startCoor[1] == endCoor[1]) {
				const topY = startCoor[0] - 1;
				const startX = startCoor[1] - 1;

				adjacentCoor = adjacentCoor.concat([
					[topY, startX],
					[topY, startX + 1],
					[topY, startX + 2],
					[topY + length + 1, startX],
					[topY + length + 1, startX + 1],
					[topY + length + 1, startX + 2],
				]);
			}

			// Remove adjacent cells overflowing the gameboard
			adjacentCoor = adjacentCoor.filter(
				(coor) =>
					coor[0] > -1 && coor[1] > -1 && coor[0] < 10 && coor[1] < 10
			);

			if (
				adjacentCoor.some(
					(coor) => this.map[coor[0]][coor[1]].state == 'ship'
				)
			)
				return false;

			return true;
		},

		/*
		  @startCoor - [y:int,x:int]
		  @endCoor - [y:int,x:int]
		*/
		placeShip(length, startCoor, endCoor) {
			const isPlacementLegal = this.checkPlacement(
				length,
				startCoor,
				endCoor
			);

			if (!isPlacementLegal) {
				PubSub.publish('Illegal ship placement', {
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

					if (!this.isComputer) {
						cell.ondrop = droppedOnCell;
						cell.ondragover = draggedOverCell;
					}

					cell.gameboard = gb;

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

const droppedOnCell = (ev) => {
	ev.preventDefault();

	const data = JSON.parse(ev.dataTransfer.getData('text'));
	const cell = ev.target;
	const cellCoor = cell.dataset.coor.split(',');

	if (data.direction == 'v') {
		const x = cellCoor[1] * 1;
		const startY = cellCoor[0] * 1 - data.grabbedBlockIndex * 1;
		const endY = startY + data.length * 1 - 1;

		cell.gameboard.placeShip(data.length * 1, [startY, x], [endY, x]);
	}

	if (data.direction == 'h') {
		const y = cellCoor[0] * 1;
		const startX = cellCoor[1] * 1 - data.grabbedBlockIndex * 1;
		const endX = startX + data.length * 1 - 1;

		cell.gameboard.placeShip(data.length * 1, [y, startX], [y, endX]);
	}
};

const draggedOverCell = (ev) => {
	ev.preventDefault();
};

export default Gameboard;
