import { createHash } from 'crypto';
import { IKeyStore, TKeyData, TKeyStoreInit } from '../lib/types';
import { readFile, writeFile } from 'fs'
;
export class KeyHolder implements IKeyStore {
	/// ///////////////////////////////////////////
	// Data and settings for the KeyStore class //
	/// ///////////////////////////////////////////


	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	private storedData: any = {};
	private hashByDefault = false;

	
	/// ///////////////////////////////////////////
	//   Initialisation of the KeyStore Class   //
	/// ///////////////////////////////////////////


	/** Initialises a new KeyStore instance with the given settings and data. */
	constructor({ settings, data }: TKeyStoreInit = {}) {
		this.hashByDefault = settings?.hashByDefault || false;

		if (data) this.saveBulk(data);
	}


	/// ///////////////////////////////////////////
	//  Private methods for the KeyStore Class  //
	/// ///////////////////////////////////////////


	/** Returns the hash of the given data. */
	private hash = (data: string | object) => { 
		if (typeof data === 'object') data = JSON.stringify(data);
		return createHash('sha256').update(data).digest('hex');
	};


	/** Checks if the two hashes are equal. */
	private compare = (valueOne: string | object, valueTwo: string | object) => valueOne === this.hash(valueTwo);


	/** Check if the store is using default hashing. */
	private usesDefaultHash = () => this.hashByDefault;


	/// ///////////////////////////////////////////
	//  Public methods for the KeyStore Class   //
	/// ///////////////////////////////////////////


	/** Read a specified key-value pair from the store. */
	read = (key: string): string | null => this.storedData[key]?.value || null;


	/** Get all key-value pairs from the store. */
	readAll = () => this.storedData;

	
	/** Save a key-value pair to the store, will overwrite existing value if key already exists. */
	save = ({ key, value, hashed }: TKeyData) => {

		if ((this.usesDefaultHash() && hashed !== false) || hashed === true) {
			value = this.hash(value);
			hashed = true;
		} else {
			hashed = false;
		}

		this.storedData = {
			...this.storedData,
			[key]: { value, hashed },
		};
	};


	/** Bulk save a set of key-value pairs into the store, will overwrite existing values if keys already exist. */
	saveBulk = async (data: TKeyData[]) => {
		await data.forEach((item) => {
			this.save(item);
		});
	};


	/** Bulk save from a JSON file, will overwrite existing values if keys already exist. */
	saveBulkFromFile = (filePath: string) => {
		const promise = new Promise((resolve, reject) => {
			readFile(filePath, (err, data) => {
				if (err) return reject(err);

				const parsedData = JSON.parse(data.toString());

				Object.keys(parsedData).forEach((key) => {
					this.save({
						key,
						value: parsedData[key].value,
						hashed: parsedData[key].hashed,
					});
				});

				resolve(null);
			});
		});

		return promise;
	};


	/** 
	 * Updates a key-value pair in the store if it exists, if it doesn't throw an error.
	 */
	update = ({ key, value, hashed }: TKeyData) => { 
		if (this.storedData[key]) { 
			this.save({ key, value, hashed });
		} else {
			throw new Error(`Key ${key} does not exist in the store.`);
		}
	};
	

	/** Remove a key-value pair from the store. */
	remove = (key: string) => delete this.storedData[key];

	
	/** Bulk remove a set of key-value pairs from the store. */
	removeBulk = async (keys: string[]) => {
		await keys.forEach((key) => {
			this.remove(key);
		});
	};


	/** Clear all key-value pairs from the store. */
	clear = () => this.storedData = {};


	/** Dump the store to to a JSON file. */
	dump = (path: string) => {
		const promise = new Promise((resolve, reject) => {
			const data = JSON.stringify(this.storedData, undefined, '\t');

			writeFile(path, data, (err) => {
				if (err) return reject(err);
			});

			resolve(null);
		});

		return promise;
	};


	/** Return the number of key-value pairs in the store. */
	size = () => Object.keys(this.storedData).length;


	/** Checks if the given value is equal to a key's value. (Will hash if key's value is hashed.) */
	isEqual = (key: string, value: string | object) => {
		if (this.storedData[key].hashed) return this.compare(this.storedData[key].value, value);
		
		return this.read(key) === value;
	};


	/** Checks if the given key is hashed or not. */
	isHashed = (key: string) => this.storedData[key].hashed;

	
	/** Check if a key is in the store. */
	exists = (key: string) => this.storedData[key] !== undefined;
}
