import Ship from '../src/Ship.js';

test('Ship hit 1 time -> isSunk() = false ', () => {
	const ship = Ship(3);
	ship.hit();
	expect(ship.isSunk()).toBe(false);
});

test('Ship hit 3 times -> isSunk() = true ', () => {
	const ship = Ship(3);
	ship.hit();
	ship.hit();
	ship.hit();
	expect(ship.isSunk()).toBe(true);
});
