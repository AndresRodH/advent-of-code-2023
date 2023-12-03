const input = (await Bun.file(`${import.meta.dir}/input.txt`).text()).trim();

const MAX_RED = 12;
const MAX_GREEN = 13;
const MAX_BLUE = 14;

type GameSet = {
	red: number;
	blue: number;
	green: number;
};

class Game {
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

let sumOfIdsOfPossibleGames = 0;

for (const line of input.split("\n")) {
	const [idPart, setsPart] = line.split(":");
	const id = Number(idPart.split(" ").pop());

	const game = new Game(id);

	for (const entries of setsPart.split(";")) {
		const set: GameSet = {
			red: 0,
			blue: 0,
			green: 0,
		};

		for (const entry of entries.split(",")) {
			const [amount, color] = entry.trim().split(" ");

			if (color === "red") {
				set.red = Number(amount);
			}
			if (color === "blue") {
				set.blue = Number(amount);
			}
			if (color === "green") {
				set.green = Number(amount);
			}
		}

		game.addSet(set);
	}

	sumOfIdsOfPossibleGames += game.isPossible ? game.id : 0;
}

console.log(sumOfIdsOfPossibleGames);
