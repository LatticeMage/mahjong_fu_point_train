// index.ts
import { GenBaseForm } from './gen-blocks';
import { BaseForm2Str } from './to_str';

for (let i = 0; i < 20; i++) {
	const round = Math.floor(Math.random() * 3) + 1; // 1 to 3
	const position = Math.floor(Math.random() * 4) + 1; // 1 to 4

	const baseForm = GenBaseForm();

	const result = BaseForm2Str(baseForm);
	console.log(`round ${round}, position ${position}, hand: ${result}`);
}
