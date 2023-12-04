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
			const set = new GameSet();

			for (const entry of entries.split(",")) {
				const [amount, color] = entry.trim().split(" ");

				if (game.isValidColor(color)) {
					set[color] = Number(amount);
				}
			}

			game.addSet(set);
		}

		return sum + game.power;
	}, 0);

console.log(result);
