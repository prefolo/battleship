import ShipInDock from './ShipInDock';

let len_count = [
	[4, 1],
	[3, 2],
	[2, 3],
	[1, 3],
];

// Singleton Pattern
let Singleton = null;

const Dock = () => {
	if (Singleton) return Singleton;

	Singleton = {
		htmlContainerID: null,

		render(htmlContainerID) {
			this.htmlContainerID = htmlContainerID;

			const container = document.querySelector(`#${htmlContainerID}`);
			container.innerHTML = '';

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

			let allShipsAreInPboard = len_count.every(
				(len_count) => len_count[1] == 0
			);
			return allShipsAreInPboard;
		},

		reset() {
			len_count = [
				[4, 1],
				[3, 2],
				[2, 3],
				[1, 4],
			];

			Singleton.render(this.htmlContainerID);
		},

		disable() {
			for (const ln_cnt of len_count) {
				let count = ln_cnt[1];
				let len = ln_cnt[0];

				for (let i = 0; i < count; i++) {
					this.decrementShipCount(len);
				}
			}
		},
	};

	return Singleton;
};

export default Dock;
