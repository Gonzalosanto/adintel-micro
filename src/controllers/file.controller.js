import { } from '../services/vast.service.js';
import { processFile } from '../utils/files/fileProcessor.js';
export const saveFileData = () => {
	return processFile(process.env.BUNDLE_LIST, process.env.DELIMITER)
}

export const saveDataToDB = async (path, callback) => {
	const records = await processFile(path, ';');
	await saveRecords(records, callback);
};

//Records from bundles. Take in account the device data case.
const saveRecords = async (rows,callback) => {
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
	const getRowData = (rows, data) => {
		rows.map(async (row) => {
			let o = row[3]
			let s = row[2]
			let n = row[1]
			let b = row[0]
			data.os.push({os:o})
			data.stores.push({ store: encodeURIComponent(s), os: o })
			data.names.push({ name: encodeURIComponent(n), store: encodeURIComponent(s) })
			data.bundles.push({ bundle: b, name: encodeURIComponent(n), store: encodeURIComponent(s) })
		})
		deleteDuplicates(data.stores)
	}
	const getDeviceRowData = (rows, data) => {
		return rows.map(async (row) => {
			let did = row[0]
			let ua = row[1]
			let ip = row[2]
			data.uas.push({ua:ua})
			data.uips.push({ uip: ip})
			data.deviceids.push({ deviceid: encodeURIComponent(did) })
		})
	}
	try {
		let data = {
			bundles: [],
			stores: [],
			names: [],
			os: [],
			uas : [],
			uips: [],
			deviceids:[]
		}
		if(rows[0].length == 4){getRowData(rows, data)}else{getDeviceRowData(rows, data)}
		callback(data)
	} catch (error) {
		console.log(error)
	}
}