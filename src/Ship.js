const Ship = (length) => {
	return {
		length,
		hits: 0,

		hit() {
			this.hits++;
		},

		isSunk() {
			return this.length == this.hits;
		},
	};
};

export default Ship;
