import { openDB, IDBPDatabase } from "idb";
import { IFileSystem } from "./types";

const CHUNK_SIZE = 5 * 1024 * 1024;

export async function downloadFile(db: IDBPDatabase<unknown>, name: string) {
	try {
		const fileName = name.toLowerCase();
		const data = await downloadFileChunks(db, fileName);
		if (!data) {
			console.error(`File ${name} does not exist`);
			return;
		}
		const blob = new Blob([data], { type: "binary/octet-stream" });
		const url = URL.createObjectURL(blob);
		triggerDownload(url, name);
	} catch (e) {
		console.error(`Failed to download file ${name}:`, e);
	}
}

function triggerDownload(url: string, name: string) {
	const link = document.createElement("a");
	link.href = url;
	link.download = name;
	document.body.appendChild(link);
	link.click();
	document.body.removeChild(link);
	URL.revokeObjectURL(url);
}

async function downloadSaves(db: IDBPDatabase<unknown>) {
	const keys = await db.getAllKeys("files");
	for (const name of keys) {
		if ((name as string).match(/\.sv$/i)) {
			await downloadFile(db, name as string);
		}
	}
}

const readFile = (file: File): Promise<ArrayBuffer> =>
	new Promise((resolve, reject) => {
		const reader = new FileReader();
		reader.onload = () => resolve(reader.result as ArrayBuffer);
		reader.onerror = () => reject(reader.error);
		reader.onabort = () => reject();
		reader.readAsArrayBuffer(file);
	});

async function uploadFileChunks(db: IDBPDatabase<unknown>, files: Map<string, Uint8Array>, file: File) {
	const data = new Uint8Array(await readFile(file));
	const fileName = file.name.toLowerCase();

	if (data.length <= CHUNK_SIZE) {
		// Store small files without chunking
		await db.put("files", data, fileName);
		files.set(fileName, data);
		console.log(`File ${fileName} uploaded without chunking.`);
	} else {
		const totalChunks = Math.ceil(data.length / CHUNK_SIZE);
		console.log(`File ${fileName} uploaded in ${totalChunks} chunks.`);

		for (let i = 0; i < totalChunks; i++) {
			const chunk = data.slice(i * CHUNK_SIZE, (i + 1) * CHUNK_SIZE);
			const chunkKey = `${fileName}_chunk_${i}`;
			await db.put("files", chunk, chunkKey);
		}

		await db.put("files", { chunks: totalChunks }, `${fileName}_metadata`);
		files.set(fileName, data);
	}
}

async function downloadFileChunks(db: IDBPDatabase<unknown>, fileName: string): Promise<Uint8Array> {
	const metadata = await db.get("files", `${fileName}_metadata`);
	if (!metadata || !metadata.chunks) {
		// File was stored without chunking
		const data = await db.get("files", fileName);
		if (!data) throw new Error(`File ${fileName} is missing.`);
		return new Uint8Array(data);
	}

	const chunks = [];
	for (let i = 0; i < metadata.chunks; i++) {
		const chunkKey = `${fileName}_chunk_${i}`;
		const chunk = await db.get("files", chunkKey);
		if (!chunk) throw new Error(`Chunk ${i} of file ${fileName} is missing.`);
		chunks.push(chunk);
	}
	return new Uint8Array(chunks.flat());
}

export default async function create_fs(): Promise<IFileSystem> {
	try {
		if (!("indexedDB" in window)) {
			throw new Error("IndexedDB is not supported in this browser.");
		}

		const db = await openDB("diablo_fs_simple", 2, {
			upgrade(db, oldVersion) {
				if (oldVersion < 1) {
					db.createObjectStore("files");
				} else if (oldVersion === 1) {
					if (!db.objectStoreNames.contains("files")) {
						db.createObjectStore("files");
					}
				}
			},
		});

		const files = new Map<string, Uint8Array>();

		const keys = await db.getAllKeys("files");
		for (const key of keys) {
			if (!(key as string).endsWith("_metadata") && !(key as string).includes("_chunk_")) {
				const value = await downloadFileChunks(db, key as string);
				files.set(key as string, value);
			}
		}

		window.DownloadFile = (name: string) => downloadFile(db, name);
		window.DownloadSaves = () => downloadSaves(db);

		return {
			files,
			update: async (name: string, data: Uint8Array) => {
				await uploadFileChunks(db, files, new File([data], name));
			},
			delete: async (name: string) => {
				const metadata = await db.get("files", `${name}_metadata`);
				if (metadata && metadata.chunks) {
					for (let i = 0; i < metadata.chunks; i++) {
						await db.delete("files", `${name}_chunk_${i}`);
					}
					await db.delete("files", `${name}_metadata`);
				} else {
					await db.delete("files", name);
				}
				files.delete(name);
			},
			clear: async () => {
				await db.clear("files");
				files.clear();
			},
			download: (name: string) => downloadFile(db, name),
			upload: (file: File) => uploadFileChunks(db, files, file),
			fileUrl: async (name: string) => {
				const data = files.get(name.toLowerCase());
				if (data) {
					const blob = new Blob([data], { type: "binary/octet-stream" });
					return URL.createObjectURL(blob);
				}
				return undefined;
			},
		};
	} catch (e) {
		console.error("Error initializing IndexedDB", e);
		window.DownloadFile = () => console.error("IndexedDB is not supported");
		window.DownloadSaves = () => console.error("IndexedDB is not supported");

		return {
			files: new Map<string, Uint8Array>(),
			update: () => Promise.resolve(),
			delete: () => Promise.resolve(),
			clear: () => Promise.resolve(),
			download: () => Promise.resolve(),
			upload: () => Promise.resolve(),
			fileUrl: () => Promise.resolve(undefined),
		};
	}
}
