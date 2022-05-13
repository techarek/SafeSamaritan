const db = require('../db/db_config');
const constants = require('../constants');

class Messages {
    /**
     * Create a new notification
     * @param {string} recipients 
     * @param {string} messageContent
     * @param {int} authorId
     * @return true if successful
     */
    static async createNotification(recipients, messageContent, authorId) {
        // first insert the user into the db then fetch the user from the DB
        return db.run(`INSERT INTO notifications (${db.messageColumnNames.recipients}, ${db.messageColumnNames.messageContent}, ${db.messageColumnNames.authorId}) 
                        VALUES ('${recipients}', '${messageContent}', ${authorId})`)
            .then(() => true)
            .catch(() => false);
    }

    /**
     * Create a new request
     * @param {string} messageContent
     * @param {int} authorId
     * @param {int} businessId
     * @return true if successful
     */
    static async createRequest(messageContent, authorId, businessId) {
        // first insert the user into the db then fetch the user from the DB
        return db.run(`INSERT INTO requests (${db.messageColumnNames.messageContent}, ${db.messageColumnNames.requesterId}, ${db.messageColumnNames.requesterBusiness}) 
                        VALUES ('${messageContent}', ${authorId}, ${businessId})`)
            .then(() => true)
            .catch((e) => false);
    }

    /**
     * Create a new report
     * @param {string} messageContent
     * @param {int} businessId
     * @param {string} reporterType
     * @param {boolean} isMaskInfraction
     * @param {boolean} isSocialDistancing
     * @param {boolean} isOtherInfraction
     * @return true if successful
     */
    static async createReport(messageContent, businessId, reporterType, isMaskInfraction, isSocialDistancing, isOtherInfraction) {
        // first insert the user into the db then fetch the user from the DB
        return db.run(`INSERT INTO reports (${db.messageColumnNames.messageContent}, ${db.messageColumnNames.reportedBusinessId}, 
                                            ${db.messageColumnNames.reporterType}, ${db.messageColumnNames.reportMaskInfraction}, 
                                            ${db.messageColumnNames.reportSocialDistancing}, ${db.messageColumnNames.reportOtherInfraction}) 
                        VALUES ("${messageContent}", ${businessId}, "${reporterType}", ${isMaskInfraction}, 
                                ${isSocialDistancing}, ${isOtherInfraction})`)
            .then(() => true)
            .catch((e) => false);
    }

    /**
     * Get business matching `authorId`
     * @param {int} authorId
     */
    static async getBusinessByOwner(authorId) {
        // first insert the user into the db then fetch the user from the DB
        return db.get(`SELECT businessId FROM businessOwners
                        WHERE ${db.businessColumnNames.businessOwner} == ${authorId}`);
    }

    /**
     * Get business matching `name` and `address`
     * @param {string} name
     * @param {string} address
     */
    static async getBusinessByName(name, address) {
        // first insert the user into the db then fetch the user from the DB
        return db.get(`SELECT businessId FROM businesses
                        WHERE ${db.businessColumnNames.businessName} == '${name}' AND ${db.businessColumnNames.businessAddress} == '${address}'`);
    }

