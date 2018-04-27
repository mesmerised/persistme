import { isValid } from './utils';

/**
 * Returns the previously stored settings.
 * If no setting is present for the given key,
 * it returns the default value.
 *
 * @param  {String} key         The settings to get
 * @param  {Object} configs     The configuration object
 * @param  {Object} defaults    The default values
 * @return {Mixed}              The settings value, or default
 */
function getValue(storage, key, configs, defaults) {
    const val = storage.get(configs[key] || key);
    if (!isValid(val)) {
        return defaults[key];
    }
    return val;
}

/**
 * Stores the given settings in the appropriate key
 *
 * @param {String} key      The settings to store
 * @param {Mixed} value     The value to store
 * @param {Object} configs  The configuration object
 */
function setValue(storage, key, value, configs) {
    storage.set(configs[key] || key, value);
}

/**
 * Factory function to create a Settings proxy object
 * with getters and setters for persistent storage.
 *
 * Note: For the proxy to work as expected, make sure to
 * create `configs` and `defaults` objects with exact
 * keys to be able to return fallback values.
 *
 * @example
 * const storage = createStorage('myapp');
 * const configs = {
 *     showSomething: 'mymodule.show.something',
 *     showSomethingElse: 'mymodule.show.somethingelse',
 * };
 * const defaults = {
 *     showSomething: true,
 *     showSomethingElse: false,
 * };
 * const UserSettings = createSetting({storage, defaults, configs});
 *
 * UserSettings.showSomething // true
 * UserSettings.showSomethingElse // false
 * // set some settings
 * UserSettings.showSomethingElse = true;
 * // after app reload, etc
 * UserSettings.showSomethingElse // true
 *
 * @param  {Object} options.storage     The storage object that implements get/set
 * @param  {Object} options.defaults    Map of setting names and corresponding default values
 * @param  {Object} options.configs     Map of setting names and corresponding storage key
 * @return {Object}                     The settings proxy
 */
export default function createSetting(options = {}) {
    const { storage = {}, defaults = {}, configs = {} } = options;

    if (typeof storage.get !== 'function'
        || typeof storage.set !== 'function') {
        throw new TypeError('storage object should implement `get` and `set` methods.');
    }

    return new Proxy({}, {
        get(target, property) {
            return getValue(storage, property, configs, defaults);
        },
        set(target, property, value) {
            setValue(storage, property, value, configs);
            return true;
        },
    });
}
