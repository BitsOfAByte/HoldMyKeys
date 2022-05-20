import { createHash } from 'crypto';
import { IKeyStore, TKeyData, TKeyStoreInit, TSaveSettings } from './types/index.types';
import { readFile, writeFile } from 'fs';
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

		if (data) this.saveBulk(data, { overwrite: true });
	}


	/// ///////////////////////////////////////////
	//  Private methods for the KeyStore Class  //
	/// ///////////////////////////////////////////


	/** Returns the hash of the given data. */
	private hash = (data: string | object) => typeof data === 'object' 
		? createHash('sha256').update(JSON.stringify(data)).digest('hex') 
		: createHash('sha256').update(data).digest('hex'); 


	/** Checks if the two hashes are equal. */
	private compare = (valueOne: string | object, valueTwo: string | object) => valueOne === this.hash(valueTwo);


	/// ///////////////////////////////////////////
	//  Public methods for the KeyStore Class   //
	/// ///////////////////////////////////////////


	/** Read a specified key-value pair from the store. */
	read = (key: string): TKeyData | null => this.storedData[key] || null;


	/** Get all key-value pairs from the store. */
	readAll = () => this.storedData;


	/** Save a key-value pair to the store, overwriting existing data if set. */
	save = (data: TKeyData, settings?: TSaveSettings) => {

		if (!settings?.overwrite && this.exists(data.key)) throw new Error(`Key ${data.key} already exists.`);

		if ((this.hashByDefault && data.hashed !== false) || data.hashed === true) {
			data.value = this.hash(data.value);
			data.hashed = true;
		} else {
			data.hashed = false;
		}

		this.storedData = { ...this.storedData, [data.key]: data };
	};


	/** Bulk save a set of key-value pairs into the store, will overwrite existing values if set. */
	saveBulk = async (data: TKeyData[], settings?: TSaveSettings) => await data
		.forEach((item) => settings?.overwrite && this.exists(item.key) 
			? (function() {new Error(`Key ${item.value} already exists.`);}) 
			: this.save(item));


	/** Bulk save from a JSON file, will overwrite existing values if set */
	saveBulkFromFile = (filePath: string, settings?: TSaveSettings) => {
		const promise = new Promise((resolve, reject) => {
			readFile(filePath, (err, data) => {
				if (err) return reject(err);

				const parsedData = JSON.parse(data.toString());

				Object.keys(parsedData).forEach((key) => {
					if(!settings?.overwrite && this.exists(key)) throw new Error(`Key ${key} already exists.`);
					this.save({
						key: parsedData[key].key,
						value: parsedData[key].value,
						hashed: parsedData[key].hashed,
					});
				});

				resolve(null);
			});
		});

		return promise;
	};


	/** Remove a key-value pair from the store. */
	remove = (key: string) => delete this.storedData[key];


	/** Bulk remove a set of key-value pairs from the store. */
	removeBulk = async (keys: string[]) => await keys.forEach((key) => this.remove(key));
	

	/** Clear all key-value pairs from the store. */
	clear = () => this.storedData = {};


	/** Dump the store to to a JSON file. */
	dump = (path: string) => new Promise((resolve, reject) => writeFile(path, JSON.stringify(this.storedData, undefined, '\t'), 
		(err) => err ? reject(err) : resolve(null)));


	/** Return the number of key-value pairs in the store. */
	size = () => Object.keys(this.storedData).length;


	/** Checks if the given value is equal to a key's value. (Will hash if key's value is hashed.) */
	isEqual = (key: string, value: string | object) => {
		if (!this.storedData[key].hashed) return this.read(key)?.value === value;

		return this.compare(this.storedData[key].value, value);		
	};


	/** Checks if the given key is hashed or not. */
	isHashed = (key: string) => this.storedData[key].hashed;


	/** Check if a key is in the store. */
	exists = (key: string) => this.storedData[key] !== undefined;
}
