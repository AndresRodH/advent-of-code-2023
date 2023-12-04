const MAX_RED = 12;
const MAX_GREEN = 13;
const MAX_BLUE = 14;

export type GameSet = {
	red: number;
	blue: number;
	green: number;
};

export class Game {
	readonly id: number;
	readonly sets: GameSet[];

	constructor(id: number) {
		this.id = id;
		this.sets = [];
	}

	addSet(set: GameSet) {
		this.sets.push(set);
	}

	get isPossible() {
		return this.sets.every(
			(set) =>
				set.red <= MAX_RED && set.blue <= MAX_BLUE && set.green <= MAX_GREEN,
		);
	}
}
