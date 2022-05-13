const { businessColumnNames } = require('../db/db_config');
const db = require('../db/db_config');

class Businesses {
    /**
     * Searches for an exact beginning match on business name and address
     * @param {string} name - name of the business
     * @param {string} address = the business's address
     * @return {Business} - Business entries that match the query
     */
    static async search(name, address) {
        return db.get(`SELECT * FROM businesses WHERE ${db.businessColumnNames.businessName} LIKE "%${name}%" AND ${db.businessColumnNames.businessAddress} LIKE '%${address}%';`)
    }

    /**
     * Searches for an exact match on business name and address
     * @param {string} name - name of the business
     * @param {string} address = the business's address
     * @return {Business} - Business entries that match the query
     */
    static async getBusinessExact(name, address) {
        return db.get(`SELECT * FROM businesses WHERE ${db.businessColumnNames.businessName} == "${name}" AND ${db.businessColumnNames.businessAddress} == "${address}";`)
    }

    /**
     * Returns records for claimed businesses
     * @param {int} userId
     */
    static async getClaimedBusinesses(userId) {
        return db.all(`SELECT *, businesses.${db.businessColumnNames.businessId} as id FROM businesses
            JOIN businessOwners 
            ON businesses.${db.businessColumnNames.businessId} == businessOwners.${db.businessColumnNames.businessId} 
            AND businessOwners.${db.businessColumnNames.businessOwner} == ${userId} 
            LEFT JOIN businessProperties 
            ON businesses.${db.businessColumnNames.businessId} == businessProperties.${db.businessColumnNames.businessId}`)
    }

    /**
     * Searches for matches close enough to the query and given filter parameters 
     * @param {string} name - name of business to search for 
     * @param {string} address - address of business to search for 
     * @param {dictionary} filters extra criteria to filter businesses by 
     * @param {integer} userId - ID for the user currently signed in 
     */
    static async searchWithFilters(name, address, filters, userId) {
        let query = "";
        query += `SELECT businesses.${db.businessColumnNames.businessId} as id, businesses.*, businessProperties.*, businessOwners.${db.businessColumnNames.businessOwner}, 
                    businessOwners.${db.businessColumnNames.businessOwner} == ${userId} as ownsBusiness
            FROM businesses 
            LEFT JOIN businessProperties 
            ON businesses.${db.businessColumnNames.businessId} == businessProperties.${db.businessColumnNames.businessId} 
            LEFT JOIN businessOwners 
            ON businesses.${db.businessColumnNames.businessId} == businessOwners.${db.businessColumnNames.businessId}
        `;
        if (name) query += ` WHERE UPPER(businesses.${db.businessColumnNames.businessName}) LIKE UPPER("%${name}%") `;
        if (address) {
            if (name) query += ' AND ';
            else query += ' WHERE ';
            query += `UPPER(businesses.${db.businessColumnNames.businessAddress}) LIKE UPPER("%${address}%") `;
        }
        for (let f in filters) {
            if (filters[f] == 'true') {
                query += ` AND ${db.businessFiltersColumnNames[f]} == TRUE `;
            }
        }
        return db.all(query);
    }

    /**
     * Searches for a business by its id
     * @param {int} businessId - id of business
     * @return {Business} - Business entry that matches the query
     */
    static async getBusinessById(businessId) {
        return db.get(`SELECT * FROM businesses WHERE ${db.businessColumnNames.businessId} == ${businessId};`)
    }

    /**
     * Searches for a business by its id
     * @param {int} businessId - id of business
     * @return {Business} - Business entry that matches the query
     */
    static async getBusinessPropertiesById(businessId) {
        return db.get(`SELECT * FROM businessProperties WHERE ${db.businessColumnNames.businessId} == ${businessId};`)
    }

    /**
     * Finds all the favorited businesses of a user
     * @param {int} userId - A user's userId
     * @return {Businesses} - the user's starred businesses
     */
    static async getFavorite(userId) {
        return db.get(`SELECT * FROM favorites 
            JOIN businesses ON favorites.${db.userColumnNames.userFavorite} = businesses.${db.businessColumnNames.businessId}
            JOIN businessProperties ON businessProperties.${db.businessColumnNames.businessId}
            WHERE ${db.userColumnNames.userId} == ${userId};`);
    }

