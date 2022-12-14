const ShipInDock = (length) => {
	return {
		length,

		render(htmlContainerID) {
			const container = document.querySelector(`#${htmlContainerID}`);

			const frame = document.createElement('div');
			frame.style.display = 'flex';

			frame.draggable = 'true';

			frame.addEventListener('dragstart', (ev) =>
				dragstart_handler(ev, this.length)
			);

			while (length) {
				const block = document.createElement('div');

				block.style =
					'width:24px;height:24px;border-width:1px;border-style:solid';
				block.className = 'shipBlock';

				frame.appendChild(block);
				length--;
			}

			container.appendChild(frame);
		},
	};
};

const dragstart_handler = (ev, length) => {
	console.log({ length });
	const grabbedBlockIndex = parseInt(ev.offsetX / 26);

	ev.dataTransfer.setData(
		'text',
		'{"length":"' +
			length +
			'","direction":"h","isShipInDock":"true","grabbedBlockIndex":"' +
			grabbedBlockIndex +
			'"}'
	);
};

export default ShipInDock;
