const fs = require('node:fs')
const { Sequelize, DataTypes, QueryTypes } = require('sequelize')
const sqlite3 = require('sqlite3')

exports.db = new sqlite3.Database('records.db')

/**
  * @typedef {Object} Itinerary
  * @property {string} id
  * @property {string} tripName
  * @property {Date | string} endDate
  * @property {Date | string} startDate
  * @property {Location} startLocation
  * @property {Location} endLocation
  * @property {unknown} transportation
  * @property {string} description
  * @property {string} [userId]
  *
  * @typedef {Object} Location
  * @property {number} lon
  * @property {number} lat
  * @property {string} address
  *
  * @typedef {Object} ItineraryResult
  * @property {string} data
  * @property {string} imagePath
  */

const db = new Sequelize({ dialect: 'sqlite', storage: 'records.db' })

const itineraryModel = db.define('itinerary', {
    id: { primaryKey: true, type: DataTypes.STRING },
    data: { allowNull: false, type: DataTypes.STRING },
    imagePath: DataTypes.STRING,
}, { freezeTableName: true }
)

const ActivityModel = db.define('activity', {
    id: { type: DataTypes.STRING, primaryKey: true },
    itineraryId: { type: DataTypes.STRING, allowNull: false },
    data: { allowNull: false, type: DataTypes.STRING }
}, { freezeTableName: true }
)

// Define the User model
const User = db.define("User", {
    username: { 
        type: DataTypes.STRING, 
        unique: false,
        allowNull: false, 
        validate: {
            notNull: {msg: `Username is required.`},
            notEmpty: {msg: `Username cannot be empty.`}
        } 
    },
    googleId: { 
        type: DataTypes.STRING,
        unique: true,
        allowNull: false,
        validate: {
            notNull: {msg: `Google ID is required.`},
            notEmpty: {msg: `Google ID cannot be empty`},
        }
    },
});


async function initializeDatabase() {
    try {
        await db.authenticate();
        console.log('Connection established.');
        await db.sync();
        console.log('Database synchronized.');
    } catch (error) {
        console.error('Error initializing the database:', error);
    }
}

initializeDatabase()


/**
  * @param {Itinerary} itinerary - Instance of the Itinerary Object
  * @param {string} [imagePath] - Path of the image
  *
  * Saves the itinerary as a JSON String to the database
  */
async function saveItinerary(itinerary, imagePath) {
    console.log("here with itinerary:", itinerary)
    return await db.query(
        `insert into itinerary values(?, json(?), ?, ?, ?)`,
        { raw: true, replacements: [itinerary.id, JSON.stringify(itinerary), imagePath ?? null, new Date(), new Date()], type: QueryTypes.INSERT }
    )
}

async function saveActivity(activity) {
    return await db.query(
        `insert into activity values(?, json(?), ?, ?)`,
        { raw: true, replacements: [activity.id, JSON.stringify(activity), null, new Date(), new Date()], type: QueryTypes.INSERT }
    )
}

/**
  * @param {number} itineraryId - ID of an Itinerary Object
  *
  * Deletes the itinerary and its associated activities from the database.
  * Also deletes the associated image file if it exists.
  */
async function deleteItinerary(itineraryId) {
  const transaction = await db.transaction()
  try {
    // Find the itinerary by primary key
    const itinerary = await itineraryModel.findByPk(itineraryId, { transaction })

    if (!itinerary) {
      throw new Error(`Itinerary with ID ${itineraryId} not found.`)
    }

    // If there is an imagePath, attempt to delete the image file
    if (itinerary.imagePath) {
      fs.unlink(itinerary.imagePath, (err) => {
        if (err && err.code !== 'ENOENT') { // Ignore file not found errors
          console.error(`Failed to delete image at ${itinerary.imagePath}:`, err)
        }
      })
    }

    // Delete all associated activities
    await ActivityModel.destroy({
      where: { itineraryId },
      transaction
    })

    // Delete the itinerary
    await itinerary.destroy({ transaction })

    await transaction.commit()
    console.log(`Itinerary with ID ${itineraryId} and its activities have been deleted.`)
  } catch (error) {
    // Rollback the transaction in case of error
    await transaction.rollback()
    console.error(`Failed to delete itinerary with ID ${itineraryId}:`, error)
    throw error
  }
}

/**
  * @param {number} activityId - ID of an Activity Object
  *
  * Deletes the activity from the database.
  */
async function deleteActivity(activityId) {
  const transaction = await db.transaction();

  try {
    // Find the activity by primary key
    const activity = await ActivityModel.findByPk(activityId, { transaction })

    if (!activity) {
      throw new Error(`Activity with ID ${activityId} not found.`)
    }

    await activity.destroy({ transaction })

    await transaction.commit()
    console.log(`Activity with ID ${activityId} has been deleted.`)
  } catch (error) {
    // Rollback the transaction in case of error
    await transaction.rollback()
    console.error(`Failed to delete activity with ID ${activityId}:`, error)
    throw error
  }
}

/**
  * @param {string} id
  *
  * Retrieves the itinerary as a JSON string from the database
  */
async function loadItinerary(id) {


    /** 
      * WARNING: This query may blow up and 
      * return the wrong type I don't know
      * if it returns the right thing yet
      
      * @type {ItineraryResult}
      */
    const result = await db.query(`
    select data, imagePath from itinerary where id = ? limit 1
  `, { raw: true, replacements: { id: id }, type: QueryTypes.SELECT })

    const path = result.imagePath
    if (path != null) {
        // WARNING: I hope this doesn't throw
        const file = fs.readFileSync(path)

        return { file, itinerary: result.data }
    }

    return { itinerary: result.data }
}

// WARNING: I do not know the complete shapre of what this will return
async function loadItineraryWithActivities(id) {
    let tx;
    try {
        tx = await db.transaction();

        // Retrieve itinerary
        const itineraryResult = await db.query(
            `select data, imagePath from itinerary where id = ? limit 1`,
            {
                raw: true,
                replacements: [id], // Use positional replacement
                transaction: tx,
                type: QueryTypes.SELECT,
            }
        );

        // Extract the first result, if it exists
        const itinerary = itineraryResult.length > 0 ? itineraryResult[0] : null;

        if (!itinerary) {
            throw new Error(`No itinerary found with id: ${id}`);
        }

        // Retrieve activities for the itinerary
        const activityResults = await db.query(
            `select data from activity where itineraryId = ?`,
            {
                raw: true,
                replacements: [id], // Use positional replacement
                transaction: tx,
                type: QueryTypes.SELECT,
            }
        );

        // Commit the transaction
        await tx.commit();

        console.log(itinerary);
        console.log(activityResults);

        return { itinerary, activities: activityResults };
    } catch (error) {
        if (tx) await tx.rollback();
        console.error('Error loading itinerary with activities:', error);
        throw error;
    }
}



/**
  * WARNING: This function is untested may blow up
  *
  * @param {Activity[]} activites
  */
async function saveActivities(activites) {
  const date = new Date(); // date for createdAt/updatedAt fields
  const a = activites.map(arr => [a.id, a.itineraryId, JSON.stringify(a)], date, date)
  const result = await db.query(`insert into activity values ${data.map(a => '(?)').join(',')}`, {
    replacements: a
  })
  return
}

// export function loadItineraries(userId) {
  
// }

exports.loadItinerary = loadItinerary
exports.saveItinerary = saveItinerary
exports.saveActivity = saveActivity
exports.saveActivities = saveActivities
exports.loadItineraryWithActivities = loadItineraryWithActivities
exports.deleteItinerary = deleteItinerary
exports.deleteActivity = deleteActivity
