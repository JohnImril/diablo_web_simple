import axios from "axios";
import { IApi, IFileSystem } from "../types";

const DiabdatSizes = [517501282, 263402726, 263383766];

export { DiabdatSizes };

export default async function load_diabdat(api: IApi, fs: IFileSystem) {
	const fileName = "diabdat.mpq";
	const lowerFileName = fileName.toLowerCase();

	let file = fs.files.get(lowerFileName);
	if (file && !DiabdatSizes.includes(file.byteLength)) {
		fs.files.delete(lowerFileName);
		await fs.delete(fileName);
		file = undefined;
	}
	if (!file) {
		const diabdat = await axios.request({
			url: import.meta.env.BASE_URL === "/" ? fileName : import.meta.env.BASE_URL + "/" + fileName,
			responseType: "arraybuffer",
			onDownloadProgress: (e) => {
				if (api.onProgress) {
					api.onProgress({
						text: "Downloading...",
						loaded: e.loaded,
						total: e.total || DiabdatSizes[1],
					});
				}
			},
			headers: {
				"Cache-Control": "max-age=31536000",
			},
		});
		if (!DiabdatSizes.includes(diabdat.data.byteLength)) {
			throw Error("Invalid diabdat.mpq size. Try clearing cache and refreshing the page.");
		}
		const data = new Uint8Array(diabdat.data);
		fs.files.set(lowerFileName, data);
		await fs.update(fileName, data.slice());
	}
	return fs;
}
