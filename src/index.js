import Storage from './storage';

/**
 * Creates a namespaced storage that can be used
 * to get/set/update values in the `localStorage`.
 *
 * @example
 * const defaults = {
 *  name: 'Emad Alam',
 *  addr: {
 *   street: 'X Street',
 *   city: 'Berlin'
 *  }
 * };
 * const MyStorage = createStorage('MY_APP', defaults);
 *
 * // fallbacks on first launch
 * MyStorage.get('name'); // Emad Alam
 * MyStorage.get('addr'); // {street: 'X Street', city: 'Berlin'}
 * // set some data
 * MyStorage.set('name', 'Amina');
 * MyStorage.update('addr', {country: 'DE'});
 * // after app reload, etc
 * MyStorage.get('name'); // Amina
 * MyStorage.get('addr'); // {street: 'X Street', city: 'Berlin', country: 'DE'}
 *
 * @param {String} appName      Name of the app
 * @param {Object} [defaults]   Map of default fallback values
 */
export function createStorage(appName, defaults) {
    if (typeof appName === 'undefined') {
        throw new TypeError('`appName` is required to initialize the storage');
    }
    if (typeof appName !== 'string') {
        throw new TypeError('`appName` should be a string');
    }

    return new Storage({ appName, defaults });
}

// export settings factory
export { default as createSetting } from './settings.factory';

// export the LZString compression library
export { default as LZString } from 'lz-string';
