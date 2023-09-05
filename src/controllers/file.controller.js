import { } from '../services/vast.service.js';
import { processFile } from '../utils/files/fileProcessor.js';
import { saveBundles } from '../services/vast.service.js';
export const saveFileData = () => {
	return processFile(process.env.BUNDLE_LIST, process.env.DELIMITER)
}
export const saveDataToDB = async (path) => {
	const records = await processFile(path, ';');
	await saveRecords(records);
};
const saveRecords = async (rows) => {
	const deleteDuplicates = (objects) => {
		const values = []
		let newArray = []
		const keys = Object.keys(objects[0])
		for (let i = 0; i < objects.length; i++) {
			const element = objects[i];
			if(!values.includes(element[keys[0]])) {
				values.push(element[keys[0]])
				newArray.push(element)
			}
		}
		return newArray;
	}
	try {
		let data = {
			bundles: [],
			stores: [],
			names: [],
			os: []
		}
		rows.map(async (row) => {
			let o = row[3]
			let s = row[2]
			let n = row[1]
			let b = row[0]
			data.os.push(o)
			data.stores.push({ store: s, os: o })
			data.names.push({ name: encodeURIComponent(n), store: s })
			data.bundles.push({ bundle: b, name: n })
		})
		data.stores = deleteDuplicates(data.stores); data.names = deleteDuplicates(data.names); data.bundles = deleteDuplicates(data.bundles);
		saveBundles(data)
	} catch (error) {
		console.log(error)
	}
}