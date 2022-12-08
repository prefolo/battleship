import PubSub from 'pubsub-js';

let isSubscribed = false;

const showDeniedAttackDialogBox = (msg, coordinates) => {
	alert(`Denied attack : the cell ${coordinates} is yet hit.`);
};

const markAttackedSea = (msg, { coordinates, gameboard }) => {
	console.log('markAttackedSea', { coordinates, gameboard });

	const cell = gameboard.isComputer ? '#cmp-cell' : '#cell';

	document.querySelector(
		cell + coordinates[0] + '-' + coordinates[1]
	).textContent = 'X';
};

const markAttackedShip = (msg, { coordinates, gameboard }) => {
	console.log('markAttackedShip', { coordinates, gameboard });

	const cell = gameboard.isComputer ? '#cmp-cell' : '#cell';

	document.querySelector(
		cell + coordinates[0] + '-' + coordinates[1]
	).textContent = 'O';
};

const showWrongShipPlacementCoordinatesDialogBox = (msg, coorPair) => {
	alert(
		`Wrong ship placement at: ${coorPair.startCoor} - ${coorPair.endCoor}.`
	);
};

const drawPlacedShip = (msg, data) => {
	for (let i = 0; i < 10; i++) {
		for (let j = 0; j < 10; j++) {
			if (data.map[i][j].state == 'ship')
				document.querySelector(
					'#cell' + i + '-' + j
				).style.backgroundColor = 'gray';
		}
	}
};

const showPlayerWonDialogBox = () => {
	alert('Player Won!');
};

const showComputerWonDialogBox = () => {
	alert('Computer Won!');
};

const DOMController = {
	suscribe() {
		if (isSubscribed) return;

		PubSub.subscribe(
			'Tried Attack Yet Hit Cell',
			showDeniedAttackDialogBox
		);
		PubSub.subscribe('Attacked Sea', markAttackedSea);
		PubSub.subscribe('Attacked Ship', markAttackedShip);
		PubSub.subscribe(
			'Provided Wrong Ship Placement Coordinates',
			showWrongShipPlacementCoordinatesDialogBox
		);
		PubSub.subscribe('Placed Ship', drawPlacedShip);
		PubSub.subscribe('Player won', showPlayerWonDialogBox);
		PubSub.subscribe('Computer won', showComputerWonDialogBox);

		isSubscribed = true;
	},
};

export default DOMController;
