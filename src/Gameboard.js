import PubSub from 'pubsub-js';
import Ship from './Ship';
import { newMap } from './Placement/PlacementUtils';

const Gameboard = (isComputer = false) => {
	const gb = {
		isComputer,
		map: newMap(),
		ships: [],

		//  @startCoor - [y:int,x:int]
		//  @endCoor - [y:int,x:int]
		placeShip(length, startCoor, endCoor) {
			const ship = Ship(length);

			// startX == endX => vertical position
			if (startCoor[0] == endCoor[0]) {
				for (let i = 0; i < length; i++) {
					this.map[startCoor[0]][startCoor[1] + i].setShip(ship);
				}
			}
			// startY == endY => horizontal position
			else if (startCoor[1] == endCoor[1]) {
				for (let i = 0; i < length; i++) {
					this.map[startCoor[0] + i][startCoor[1]].setShip(ship);
				}
			}

			this.ships.push(ship);

			PubSub.publish('Placed Ship In Gb', {
				startCoor,
				endCoor,
				gb: gb,
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

			const cellClass = this.isComputer
				? 'cell cpuCell'
				: 'cell playerCell seaCell';

			const id = this.isComputer ? 'cpuCell' : 'playerCell';

			for (let i = 0; i < 10; i++) {
				const row = document.createElement('div');

				for (let j = 0; j < 10; j++) {
					const cell = document.createElement('div');

					cell.className = cellClass;
					cell.id = `${id}${i}-${j}`;
					cell.dataset.coor = `${i},${j}`;

					row.appendChild(cell);
				}

				container.appendChild(row);
			}
		},
	};

	for (let i = 0; i < 10; i++) {
		for (let j = 0; j < 10; j++) {
			gb.map[i][j].gameboard = gb;
		}
	}

	return gb;
};

export default Gameboard;
