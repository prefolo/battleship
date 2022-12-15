import Ship from '../Ship';

let len_count = [
	[4, 1],
	[3, 2],
	[2, 3],
	[1, 4],
];

const randomPlaceShips = (gb) => {
	let ships = [];
	let allShipsAreInBoard = true;

	for (const ln_cnt of len_count) {
		let count = ln_cnt[1];
		let len = ln_cnt[0];

		for (let i = 0; i < count; i++) {
			const shipSucessfullyStored = randomPlaceShipOfLength(gb, len, 0);

			if (!shipSucessfullyStored) {
				allShipsAreInBoard = false;
				break;
			} else ships.push(shipSucessfullyStored);
		}

		if (!allShipsAreInBoard) break;
	}

	if (allShipsAreInBoard) {
		console.log({ ships });
		for (const ship of ships) {
			if (gb.isPlaceboard) gb.drawShip(ship);
			else
				gb.placeShip(
					ship.length,
					ship.coor.startCoor,
					ship.coor.endCoor
				);
		}
	} else randomPlaceShips(gb);
};

const randomPlaceShipOfLength = (gb, length, callTimes) => {
	const randomFirstBlockCoor = [
		Math.floor(Math.random() * 10),
		Math.floor(Math.random() * 10),
	];

	const randomDirection = Math.random() > 0.5 ? 'h' : 'v';
	const endBlockCoor = getEndBlockCoor(
		length,
		randomFirstBlockCoor,
		randomDirection
	);

	const shipSucessfullyStored = checkPlace_returnStoredShipInMap(
		gb,
		length,
		randomFirstBlockCoor,
		endBlockCoor
	);

	if (!shipSucessfullyStored) {
		callTimes++;
		if (callTimes > 1000) return false;
		return randomPlaceShipOfLength(gb, length, callTimes);
	} else {
		return shipSucessfullyStored;
	}
};

/*
  @startCoor - [y:int,x:int]
  @endCoor - [y:int,x:int]
*/
const checkPlacement = (gb, length, startCoor, endCoor) => {
	// Ship overflows the gamaboard -> return false
	if (startCoor.concat(endCoor).some((coor) => coor < 0)) return false;
	if (startCoor.concat(endCoor).some((coor) => coor > 9)) return false;

	let adjacentCoor = [];

	// Ship is horizontal, check if overlaps other ships
	if (startCoor[0] == endCoor[0]) {
		for (let i = 0; i < length; i++) {
			if (gb.map[startCoor[0]][startCoor[1] + i].state == 'ship')
				return false;

			adjacentCoor.push([startCoor[0] - 1, startCoor[1] + i]);
			adjacentCoor.push([startCoor[0] + 1, startCoor[1] + i]);
		}
	}
	// Ship is vertical, check if overlaps other ships
	else if (startCoor[1] == endCoor[1]) {
		for (let i = 0; i < length; i++) {
			if (gb.map[startCoor[0] + i][startCoor[1]].state == 'ship')
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

	if (adjacentCoor.some((coor) => gb.map[coor[0]][coor[1]].state == 'ship'))
		return false;

	return true;
};

/*
  @startCoor - [y:int,x:int]
  @endCoor - [y:int,x:int]
*/
const checkPlace_returnStoredShipInMap = (
	gb,
	length,
	startCoor,
	endCoor,
	ship
) => {
	const isPlacementLegal = checkPlacement(gb, length, startCoor, endCoor);

	if (!isPlacementLegal) {
		return false;
	}

	if (!ship) ship = Ship(length);

	// startX == endX => vertical position
	if (startCoor[0] == endCoor[0]) {
		for (let i = 0; i < ship.length; i++) {
			gb.map[startCoor[0]][startCoor[1] + i].setShip(ship);
		}
	}
	// startY == endY => horizontal position
	else if (startCoor[1] == endCoor[1]) {
		for (let i = 0; i < ship.length; i++) {
			gb.map[startCoor[0] + i][startCoor[1]].setShip(ship);
		}
	}

	ship.setCoor(startCoor, endCoor);

	return ship;
};

const getEndBlockCoor = (length, firstBlockCoor, direction) => {
	let [y, x] = firstBlockCoor;

	return direction == 'h' ? [y, x + length - 1] : [y + length - 1, x];
};

export { randomPlaceShips, checkPlace_returnStoredShipInMap, getEndBlockCoor };
