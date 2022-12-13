const Cell = (coordinates, ship = null) => {
	return {
		coordinates,
		ship,
		state: ship ? 'ship' : 'sea',

		receiveAttack() {
			// console.log(this.coordinates);
			if (this.isHit()) {
				PubSub.publish('Tried Attack Yet Hit Cell', this.coordinates);

				return true;
			}
			if (this.state == 'sea') {
				this.state = 'hit-sea';
				
				PubSub.publish('Attacked Sea', {
					coordinates: this.coordinates,
					gameboard: this.gameboard,
				});
			}
			if (this.state == 'ship') {
				this.state = 'hit-ship';
				this.ship.hit();

				PubSub.publish('Attacked Ship', {
					coordinates: this.coordinates,
					gameboard: this.gameboard,
				});
			}
		},

		isHit() {
			return this.state == 'hit-sea' || this.state == 'hit-ship';
		},

		setShip(ship) {
			this.ship = ship;
			this.state = 'ship';
		},
		removeShip(ship) {
			if (this.ship == ship) {
				this.ship = null;
				this.state = 'sea';
			}
		},
	};
};

export default Cell;