    /**
     * Get all messages for a user
     * @param {int} userType
     * @param {int} userId
     * 
     * Assumes recipient types to be of: 'businesses', 'all', and 'general'
     */
    static async getAllMessages(userType, userId) {
        // first insert the user into the db then fetch the user from the DB
        let results;
        switch("" + userType) {
            case constants.governmentType:
                results = db.all(`
                SELECT ${db.messageColumnNames.reportId}, ${db.messageColumnNames.messageContent}, ${db.messageColumnNames.messageDate}, ${db.messageColumnNames.reporterType}
                    FROM reports 
                UNION 
                SELECT ${db.messageColumnNames.requestId}, ${db.messageColumnNames.messageContent}, ${db.messageColumnNames.messageDate}, ${db.messageColumnNames.requesterId}
                    FROM requests 
                `);
            case constants.businessType:
                results = db.all(`
                SELECT ${db.messageColumnNames.notificationId}, ${db.messageColumnNames.messageContent}, ${db.messageColumnNames.messageDate}, notifications.${db.messageColumnNames.authorId}
                    FROM notifications, users 
                    WHERE (notifications.${db.messageColumnNames.authorId} == users.${db.userColumnNames.userId} AND users.${db.userColumnNames.userType} == 2 AND notifications.${db.messageColumnNames.recipients} != 'general')
                UNION 
                SELECT ${db.messageColumnNames.reportId}, ${db.messageColumnNames.messageContent}, ${db.messageColumnNames.messageDate}, ${db.messageColumnNames.reporterType}
                    FROM reports
                    WHERE (reports.${db.messageColumnNames.reportedBusinessId} == '${userId}')
                `);
            case constants.generalType:
                results = db.all(`
                SELECT ${db.messageColumnNames.notificationId}, ${db.messageColumnNames.messageContent}, ${db.messageColumnNames.messageDate}, notifications.${db.messageColumnNames.authorId}
                    FROM notifications, userNotifications
                    WHERE (userNotifications.${db.userColumnNames.userId} == '${userId}' AND notifications.${db.messageColumnNames.authorId} == userNotifications.${db.userColumnNames.userNotifiedBy})
                UNION 
                SELECT ${db.messageColumnNames.notificationId}, ${db.messageColumnNames.messageContent}, ${db.messageColumnNames.messageDate}, notifications.${db.messageColumnNames.authorId}
                    FROM notifications, users
                    WHERE (notifications.${db.messageColumnNames.authorId} == users.${db.userColumnNames.userId} AND users.${db.userColumnNames.userType} == ${db.userColumnNames.governmentAccount} AND notifications.${db.messageColumnNames.recipients} != 'businesses')`);
                break;
            default:
                console.log("Reached default case");
        }
        return results;
    }

    /**
     * Get all notifications for a user
     * @param {int} userType
     * @param {int} userId
     * 
     * Assumes recipient types to be of: 'businesses', 'all', and 'general'
     */
    static async getNotifications(userType, userId) {
        let results;
        switch("" + userType) {
            case constants.governmentType:
                break;
            case constants.businessType:
                results = db.all(`SELECT ${db.messageColumnNames.notificationId}, ${db.messageColumnNames.messageContent}, ${db.messageColumnNames.messageDate}, notifications.${db.messageColumnNames.authorId}
                FROM notifications, users 
                WHERE (notifications.${db.messageColumnNames.authorId} == users.${db.userColumnNames.userId} AND users.${db.userColumnNames.userType} == 2 AND notifications.${db.messageColumnNames.recipients} != 'general')`)
                break;
            case constants.generalType:
                results = db.all(`SELECT ${db.messageColumnNames.notificationId}, ${db.messageColumnNames.messageContent}, ${db.messageColumnNames.messageDate}, notifications.${db.messageColumnNames.authorId}
                FROM notifications, userNotifications
                WHERE (userNotifications.${db.userColumnNames.userId} == '${userId}' AND notifications.${db.messageColumnNames.authorId} == userNotifications.${db.userColumnNames.userNotifiedBy})
            UNION 
            SELECT ${db.messageColumnNames.notificationId}, ${db.messageColumnNames.messageContent}, ${db.messageColumnNames.messageDate}, notifications.${db.messageColumnNames.authorId}
                FROM notifications, users
                WHERE (notifications.${db.messageColumnNames.authorId} == users.${db.userColumnNames.userId} AND users.${db.userColumnNames.userType} == ${db.userColumnNames.governmentAccount} AND notifications.${db.messageColumnNames.recipients} != 'businesses')`)
                break;
            default:
                console.log("Reached default case");
        }
        return results;
    }

