import LZString from 'lz-string';
import merge from 'lodash.merge';
import { isValid } from './utils';

const { compress, decompress } = LZString;

const _options = new WeakMap(); // eslint-disable-line no-underscore-dangle

export default class Storage {
    /**
     * @constructor
     * @param {String} options.appName      Name of the application
     * @param {Object} options.defaults     Map of default values, if any
     */
    constructor(options = {}) {
        _options.set(this, options);
    }

    /**
     * Returns the final key used for storing the
     * value in the `localStorage`.
     *
     * @param  {String} key     Storage key
     * @return {String} The generated key name for the app
     */
    getKey(key) {
        const { appName } = _options.get(this);
        return `${appName}.${key}`;
    }

    /**
     * Sets a given key and value in the `localStorage`.
     * Uses lz-string compression before storage.
     *
     * @param {String} key  Storage key
     * @param {Mixed} val   Value to store
     */
    set(key, value) {
        const itemKey = this.getKey(key);
        try {
            const val = JSON.stringify(value);
            if (typeof val !== 'undefined') {
                localStorage.setItem(itemKey, compress(val));
            }
        } catch (ex) {
            console.warn(`something went wrong while trying to store value for ${key}.`, ex); // eslint-disable-line no-console
        }
    }

    /**
     * Retrieves the value from the `localStorage`.
     * Assumes that provided `set` method of the storage
     * was used to begin with, as the value is decompressed
     * using the lz-string compression.
     *
     * @param {String} key  Storage key
     * @return {Mixed}      Stored Value
     */
    get(key) {
        const itemKey = this.getKey(key);
        const item = localStorage.getItem(itemKey);

        // return default value
        if (!isValid(item)) {
            const { defaults = {} } = _options.get(this);
            return defaults[key];
        }

        const decompressedItem = decompress(item);
        let val;

        try {
            val = JSON.parse(decompressedItem);
        } catch (ex) {
            val = decompressedItem;
        }

        return val;
    }

    /**
     * Similar to `set` method, but extends (deep merge objects) the
     * original stored value if it is of type array or object.
     *
     * Note: The type of both stored as well as provided value
     * should match in order for the update to work. Also
     * the value should exist initially to begin with
     * Otherwise the behavior is equivalent to `set` method.
     *
     * @param {String} key  Storage key
     * @param {Mixed} value   Value to update
     */
    update(key, value) {
        const existingVal = this.get(key);

        // not present yet in storage, store
        if (!isValid(existingVal)) {
            this.set(key, value);
        } else if (Array.isArray(existingVal) && Array.isArray(value)) {
            // is an array, extend original and set
            this.set(key, [...existingVal, ...value]);
        } else if (typeof existingVal === 'object' && typeof val === 'object') {
            // is an object, extend original and set
            this.set(key, merge(existingVal, value));
        } else {
            // incompatible or other primitive values, use normal set
            this.set(key, value);
        }
    }

    /**
     * Removes the given key(s) from the storage.
     *
     * @param  {String|Array<String>} keys  Key(s) to remove from storage
     */
    remove(keys) {
        if (!Array.isArray(keys)) keys = [keys]; // eslint-disable-line no-param-reassign
        keys.forEach(k => localStorage.removeItem(this.getKey(k)));
    }
}
