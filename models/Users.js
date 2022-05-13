const db = require('../db/db_config');

class Users {
    /**
     * Create a new user entry
     * @param {string} username - name of User to find
     * @return {User} - created User entry
     */
    static async createUserEntry(username, password, email, userType, accountPending) {
        // first insert the user into the db then fetch the user from the DB
        return db.run(`INSERT INTO users (${db.userColumnNames.username}, ${db.userColumnNames.password}, ${db.userColumnNames.email}, ${db.userColumnNames.userType}, ${db.userColumnNames.accountPending}) VALUES ('${username}', '${password}', '${email}', ${userType}, ${accountPending})`)
            .then(() => Users.usernameToEntry(username));
      }

    /**
     * Find the entry corresponding to a username.
     * @param {string} username - name of User to find
     * @return {User | undefined} - found User entry
     */
    static async usernameToEntry(username) {
        return db.get(`SELECT * FROM users WHERE ${db.userColumnNames.username} = '${username}'`);
    }

    /**
     * Find the entry corresponding to a ID.
     * @param {string} id - id of User to find
     * @return {User | undefined} - found User entry
     */
    static async idToEntry(id) {
        return db.get(`SELECT * FROM users WHERE ${db.userColumnNames.userId} = '${id}'`);
    }

    /**
     * Find the entry corresponding to an email.
     * @param {string} email - email of User to find
     * @return {User | undefined} - found User entry
     */
    static async emailToEntry(email) {
        return db.get(`SELECT * FROM users WHERE ${db.userColumnNames.email} = '${email}'`);
    }

    /**
     * Change the password corresponding to a user ID
     * @param {Number} userID - ID of user to change
     * @param {string} password - password to change into
     * @return {User | undefined} - changed User entry
     */
    static async changePassword(userID, password) {
        return db.run(`UPDATE users SET ${db.userColumnNames.password} = '${password}' WHERE ${db.userColumnNames.userId} = ${userID}`)
            .then(() => Users.idToEntry(userID));
    }

    /**
     * Change the username corresponding to a user ID
     * @param {Number} userID - ID of user to change
     * @param {string} username - username to change into
     * @return {User | undefined} - changed User entry
     */
    static async changeUsername(userID, username) {
        return db.run(`UPDATE users SET ${db.userColumnNames.username} = '${username}' WHERE ${db.userColumnNames.userId} = ${userID}`)
            .then(() => Users.idToEntry(userID));
    }

    /**
     * Delete the entry corresponding to a username
     * @param {string} username - username to delete
     * @return {User | undefined} - result of searching for username again
     */
    static async deleteUsername(username) {
        return db.run(`DELETE FROM users WHERE ${db.userColumnNames.username} = '${username}'`)
            .then(() => Users.usernameToEntry(username));
    }
}

module.exports = Users