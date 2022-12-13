const Ship = (length) => {
	return {
		length,
		hits: 0,
		coor: {},

		hit() {
			this.hits++;
		},

		isSunk() {
			return this.length == this.hits;
		},

		setCoor(startCoor, endCoor) {
			this.coor.startCoor = startCoor;
			this.coor.endCoor = endCoor;
		},
	};
};

export default Ship;
