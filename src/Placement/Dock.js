import ShipInDock from './ShipInDock';

const len_count = [
	[2, 4],
	[3, 3],
	[4, 2],
	[6, 1],
];

let Singleton = null;

const Dock = () => {
	if (Singleton) return Singleton;

	Singleton = {
		render(htmlContainerID) {
			const container = document.querySelector(`#${htmlContainerID}`);

			const frame = document.createElement('div');

			for (const item of len_count) {
				const row = document.createElement('div');
				row.style =
					'display: flex;align-items: center;gap: 20px;margin-bottom:10px';

				const shipBox = document.createElement('span');
				shipBox.id = `shipLen${item[0]}`;

				const countBox = document.createElement('span');
				countBox.id = `shipCount${item[0]}`;
				countBox.className = 'dockCountBox';
				countBox.textContent = `x ${item[1]}`;

				row.appendChild(shipBox);
				row.appendChild(countBox);
				frame.appendChild(row);
			}

			container.appendChild(frame);

			for (const item of len_count) {
				ShipInDock(item[0]).render(`shipLen${item[0]}`);
			}
		},

		decrementShipCount(shipLength) {
			for (const item of len_count) {
				if (item[0] == shipLength) {
					item[1]--;

					document.querySelector(
						`#shipCount${item[0]}`
					).textContent = `x ${item[1]}`;

					if (item[1] == 0) {
						const dockedShip = document.querySelector(
							`#shipLen${item[0]}`
						).firstChild;

						dockedShip.setAttribute('draggable', 'false');
						dockedShip.className = 'undraggableDockedShip';
					}
					break;
				}
			}
		},
	};

	return Singleton;
};

export default Dock;
