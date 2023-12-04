import { Game, GameSet } from "./game.ts";

const input = await Bun.file(`${import.meta.dir}/input.txt`).text();

const result = input
	.trim()
	.split("\n")
	.reduce((sum, line) => {
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

		return sum + (game.isPossible ? game.id : 0);
	}, 0);

console.log(result);
