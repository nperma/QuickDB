/**
# QuickDB
* Need Handle Priviellage
*/

import { world } from "@minecraft/server";

export class QuickDB {
    /** @type {string} */
    static DATABASE_PREFIX = "\u0235\u0235";
    /** @private */
    #identifier;
    /** @type {Record<string, any>} */
    __cache;

    constructor(id) {
        if (typeof id !== "string" || !id.trim()) {
            throw new Error("Invalid database ID");
        }
        this.#identifier = `${this.DATABASE_PREFIX}${id}${this.DATABASE_PREFIX}`;
        this.__cache = {};

        let ids = this.getIds(),
            i = ids.length;
        while (i--) {
            const key = ids[i];
            let value = world.getDynamicProperty(key);
            value = typeof value == "string" && value.startsWith("obj") ? JSON.parse(value.slice(3)) : value;
            this.__cache[key.slice(this.#identifier.length)] = value;
        }
    }

    /** @param {string} id @returns {QuickDB} */
    static get(id) {
      return new QuickDB(id);
    }

   /** @returns {number} */
    get size() {
        return this.keys().length;
    }

    /** @returns {string[]} */
    keys() {
        return Object.keys(this.__cache);
    }

   /** @returns {any[]} */
    values() {
        return Object.values(this.__cache);
    }

   /** @returns {[string,any][]} */
    entries() {
        return Object.entries(this.__cache);
    }

   /** @param {string} key @param {any} value @returns {void} */
    set(key, value) {
        if (typeof key !== "string" || !key.trim()) throw new Error("Key must be a non-empty string");
        const val = typeof value === "object" ? "obj" + JSON.stringify(value) : value;
        world.setDynamicProperty(this.#identifier + key, val);
        this.__cache[key] = value;
    }

  /** @param {string} key @returns {boolean} */
    delete(key) {
        if (!this.has(key)) return false;
        world.setDynamicProperty(this.#identifier + key);
        delete this.__cache[key];
        return true;
    }

    /** @param {string} @returns {any} */
    get(key) {
        if (typeof key !== "string" || !key.trim()) throw new Error("Key must be a non-empty string");
        return this.__cache[key];
    }

   /** @param {string} key @returns {boolean} */
    has(key) {
        return key in this.__cache;
    }

   /** @returns {string[]} */
    getIds() {
        const identifiers = world.getDynamicPropertyIds(),
            result = [];
        let index = identifiers.length;

        while (index--) {
            if (!identifiers[index].startsWith(this.#identifier)) continue;
            result.push(identifiers[index]);
        }
        return result;
    }

    clear() {
        let keys = this.keys(),
            i = keys.length;
        while (i--) this.delete(keys[i]);
        this.__cache = {};
    }
}
