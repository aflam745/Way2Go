import { Sequelize, DataTypes } from '@sequelize/core';
import { SqliteDialect } from '@sequelize/sqlite3';
//import { sequelize } from '../server/db.js'

//Might remove this if defined in db.js
const sequelize = new Sequelize( {
    dialect: SqliteDialect,
    storage: 'authentication.sqlite'
});

// Define the User model
const User = sequelize.define("User", {
    username: { 
        type: DataTypes.STRING, 
        unique: true, 
        allowNull: false, 
        validate: {
            notNull: {msg: `Username is required.`},
            notEmpty: {msg: `Username cannot be empty.`}
        } 
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            isEmail: {msg: `Invalid email format.`},
            notNull: {msg: `Email is required`},
            notEmpty: {msg: `Email cannot be empty`}
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
    role: { 
        type: DataTypes.STRING, 
        defaultValue: "user",
    },
});

// Create the table if it doesn't exist
await sequelize.sync();

// Export the User model for use in other files
export default User;