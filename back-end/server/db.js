const sqlite3 = require('better-sqlite3')
const fs = require('node:fs')

/**
  * @typedef {Object} Itinerary
  * @property {string} id
  * @property {string} tripName
  * @property {Date | string} endDate
  * @property {Date | string} startDate
  * @property {unknown} startLocation
  * @property {unknown} endLocation
  * @property {unknown} transportation
  * @property {unknown} description
  */


class DBWrapper {
  constructor() {
    /** @type {sqlite3.Database}*/
    this.db = new sqlite3('records.db')

    this.saveItineraryStatement = this.db.prepare(`
      INSERT INTO itinerary (id, data) 
        values(?, jsonb(?));
    `)

    this.saveItineraryWithFileStatement = this.db.prepare(`
      INSERT INTO itinerary (id, data, path) 
        values(?, jsonb(?), ?);
    `)

    this.loadItineraryStatement = this.db.prepare(`
      select json(data) as outJSON, path 
        from itinerary 
        where id = ?;
    `)
  }

  /**
    * Takes in an Itinerary object and saves it to the database
    * @throws Throws if the object passed does not contain an ID.
    * @param {Itinerary} data 
    * @param {Buffer} [fileData]
    */
  async saveItinerary(data, fileData) {
    if (typeof data !== 'object') {
      throw Error('Incorrect type must pass in object')
    }
    if (data.id === undefined) {
      throw Error('Does not contain ID. Cannot save to DB')
    }

    /** NOTE: Not changing name because I don't know if it is important or not */
    if (fileData !== undefined) {
      this.saveItineraryWithFileStatement.run(data.id, data, fileData.name)
      fs.writeFileSync(fileData.name, fileData.toString())
    } else {
      this.saveItineraryStatement.run(data.id, data)
    }
  }

  /** 
    * @param {string} id - Takes whatever ID is 
    */
  loadItinerary(id) {
    const result = this.loadItineraryStatement.get(id)

    if (result.data == null) {
      throw Error('Data should not be null.')
    }

    // I am assuming this will return a string
    if (result.path !== undefined) {
      const file = fs.readFileSync(result.path)
      return { outJSON: result.data, outFile: file }
    } else {
      return { outJSON: result.data }
    }
  }
}

exports.db = new sqlite3('records.db')


