import PubSub from 'pubsub-js';

let isSubscribed = false;

const showDeniedAttackDialog = (msg, coordinates) => {
	alert(`Denied attack : the cell ${coordinates} is yet hit.`);
};

const markAttackedSea = (msg, { coordinates, gameboard }) => {
	const cell = gameboard.isComputer ? '#cpuCell' : '#cell';

	document.querySelector(
		cell + coordinates[0] + '-' + coordinates[1]
	).textContent = 'X';
};

const markAttackedShip = (msg, { coordinates, gameboard }) => {
	const cell = gameboard.isComputer ? '#cpuCell' : '#cell';

	document.querySelector(
		cell + coordinates[0] + '-' + coordinates[1]
	).textContent = 'O';
};

const showWrongShipPlacementDialog = (msg, coorPair) => {
	alert(
		`The ship can not be placed at: ${coorPair.startCoor} - ${coorPair.endCoor}.`
	);
};

const drawPlacedShip = (msg, data) => {
	const cell = data.gb.isComputer ? '#cpuCell' : '#playerCell';

	for (let i = 0; i < 10; i++) {
		for (let j = 0; j < 10; j++) {
			if (data.gb.map[i][j].state == 'ship')
				document
					.querySelector(cell + i + '-' + j)
					.classList.add('shipCell');
		}
	}
};

const showPlayerWonDialog = () => {
	alert('Player Won!');
};

const showComputerWonDialog = () => {
	alert('Computer Won!');
};

const DOMController = {
	suscribe() {
		if (isSubscribed) return;

		PubSub.subscribe('Tried Attack Yet Hit Cell', showDeniedAttackDialog);
		PubSub.subscribe('Attacked Sea', markAttackedSea);
		PubSub.subscribe('Attacked Ship', markAttackedShip);
		PubSub.subscribe(
			'Illegal ship placement',
			showWrongShipPlacementDialog
		);
		PubSub.subscribe('Placed Ship In Gb', drawPlacedShip);
		PubSub.subscribe('Player won', showPlayerWonDialog);
		PubSub.subscribe('Computer won', showComputerWonDialog);

		isSubscribed = true;
	},
};

export default DOMController;
