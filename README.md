<div align="center">

<img src = ".assets/logo.png" alt="Project logo" height="180"/>

### Hold My Keys
Easy to use in-memory key value store with zero external dependancies.

#### Built With

[![Typescript-Badge](https://img.shields.io/badge/Typescript-3178c6?style=for-the-badge&logo=typescript&logoColor=black)](https://javascript.com)

</div>

---

## Quickstart

### Installation

`npm i holdmykeys` or `yarn add holdmykeys`

**NOTE:** This package is likely not suitable for production environments and may be very slow with large amounts of data.

### Basic Usage
```javascript
import { KeyHolder } from "holdmykeys";

// Initialise a new KeyHolder instance
const keyHolder = new KeyHolder();

// Add a key to the KeyHolder
keyHolder.save({key: "my-key", value: "This is a value for a key"});

// Get the value of a key
keyHolder.read("my-key")?.value; // "This is a value for a key"

// Remove a key from the KeyHolder
keyHolder.remove("my-key");

```

## Documentation

### KeyHolder Arguments
| Name     | Description                               | Values                | Default | Required |
|----------|-------------------------------------------|-----------------------|---------|----------|
| Settings | The settings to use for the keyholder     | `TKeyStoreSettings{}` | `{}`    | `false`  |
| Data     | The data to initialise the keyholder with | `TKeyData[] `         | `[]`    | `false`  |

### Methods

| Name                 | Description                                          | Arguments                                               | Return             |
|----------------------|------------------------------------------------------|---------------------------------------------------------|--------------------|
| #.read()             | Read a key from the keyholder                        | `key: string`                                           | `string | null`    |
| #.readAll()          | Read all keys from the keyholder,                    | `none`                                                  | `TKeyData[]`       |
| #.save()             | Save a key to the keyholder                          | `TKeyData, TSaveSettings`                               | `void`             |
| #.saveBulk()         | Save multiple keys to the keyholder                  | `TKeyData[], TSaveSettings`                             | `Promise<void>`    |
| #.saveBulkFromFile() | Save multiple keys from a JSON file to the keyholder | `filePath: string`                                      | `Promise<unknown>` |
| #.saveIfNotExists()  | Saves a key to the keyholder if it doesn't exist     | `TKeyData`                                              | `void`             |
| #.update()           | DEPRECATED: Update a value if it exists              | `TKeyData`                                              | `void`             |
| #.dump()             | Dump all the keys in the keyholder to a file         | `filePath: string`                                      | `Promise<unknown>` |
| #.remove()           | Remove a key from the keyholder                      | `key: string`                                           | `void`             |
| #.removeBulk()       | Remove multiple keys from the keyholder              | `keys: string[]`                                        | `Promise<void>`    |
| #.clear()            | Clear all keys from the keyholder                    | `none`                                                  | `void`             |
| #.size()             | Get the number of keys in the keyholder              | `none`                                                  | `number`           |
| #.isEqual()          | Compare a key value to the given value               | `key: string, value: string`                            | `boolean`          |
| #.isHashed()         | Check if a key is hashed                             | `key: string`                                           | `boolean`          |
| #.exists()           | Check if a key exists in the keyholder               | `key: string`                                           | `boolean`          |

### Types
| Name              | Details                                                    |
|-------------------|------------------------------------------------------------|
| TKeyData          | `{ key: string, value: string \|object, hashed: boolean }` |
| TKeyStoreSettings | `{ hashedByDefault?: boolean }`                            |
| TKeyStoreInit     | `{ settings?: TKeyStoreSettings, data?: TKeyData[] }`      |
