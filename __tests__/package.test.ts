import { KeyHolder } from '../lib/';
import { unlinkSync, existsSync } from 'fs';

const testFile = `./${Date.now().toString()}.json`;
const testKey = 'test-key';
const testValue = 'test-value';

// Can initialise a KeyHolder
test('Can initialise a KeyHolder', () => {
	const keyHolder = new KeyHolder();
	expect(keyHolder).toBeDefined();
});


// Can initialise a KeyHolder with data 
test('Can initialise a KeyHolder with data', () => {
	const keyHolder = new KeyHolder({ data:[
		{ key: testKey, value: testValue, hashed: false },
	]});

	expect(keyHolder).toBeDefined();
	expect(keyHolder.read(testKey)?.value).toBe(testValue);
});


// Can initialise a KeyHolder as hashed
test('Can initialise a KeyHolder as hashed', () => {
	const keyHolder = new KeyHolder({ settings: {
		hashByDefault: true,
	}});

	keyHolder.save({ key: testKey, value: testValue });

	expect(keyHolder).toBeDefined();
	expect(keyHolder.read(testKey)?.value).not.toBe(testValue);
	expect(keyHolder.isEqual(testKey, testValue)).toBe(true);
});


// Can read all key-value pairs from the store
test('Can read all key-value pairs from the store', () => {
	const keyHolder = new KeyHolder({ data:[
		{ key: testKey, value: testValue, hashed: false },
	]});

	expect(keyHolder.readAll()).toEqual({ [testKey]: { key: testKey, value: testValue, hashed: false } });
});


// Store preventsd overwriting existing values
test('Store prevents overwriting existing values', () => {
	const keyHolder = new KeyHolder();

	keyHolder.save({ key: testKey, value: testValue });
	expect(keyHolder.read(testKey)?.value).toBe(testValue);
	
	expect(() => keyHolder.save({ key: testKey, value: testValue })).toThrow();
});


// Can load a set of key-value pairs into the store
test('Can load a set of key-value pairs into the store', () => {
	const keyHolder = new KeyHolder();

	keyHolder.saveBulk([
		{ key: testKey, value: testValue, hashed: false }, 
	]);

	expect(keyHolder.read(testKey)?.value).toBe(testValue);
});


// Can dump the store to a JSON file
test('Can dump the store to a JSON file', () => {
	const keyHolder = new KeyHolder({ data:[
		{ key: testKey, value: testValue, hashed: false },
	]});

	keyHolder.dump(testFile).catch(
		(err) => expect(err).toBeNull()
	);
});

// Can read from a JSON file
test('Can read from a JSON file', () => {
	const keyHolder = new KeyHolder();

	keyHolder.saveBulkFromFile(testFile).then(() => {
		expect(keyHolder.read(testKey)?.value).toBe(testValue);
	});
});

// Can remove a key-value pair from the store
test('Can remove a key-value pair from the store', () => {
	const keyHolder = new KeyHolder({ data:[
		{ key: testKey, value: testValue, hashed: false },
	]});

	expect(keyHolder.read(testKey)?.value).toBe(testValue);

	keyHolder.remove(testKey);

	expect(keyHolder.read(testKey)?.value).toBe(undefined);
});


// Can bulk remove a set of key-value pairs from the store
test('Can bulk remove a set of key-value pairs from the store', () => {
	const keyHolder = new KeyHolder({ data:[
		{ key: testKey, value: testValue, hashed: false },
		{ key: `${testKey}-2`, value: `${testValue}-2`, hashed: false },
	]});

	expect(keyHolder.read(testKey)?.value).toBe(testValue);
	expect(keyHolder.read(`${testKey}-2`)?.value).toBe(`${testValue}-2`);

	keyHolder.removeBulk([testKey, `${testKey}-2`]);

	expect(keyHolder.read(testKey)?.value).toBe(undefined);
	expect(keyHolder.read(`${testKey}-2`)?.value).toBe(undefined);
});


// Can clear all pairs from the store
test('Can clear all pairs from the store', () => {
	const keyHolder = new KeyHolder({ data:[
		{ key: testKey, value: testValue, hashed: false },
	]});

	expect(keyHolder.read(testKey)?.value).toBe(testValue);

	keyHolder.clear();

	expect(keyHolder.read(testKey)?.value).toBe(undefined);
});


// Can get the size of the store
test('Can get the size of the store', () => {
	const keyHolder = new KeyHolder({ data:[
		{ key: testKey, value: testValue, hashed: false },
	]});

	expect(keyHolder.size()).toBe(1);
});


// Can check if a key-value pair is equal
test('Can check if a key-value pair is equal', () => {
	const keyHolder = new KeyHolder({ data:[
		{ key: testKey, value: testValue, hashed: false },
	]});

	expect(keyHolder.isEqual(testKey, testValue)).toBe(true);
	expect(keyHolder.isEqual(testKey, 'test-value-2')).toBe(false);
});


// Can see if item is hashed
test('Can see if item is hashed', () => {
	const keyHolder = new KeyHolder({ data:[
		{ key: testKey, value: testValue, hashed: false },
		{ key: `${testKey}-2`, value: testValue, hashed: true },
	]});

	expect(keyHolder.isHashed(testKey)).toBe(false);
	expect(keyHolder.isHashed(`${testKey}-2`)).toBe(true);
});


// Can check if key exists with method
test('Can check if key exists with method', () => {
	const keyHolder = new KeyHolder({ data:[
		{ key: testKey, value: testValue, hashed: false },
	]});

	expect(keyHolder.exists(testKey)).toBe(true);
	expect(keyHolder.exists(`${testKey}-2`)).toBe(false);
});


// Cleanup
afterAll(() => {
	if (existsSync(testFile)) {
		unlinkSync(testFile);
	}
});