let num = 0;

const ShipInPboard = (length) => {
	return {
		length,

		render(htmlContainerID, x, y) {
			const container = document.querySelector(`#${htmlContainerID}`);

			const frame = document.createElement('div');
			frame.style = `display:flex;position:absolute;z-index:1;left:${x}px;top:${y}px`;

			frame.id = `shipInPboard${num}`;
			num++;

			frame.draggable = 'true';

			frame.addEventListener('dragstart', (ev) =>
				dragstart_handler(ev, this.length, frame.id)
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

			return frame.id;
		},
	};
};

const dragstart_handler = (ev, length, id) => {
	let direction = 'h';
	let grabbedBlockIndex = parseInt(ev.offsetX / 26);

	if (ev.target.style.display == 'block') {
		direction = 'v';
		grabbedBlockIndex = parseInt(ev.offsetY / 26);
	}

	const data = {
		length,
		id,
		direction,
		isShipInPboard: true,
		grabbedBlockIndex,
	};

	ev.dataTransfer.setData('text', JSON.stringify(data));
};

export default ShipInPboard;
