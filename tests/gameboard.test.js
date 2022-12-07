import Gameboard from '../src/Gameboard.js';

test('Gameboard map lenght => 10 ', () => {
	const gb = Gameboard();
	expect(gb.map.length).toBe(10);
});

test('Gameboard map first row lenght => 10 ', () => {
	const gb = Gameboard();
	expect(gb.map[0].length).toBe(10);
});

test('Gameboard cell [1,4] is hit => false ', () => {
	const gb = Gameboard();
	expect(gb.map[1][4].isHit()).toBe(false);
});

test('Hit cell [1,4]. Is hit => true', () => {
	const gb = Gameboard();
	gb.map[1][4].receiveAttack();
	expect(gb.map[1][4].isHit()).toBe(true);
});

test('Place ship at [1,4] - [1,8]. cells [1,4] - [1,8] .state => "ship"', () => {
	const gb = Gameboard();
	gb.placeShip(5, [1, 4], [1, 8]);
	expect(gb.map[1][4].state).toBe('ship');
	expect(gb.map[1][5].state).toBe('ship');
	expect(gb.map[1][6].state).toBe('ship');
	expect(gb.map[1][7].state).toBe('ship');
	expect(gb.map[1][8].state).toBe('ship');
});

test('Place ship at [4,3] - [6,3]. cells [4,3] - [6,3] .state => "ship"', () => {
	const gb = Gameboard();
	gb.placeShip(3, [4, 3], [6, 3]);
	expect(gb.map[4][3].state).toBe('ship');
	expect(gb.map[5][3].state).toBe('ship');
	expect(gb.map[6][3].state).toBe('ship');
});
