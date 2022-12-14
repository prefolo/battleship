import ShipInDock from './ShipInDock';
import ShipInPboard from './ShipInPboard';
import Cell from '../Cell';
import Ship from '../Ship';

let placeboard = null;

const Placeboard = () => {
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
			map[i][j] = Cell([i, j]);
		}
	}

	const thisPlaceboard = {
		ships: {},
		map,

		render(htmlContainerID) {
			const container = document.querySelector(`#${htmlContainerID}`);
			container.innerHTML = '';

			const frame = document.createElement('div');
			frame.style =
				'position:relative;border:1px solid #000;width:260px;height:260px';
			frame.id = 'placeboard';

			frame.ondrop = drop_handler;
			frame.ondragover = dragover_handler;

			for (let i = 0; i < 10; i++) {
				const row = document.createElement('div');

				for (let j = 0; j < 10; j++) {
					const cell = document.createElement('div');

					cell.className = 'cell';
					cell.dataset.coor = `${j},${i}`;

					row.appendChild(cell);
				}

				frame.appendChild(row);
			}

			container.appendChild(frame);
		},

		getShipPlacements() {},
	};

	placeboard = thisPlaceboard;
	return thisPlaceboard;
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

		const shipSucessfullyStored = storePlacementInMap(
			length,
			firstBlockCoor,
			getEndBlockCoor(length, firstBlockCoor, direction)
		);

		if (!shipSucessfullyStored) return;

		// 2. render in DOM #placeboard
		const shipHTMLid = ShipInPboard(length).render(
			'placeboard',
			firstBlockCoor[1] * 26,
			firstBlockCoor[0] * 26
		);

		// 3. Set dataset.coor to blocks of DOM ship
		setDatasetCoor(shipHTMLid, firstBlockCoor, direction);

		// 4. link shipInPboard.id -> ship
		placeboard.ships[shipHTMLid] = shipSucessfullyStored;
	}

	if (isShipInPboard) {
		const ship = placeboard.ships[id];
		const oldCoor = ship.coor;

		removeShipFromMap(ship);

		// store new placement
		const firstBlockCoor = getFirstBlockCoor(
			ev.target,
			grabbedBlockIndex,
			direction
		);

		const shipSucessfullyStored = storePlacementInMap(
			length,
			firstBlockCoor,
			getEndBlockCoor(length, firstBlockCoor, direction),
			ship
		);

		// if new placement is wrong -> restore old placement and return
		if (!shipSucessfullyStored) {
			storePlacementInMap(
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

const getEndBlockCoor = (length, firstBlockCoor, direction) => {
	let [y, x] = firstBlockCoor;

	return direction == 'h' ? [y, x + length - 1] : [y + length - 1, x];
};

/*
  @startCoor - [y:int,x:int]
  @endCoor - [y:int,x:int]
*/
const checkPlacement = (length, startCoor, endCoor) => {
	// Ship overflows the gamaboard -> return false
	if (startCoor.concat(endCoor).some((coor) => coor < 0)) return false;
	if (startCoor.concat(endCoor).some((coor) => coor > 9)) return false;

	let adjacentCoor = [];

	// Ship is horizontal, check if overlaps other ships
	if (startCoor[0] == endCoor[0]) {
		for (let i = 0; i < length; i++) {
			if (placeboard.map[startCoor[0]][startCoor[1] + i].state == 'ship')
				return false;

			adjacentCoor.push([startCoor[0] - 1, startCoor[1] + i]);
			adjacentCoor.push([startCoor[0] + 1, startCoor[1] + i]);
		}
	}
	// Ship is vertical, check if overlaps other ships
	else if (startCoor[1] == endCoor[1]) {
		for (let i = 0; i < length; i++) {
			if (placeboard.map[startCoor[0] + i][startCoor[1]].state == 'ship')
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
		(coor) => coor[0] > -1 && coor[1] > -1 && coor[0] < 10 && coor[1] < 10
	);

	if (
		adjacentCoor.some(
			(coor) => placeboard.map[coor[0]][coor[1]].state == 'ship'
		)
	)
		return false;

	return true;
};

/*
  @startCoor - [y:int,x:int]
  @endCoor - [y:int,x:int]
*/
const storePlacementInMap = (length, startCoor, endCoor, ship) => {
	const isPlacementLegal = checkPlacement(length, startCoor, endCoor);

	if (!isPlacementLegal) {
		return false;
	}

	if (!ship) ship = Ship(length);

	// startX == endX => vertical position
	if (startCoor[0] == endCoor[0]) {
		for (let i = 0; i < ship.length; i++) {
			placeboard.map[startCoor[0]][startCoor[1] + i].setShip(ship);
		}
	}
	// startY == endY => horizontal position
	else if (startCoor[1] == endCoor[1]) {
		for (let i = 0; i < ship.length; i++) {
			placeboard.map[startCoor[0] + i][startCoor[1]].setShip(ship);
		}
	}

	ship.setCoor(startCoor, endCoor);

	return ship;
};

const removeShipFromMap = (ship) => {
	for (let i = 0; i < 10; i++) {
		for (let j = 0; j < 10; j++) {
			placeboard.map[i][j].removeShip(ship);
		}
	}
};

export default Placeboard;
