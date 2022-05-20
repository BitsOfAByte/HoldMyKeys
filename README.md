<div align="center">

<img src = ".assets/logo.png" alt="Project logo" height="180"/>

### Hold My Keys
Easy to use in-memory key value store with zero external dependancies.
#### Built With

[![Typescript-Badge](https://img.shields.io/badge/Typescript-3178c6?style=for-the-badge&logo=typescript&logoColor=black)](https://typescriptlang.com)

</div>

---
  
## Getting Started
### Note
It is not recommended to use HoldMyKeys for large or long-term data. On most hardware, keys can be stored at around `0.12ms / 1000 keys`. 

### Installation
npm: `npm i holdmykeys`

Yarn: `yarn add holdmykeys`

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
| #.read()             | Read a key from the keyholder                        | `key: string`                                           | `string`           |
| #.readAll()          | Read all keys from the keyholder,                    | `none`                                                  | `TKeyData[]`       |
| #.save()             | Save a key to the keyholder                          | `TKeyData, TSaveSettings`                               | `void`             |
| #.saveBulk()         | Save multiple keys to the keyholder                  | `TKeyData[], TSaveSettings`                             | `Promise<void>`    |
| #.saveBulkFromFile() | Save multiple keys from a JSON file to the keyholde  | `TKeyData`                                              | `void`             |
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
| TSaveSettings     | `{ settings?: overwrite?: boolean }`                       |