    /**
     * Checks whether a user likes a business
     * @param {int} userId - id of a user
     * @param {int} businessId - id of a business
     * @return {int, int | undefined} A record of whether the user with id userId likes the business with id businessId
     */
    static async checkStar(userId, businessId) {
        return db.get(`SELECT * FROM favorites WHERE ${db.userColumnNames.userId} == ${userId} AND ${db.userColumnNames.userFavorite} == ${businessId};`);
    }

    /**
     * Adds a business to the user's starred businesses
     * @param {int} userId - the user's id
     * @param {int} businessId - the business's id
     * @return {Favorites} - a record of the user's updated starred businesses
     */
    static async addStar(userId, businessId) {
        return db.run(`INSERT INTO favorites (${db.userColumnNames.userId}, ${db.userColumnNames.userFavorite}) VALUES (${userId}, ${businessId});`)
            .then(() => this.getFavorite(userId));
    }

    /**
     * Removes a business from the user's starred businesses
     * @param {int} userId - the user's id
     * @param {int} businessId - the business's id
     * @return {Favorites} - a record of the user's updated starred businesses
     */
    static async removeStar(userId, businessId) {
        return db.run(`DELETE FROM favorites WHERE ${db.userColumnNames.userId} == ${userId} AND ${db.userColumnNames.userFavorite} == ${businessId};`)
            .then(() => this.getFavorite(userId));
    }

    /**
     * Finds the claimee of a business, if any
     * @param {int} businessId - the business's id
     * @return {int, int | undefined} - record of the business's claimee
     */
    static async checkBusinessClaim(businessId) {
        return db.get(`SELECT * FROM businessOwners WHERE ${db.businessColumnNames.businessId} == ${businessId};`);
    }

    /**
     * Claims a business for a user
     * @param {int} userId - the user's id
     * @param {int} businessId - the business's id
     * @return {int, int | undefined} - record of the business's claimee
     */
    static async claimBusiness(userId, businessId) {
        return db.run(`INSERT into businessOwners (${db.businessColumnNames.businessOwner}, ${db.businessColumnNames.businessId}) VALUES (${userId}, ${businessId});`)
            .then(() => this.checkBusinessClaim(businessId));
    }

    /**
     * Updates the general information of a business 
     * @param {int} id
     * @param {Object} information 
     */
    static async updateInformation(id, information) {
        let setConditions = "";
        for (let c in information) {
            if ((information[c] + "").split(" ").join("") == "") information[c] = "";
            if (setConditions.length > 0) setConditions += ", ";
            setConditions += c + ` = "` + information[c] + `"`;
        }
        let query = `UPDATE businesses SET ` + setConditions + 
        ` WHERE businesses.${db.businessColumnNames.businessId} == ${id} `;
        return db.run(query)
            .then(() => {
                console.log("Successful update of general information.");
                return true;
            });
    }

    /**
     * Updates the safety information of a business 
     * @param {int} id
     * @param {Object} information 
     */
    static async updateSafety(id, information) {
        let biz = await db.all(`SELECT * FROM businessProperties WHERE ${db.businessColumnNames.businessId} == ${id}`);
        if (biz.length == 0) {
            // no result and must insert info into the table 
            let columns = "";
            let values = "";
            for (let c in information) {
                if ((information[c] + "").split(" ").join("") == "") information[c] = 0;
                if (columns.length > 0) columns += ", ";
                if (values.length > 0) values += ", ";
                columns += c;
                values += information[c];
            }
            let query = `INSERT INTO businessProperties 
                (${db.businessColumnNames.businessId}, `
            query += columns;
            query += `) VALUES (${id}, `;
            query += values;
            query += `)`;
            return db.run(query)
                .then(() => {
                    console.log("Successful update of safety information.");
                    return true;
                });
        }

        // otherwise can update the existing record 
        let setConditions = "";
        for (let c in information) {
            if ((information[c] + "").split(" ").join("") == "") information[c] = 0;
            if (setConditions.length > 0) setConditions += ", ";
            setConditions += c + ` = "` + information[c] + `"`;
        }
        let query = `UPDATE businessProperties SET ` + setConditions + 
        ` WHERE businessProperties.${db.businessColumnNames.businessId} == ${id} `;
        return db.run(query)
            .then(() => {
                console.log("Successful update of safety information.");
                return true;
            });
    }
    
    /**
     * Retrieve all reports corresponding to a business
     * @param {int} businessId - the business's id
     * @return {int, int | undefined} - record of the business's claimee
     */
    static async getReports(businessId) {
        return db.all(`SELECT * FROM reports WHERE ${db.messageColumnNames.reportedBusinessId} = ${businessId}`);
    }

}

module.exports = Businesses