    /**
     * Get all reports for a user
     * @param {int} userType
     * @param {int} userId
     * 
     * Assumes recipient types to be of: 'businesses', 'all', and 'general'
     */
    static async getReports(userType, userId) {
        let results;
        switch("" + userType) {
            case constants.governmentType:
                results = db.all(`SELECT ${db.messageColumnNames.reportId}, ${db.messageColumnNames.messageContent}, ${db.messageColumnNames.messageDate}, ${db.messageColumnNames.reportedBusinessId}, ${db.messageColumnNames.reportMaskInfraction}, ${db.messageColumnNames.reportSocialDistancing}, ${db.messageColumnNames.reportOtherInfraction},
                ${db.businessColumnNames.businessName}, ${db.businessColumnNames.businessAddress}
                FROM reports, businesses WHERE ${db.messageColumnNames.reportedBusinessId} == ${db.businessColumnNames.businessId}`);
                break;
            case constants.businessType:
                results = db.all(`SELECT ${db.messageColumnNames.reportId}, ${db.messageColumnNames.messageContent}, ${db.messageColumnNames.messageDate}, ${db.messageColumnNames.reportedBusinessId}, ${db.messageColumnNames.reportMaskInfraction}, ${db.messageColumnNames.reportSocialDistancing}, ${db.messageColumnNames.reportOtherInfraction},
                ${db.businessColumnNames.businessName}, ${db.businessColumnNames.businessAddress}, ${db.businessColumnNames.businessOwner}
                FROM reports, businesses, businessOwners WHERE (${db.messageColumnNames.reportedBusinessId} == businesses.${db.businessColumnNames.businessId} AND ${db.businessColumnNames.businessOwner} == '${userId}')`);
                break;
            case constants.generalType:
                break;
            default:
                console.log("Reached default case");
        }
        return results;
    }

    /**
     * Get all requests for a user
     * @param {int} userType
     * @param {int} userId
     * 
     * Assumes recipient types to be of: 'businesses', 'all', and 'general'
     */
    static async getRequests(userType, userId) {
        let results;
        switch("" + userType) {
            case constants.governmentType:
                results = db.all(`SELECT ${db.messageColumnNames.requestId}, ${db.messageColumnNames.messageContent}, ${db.messageColumnNames.messageDate}, ${db.messageColumnNames.requesterId}, ${db.businessColumnNames.businessName}, ${db.businessColumnNames.businessAddress}, ${db.businessColumnNames.businessId}
                FROM requests, businesses WHERE ${db.messageColumnNames.requesterId} == ${db.businessColumnNames.businessId}`);
                break;
            case constants.businessType:
                break;
            case constants.generalType:
                break;
            default:
                console.log("Reached default case");
        }
        return results;
    }

    /**
     * Removes a request
     * @param {int} requestId 
     * @return {boolean} whether deletion was successful
     */
    static async resolveRequest(requestId) {
        return db.run(`DELETE FROM requests WHERE requestId == ${requestId}`)
            .then(() => true)
            .catch((e) => false);
    }

    /**
     * Removes a report
     * @param {int} reportId 
     * @return {boolean} whether deletion was successful
     */
    static async resolveReport(reportId) {
        return db.run(`DELETE FROM reports WHERE reportId == ${reportId}`)
            .then(() => true)
            .catch((e) => false);
    }

    /**
     * Get notifications from a business
     * @param {int} userId 
     * @param {int} businessId 
     * @return {boolean} whether addition was successful
     */
    static async addNotification(userId, businessId) {
        return db.run(`INSERT INTO userNotifications (userId, userNotifiedBy) VALUES (${userId}, ${businessId});`)
            .then(() => true)
            .catch((e) => false);
    }

    /**
     * Remove notifications from a business
     * @param {int} userId 
     * @param {int} businessId 
     * @return {boolean} whether removal was successful
     */
    static async removeNotification(userId, businessId) {
        return db.run(`DELETE FROM userNotifications where userId == ${userId} AND userNotifiedBy == ${businessId};`)
            .then(() => true)
            .catch((e) => false);
    }

    /**
     * Check whether user gets notifications from a business
     * @param {int} userId 
     * @param {int} businessId 
     * @return {boolean}
     */
    static async checkNotification(userId, businessId) {
        return db.get(`SELECT * FROM userNotifications where userId == ${userId} AND userNotifiedBy == ${businessId}`);
    }

}

module.exports = Messages;