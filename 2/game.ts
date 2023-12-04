const MAX_RED = 12;
const MAX_GREEN = 13;
const MAX_BLUE = 14;

type GameSetColor = "red" | "blue" | "green";

export class GameSet implements Record<GameSetColor, number> {
	red = 0;
	blue = 0;
	green = 0;
}

export class Game {
	readonly id: number;
	readonly #sets: GameSet[];

	constructor(id: number) {
		this.id = id;
		this.#sets = [];
	}

	addSet(set: GameSet) {
		this.#sets.push(set);
	}

	isValidColor(color: string): color is GameSetColor {
		return (
			["red", "blue", "green"] as const satisfies (keyof GameSet)[]
		).includes(color as GameSetColor);
	}

	get isPossible() {
		return this.#sets.every(
			(set) =>
				set.red <= MAX_RED && set.blue <= MAX_BLUE && set.green <= MAX_GREEN,
		);
	}

	get #minimumCubeConfiguration() {
		const minimum = this.#sets.reduce((acc, set) => {
			acc.red = Math.max(acc.red, set.red);
			acc.blue = Math.max(acc.blue, set.blue);
			acc.green = Math.max(acc.green, set.green);
			return acc;
		}, new GameSet());

		return minimum;
	}

	get power() {
		const minimum = this.#minimumCubeConfiguration;

		return minimum.red * minimum.blue * minimum.green;
	}
}
