const fs = require('node:fs')

const { Sequelize, DataTypes } = require('sequelize')

/**
  * @typedef {Object} Itinerary
  * @property {string} id
  * @property {string} tripName
  * @property {Date | string} endDate
  * @property {Date | string} startDate
  * @property {Location} startLocation
  * @property {Location} endLocation
  * @property {unknown} transportation
  * @property {unknown} description
  */


/**
  * @typedef {Object} Location
  * @property {number} lon
  * @property {number} lat
  * @property {string} address
  */

const db = new Sequelize({ dialect: 'sqlite', storage: 'records.db' })

const itineraryModel = db.define('itinerary', {
  id: { primaryKey: true, type: DataTypes.STRING },
  tripName: { type: DataTypes.STRING, allowNull: false },
  startDate: { type: DataTypes.STRING, allowNull: false },
  endDate: { type: DataTypes.STRING, allowNull: false },
  startLocationID: { type: DataTypes.INTEGER, unique: true, allowNull: false },
  endLocationID: { type: DataTypes.INTEGER, unique: true, allowNull: false },
  description: { type: DataTypes.STRING, allowNull: false },
  imagePath: { type: DataTypes.STRING, allowNull: true }
})

// TODO: Figure out foreign key nonsense later
const locationModel = db.define('location', {
  lon: DataTypes.FLOAT,
  lat: DataTypes.FLOAT,
  address: DataTypes.STRING,
  id: {
    type: DataTypes.STRING,
    primaryKey: true,
    autoIncrement: true,
    references: { model: itineraryModel, key: 'id' }
  }
})

/**
  * @property {Itinerary} itinerary
  * @property {string} [imagePath]
  */
async function saveItinerary(itinerary, imagePath) {
  const sif = await locationModel.create({ lon: itinerary.startLocation.lon, lat: itinerary.startLocation.lat, address: itinerary.startLocation.address })
  const eif = await locationModel.create({ lon: itinerary.endLocation.lon, lat: itinerary.endLocation.lat, address: itinerary.endLocation.address })


  itineraryModel.create(
    {
      id: itinerary.id,
      tripName: itinerary.tripName,
      startDate: itinerary.startDate.toString(),
      endDate: itinerary.endDate.toString(),
      startLocationID: sif.id, // NOTE: Does this work?
      endLocationID: eif.id,
      description: itinerary.description,
      imagePath: imagePath ?? null
    }
  )
}

/** 
  * @property {string} id
  */
async function loadItinerary(id) {

  /** 
    * WARNING: This query may blow up and 
    * return the wrong type I don't know
    * if it returns the right thing yet
    *
    * @type {Itinerary} 
    */
  const result = await db.query(`
    select id, tripName, startDate, endDate, l1 as startLocation, l2 as endLocation, description, imagePath
      from itinerary
      join location as l1 on l1.id = itinerary.startLocationID
      join location as l2 on l2.id = itinerary.endLocationID
      where id = ?
  `, { raw: true, replacements: { id: id } })

  const path = result.imagePath

  if (path != null) {
    // WARNING: I hope this doesn't throw
    const file = fs.readFileSync(path)

    return { file, itinerary: result }
  }

  return { itinerary: result }
}


exports.db = new sqlite3('records.db')
exports.loadItinerary = loadItinerary
exports.saveItinerary = saveItinerary

