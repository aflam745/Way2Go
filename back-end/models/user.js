import { db } from '../server/db.js'

// Define the User model
const User = db.define("User", {
    username: { 
        type: DataTypes.STRING, 
        unique: true, 
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

// Create the table if it doesn't exist
await db.sync();

// Export the User model for use in other files
export default User;