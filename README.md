# persistme

localStorage on steroids 💉

`persistme` lets you namespace your `localStorage` across multiple applications even when they are hosted on the same domain. Store and retrieve data from different apps without worrying about name clashes and accidental overrides of the localStorage properties. Besides solving the namespace problem, it also comes with some nice goodies.

- Namespace multiple apps `localStorage` usage on the same domain
- Store/retrieve any primitive data types in their exact format -- `string`, `boolean`, `number`, `object` and `array`
- Uses LZ-based compression algorithm so you can squeeze more data in the given [localStorage data limit](https://www.html5rocks.com/en/tutorials/offline/quota-research/)
- Neat APIs and sugars with default fallbacks

#### Install
The library is available as a UMD package. If you prefer to use the traditional approach, you may download and include the [persistme.min.js](./lib/persistme.min.js) file directly in the `script` tag.

```shell
npm install --save persistme
```

## Usage Examples
Check out the [examples](./examples/) folder for some rudimentary multi-application setups.

#### Basic Usage
```js
import { createStorage } from 'persistme';

// app 1
const MyAppStorage = createStorage('MY_AWESOME_APP');

MyAppStorage.set('user', 'Emad Alam');
MyAppStorage.get('user'); // Emad Alam

// app 2
const MyApp2Storage = createStorage('MY_AWESOME_APP2');

MyApp2Storage.set('user', 'Amina Dropic');
MyApp2Storage.get('user'); // Amina Dropic
```

#### Fallback Values
```js
import { createStorage } from 'persistme';

const defaults = {
    name: 'Emad Alam',
    addr: {
        street: 'X Street',
        city: 'Berlin'
    }
};

const MyAppStorage = createStorage('MY_AWESOME_APP', defaults);

MyAppStorage.get('user'); // Emad Alam
MyAppStorage.get('addr'); // {street: 'X Street', city: 'Berlin'}

MyApp2Storage.set('user', 'Amina Dropic');
MyApp2Storage.get('user'); // Amina Dropic
```

#### Update Existing Values
```js
import { createStorage } from 'persistme';

const defaults = {
    name: 'Emad Alam',
    addr: {
        street: 'X Street',
        city: 'Berlin'
    }
};

const MyAppStorage = createStorage('MY_AWESOME_APP', defaults);

MyAppStorage.get('addr'); // {street: 'X Street', city: 'Berlin'}

MyApp2Storage.update('addr', {country: 'DE'});
MyApp2Storage.get('addr'); // {street: 'X Street', city: 'Berlin', country: 'DE'}
```

#### Settings Factory
```js
import { createStorage, createSetting } from 'persistme';

const storage = createStorage('MY_AWESOME_APP');

// optional config to map settings with unique keys
const configs = {
    showSomething: 'mymodule.show.something',
    showSomethingElse: 'mymodule.show.somethingelse',
};
// default settings fallback values
const defaults = {
    showSomething: true,
    showSomethingElse: false,
};
// create settings proxy object
const UserSettings = createSetting({storage, defaults, configs});
// use like a normal object notation
UserSettings.showSomething // true
UserSettings.showSomethingElse // false
// set some settings
UserSettings.showSomethingElse = true;
// after app reload, etc
UserSettings.showSomethingElse // true
```

## API

#### Factories

#### `createStorage(appName, defaults)`: `Storage Instance`
Returns the storage instance that has methods for `set`, `get`, `update` and `remove` operations on the application specific `localStorage`.

| param  | type  | required | description |
| ------ | ----- | -------- | ----------- |
| `appName` | `String` | yes | Name of the storage |
| `defaults` | `Object` | optional | Map of fallback values |

#### `createSetting(options)`: `Proxy Object`
Returns the proxy object that can be used to retrieve data from a previously created, application `localStorage` using simple object dot notation.

| param  | type  | required | description |
| ------ | ----- | -------- | ----------- |
| `options` | `Object` |  | Options for the settings proxy (see below)
| `options.storage` | `Object` | yes | Storage object that implements the `get` and `set` methods. Ideally you would just pass the previously created storage instance returned by the `createStorage` factory. |
| `options.defaults` | `Object` | optional | Map of fallback values |
| `options.configs` | `Object` | optional | Map of key configurations that will be used by the storage API while generating the item key. Defaults to the key used by the settings object to access the data. |

#### Storage instance methods

#### `get(key)`: `Mixed`
Returns the app specific data stored for the given key, falls back to the default value if provided by the app specific `defaults` config map. Decompresses the data after retrieving from the `localStorage`.

| param  | type  | required | description |
| ------ | ----- | -------- | ----------- |
| `key` | `String` | yes | The item key |

#### `set(key, value)`
Stores the app specific data for the given key, compresses the data before storing in the `localStorage`.

| param  | type  | required | description |
| ------ | ----- | -------- | ----------- |
| `key` | `String` | yes | The item key |
| `value` | `Mixed` | yes | The data to store |

#### `update(key, value)`
Similar to `set` method, but extends (shallow merges) the original stored value if it is one of type array or object.

_Note: The data type of both stored as well as provided value should match in order for the update to work. Also the value should initially exist, otherwise the behavior is equivalent to `set` method._

| param  | type  | required | description |
| ------ | ----- | -------- | ----------- |
| `key` | `String` | yes | The item key |
| `value` | `Mixed` | yes | The data to update |

#### `remove(keys)`
Completely removes the given key(s) and the associated app specific data from the `localStorage`.

| param  | type  | required | description |
| ------ | ----- | -------- | ----------- |
| `keys` | `String`, `Array<String>` | yes | The item key(s) to remove |

#### `getKey(key)`: `String`
Returns the final namespaced property name that would be used in lieu of the given key for storing the app specific data in the `localStorage`.

| param  | type  | required | description |
| ------ | ----- | -------- | ----------- |
| `key` | `String` | yes | The actual item key |

#### LZString compression
The original [lz-string](https://github.com/pieroxy/lz-string) compression library instance is exported as `LZString`. Refer to the original [source docs](http://pieroxy.net/blog/pages/lz-string/index.html) for the available methods of the source library.

```js
import { LZString } from 'persistme';
// or, if including directly from script tag
// const LZString = persistme.LZString

const { compress, decompress } = LZString;

const str = 'I am a very huge string data...';
const compressedValue = compress(str); // compressed string

console.log(decompress(compressedValue)); // I am a very huge string data...
```

## Caveats
This library uses [`WeakMap`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/WeakMap) and [`Proxy`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Proxy) for its core implementations. If you plan to use this library on browsers that do not yet support these features, please also consider including polyfills for those browsers.

- [WeakMap polyfill](https://github.com/polygonplanet/weakmap-polyfill)
- [Proxy polyfill](https://github.com/GoogleChrome/proxy-polyfill)

## Who's using it
- [atvjs](https://github.com/emadalam/atvjs) - Blazing fast Apple TV application development using pure JavaScript
- [mesmerized](https://mesmerized.me/) - Transform your browser tabs

Built something cool using this? Submit a PR to add it to this section.

## Contributions
- Fork the project
- Commit your enhancements and bug fixes
- Create a pull request describing the changes

```shell
npm start       # run example apps
npm run dev     # watch changes
npm run build   # create library builds
npm run test    # run tests
```

## License
`persistme` is licensed under the [MIT License](https://opensource.org/licenses/MIT)
