import Dock from './Dock';
import ShipInPboard from './ShipInPboard';
import {
	newMap,
	checkPlace_returnStoredShipInMap,
	getEndBlockCoor,
} from './PlacementUtils';

// Singleton Pattern
let SingletonPboard = null;

const Placeboard = () => {
	if (SingletonPboard) return SingletonPboard;

	SingletonPboard = {
		ships: {},
		map: newMap(),
		isPlaceboard: true,

		render(htmlContainerID) {
			const container = document.querySelector(`#${htmlContainerID}`);
			container.innerHTML = '';

			this.htmlContainerID = container.id;

			const frame = document.createElement('div');
			frame.style = 'position:relative;';
			frame.id = 'placeboard';

			frame.ondrop = drop_handler;
			frame.ondragover = dragover_handler;

			for (let i = 0; i < 10; i++) {
				const row = document.createElement('div');

				for (let j = 0; j < 10; j++) {
					const cell = document.createElement('div');

					cell.className = 'cell pboardCell';
					cell.dataset.coor = `${j},${i}`;

					row.appendChild(cell);
				}

				frame.appendChild(row);
			}

			container.appendChild(frame);
		},

		reset() {
			this.map = newMap();
			this.ships = {};
			this.render(this.htmlContainerID);
		},

		setOwnShipPlacementsOnOtherGb(gb) {
			for (const key in this.ships) {
				const ship = this.ships[key];
				const coor = ship.coor;
				gb.placeShip(ship.length, coor.startCoor, coor.endCoor);
			}
		},

		drawShip(ship) {
			const startCoor = ship.coor.startCoor;
			const endCoor = ship.coor.endCoor;
			const length = ship.length;
			const direction = startCoor[0] == endCoor[0] ? 'h' : 'v';

			// 1. Render in DOM #placeboard
			const shipHTMLid = ShipInPboard(length).render(
				'placeboard',
				startCoor[1] * 26,
				startCoor[0] * 26
			);

			if (direction == 'v')
				document.querySelector('#' + shipHTMLid).style.display =
					'block';

			// 2. Set dataset.coor to blocks of DOM ship
			setDatasetCoor(shipHTMLid, startCoor, direction);

			// 3. Link shipInPboard.id -> ship
			this.ships[shipHTMLid] = ship;

			// 4. on double click on ship -> rotate ship
			document
				.querySelector('#' + shipHTMLid)
				.addEventListener('dblclick', rotateShip);
		},
	};

	return SingletonPboard;
};

const dragover_handler = (ev) => {
	ev.preventDefault();
};

const drop_handler = (ev) => {
	ev.preventDefault();

	let {
		length,
		direction,
		grabbedBlockIndex,
		isShipInDock,
		isShipInPboard,
		id,
	} = JSON.parse(ev.dataTransfer.getData('text'));

	length *= 1;
	grabbedBlockIndex *= 1;

	if (isShipInDock) {
		// 1. store in grid map
		const firstBlockCoor = getFirstBlockCoor(
			ev.target,
			grabbedBlockIndex,
			direction
		);

		const shipPlacedInMap = checkPlace_returnStoredShipInMap(
			SingletonPboard,
			length,
			firstBlockCoor,
			getEndBlockCoor(length, firstBlockCoor, direction)
		);

		if (!shipPlacedInMap) return;

		SingletonPboard.drawShip(shipPlacedInMap);

		// Decrement the ship count in the dock
		const allShipsAreInPboard = Dock().decrementShipCount(length);

		if (allShipsAreInPboard)
			document.querySelector('#startBtn').disabled = false;
	}

	if (isShipInPboard) {
		const ship = SingletonPboard.ships[id];
		const oldCoor = ship.coor;

		removeShipFromMap(ship);

		// store new placement
		const firstBlockCoor = getFirstBlockCoor(
			ev.target,
			grabbedBlockIndex,
			direction
		);

		const shipPlacedInMap = checkPlace_returnStoredShipInMap(
			SingletonPboard,
			length,
			firstBlockCoor,
			getEndBlockCoor(length, firstBlockCoor, direction),
			ship
		);

		// if new placement is wrong -> restore old placement and return
		if (!shipPlacedInMap) {
			checkPlace_returnStoredShipInMap(
				SingletonPboard,
				length,
				oldCoor.startCoor,
				oldCoor.endCoor,
				ship
			);
			return;
		}

		// if new placement is ok -> set new position of the ship in the grid DOM

		const shipFrame = document.querySelector('#' + id);

		shipFrame.style.left = firstBlockCoor[1] * 26 + 'px';
		shipFrame.style.top = firstBlockCoor[0] * 26 + 'px';

		// Set dataset.coor to blocks of DOM ship
		setDatasetCoor(id, firstBlockCoor, direction);
	}
};

function rotateShip() {
	const ship = SingletonPboard.ships[this.id];
	const oldCoor = ship.coor;
	const grabbedBlockIndex = 0;
	const length = ship.length;
	const newDirection = this.style.display == 'block' ? 'h' : 'v';

	removeShipFromMap(ship);

	// store new placement
	const firstBlockCoor = oldCoor.startCoor;

	const shipPlacedInMap = checkPlace_returnStoredShipInMap(
		SingletonPboard,
		length,
		firstBlockCoor,
		getEndBlockCoor(length, firstBlockCoor, newDirection),
		ship
	);

	// if new placement is wrong -> restore old placement and return
	if (!shipPlacedInMap) {
		checkPlace_returnStoredShipInMap(
			SingletonPboard,
			length,
			oldCoor.startCoor,
			oldCoor.endCoor,
			ship
		);
		return;
	}

	// if new placement is ok -> set new ndirection of the ship in the grid DOM

	this.style.display = newDirection == 'h' ? 'flex' : 'block';

	// Set dataset.coor to blocks of DOM ship
	setDatasetCoor(this.id, firstBlockCoor, newDirection);
}

const setDatasetCoor = (id, startCoor, direction) => {
	Array.from(document.querySelector('#' + id).children).forEach(
		(block, index) => {
			if (direction == 'h')
				block.dataset.coor = `${startCoor[0]},${startCoor[1] + index}`;
			else block.dataset.coor = `${startCoor[0] + index},${startCoor[1]}`;
		}
	);
};

const getFirstBlockCoor = (cellRecevingDrop, grabbedBlockIndex, direction) => {
	const coor = cellRecevingDrop.dataset.coor.split(',');
	coor[0] *= 1;
	coor[1] *= 1;

	if (direction == 'h') coor[1] = coor[1] - grabbedBlockIndex;
	else coor[0] = coor[0] - grabbedBlockIndex;

	return coor;
};

const removeShipFromMap = (ship) => {
	for (let i = 0; i < 10; i++) {
		for (let j = 0; j < 10; j++) {
			SingletonPboard.map[i][j].removeShip(ship);
		}
	}
};

export default Placeboard;
