const express = require("express");
const router = express.Router();
const Messages = require("../models/Messages");
const Users = require("../models/Users");
const Businesses = require("../models/Businesses");
const validate = require('./validators');
const constants = require("../constants");

/**
 * Resolve a report
 * 
 * @name POST /api/messages/report/resolve
 */
router.post(
    '/report/resolve',
    [
        validate.userLoggedIn,
    ],
    async (req, res) => {
        try {
            let user = await Users.usernameToEntry(req.session.username);
            let userType = user["userType"];
            if (userType != constants.governmentType) {
                res.status(401).json({ error: "Invalid account type. Must be a government account." }).end();
                return;
            }
            result = await Messages.resolveReport(req.body.reportId);
            res.status(200).json({ message: `Report resolved: ${result}` }).end();
        } catch (error) {
            console.log('error: ' + error);
            res.status(500).json({ error: "Could not resolve report." }).end();
        }
    }
);

/**
 * Resolve a request
 * 
 * @name POST /api/messages/request/resolve
 */
router.post(
    '/request/resolve',
    [
        validate.userLoggedIn,
    ],
    async (req, res) => {
        try {
            let user = await Users.usernameToEntry(req.session.username);
            let userType = user["userType"];
            if (userType != constants.governmentType) {
                res.status(401).json({ error: "Invalid account type. Must be a government account." }).end();
                return;
            }
            let result = await Messages.resolveRequest(req.body.requestId);
            res.status(200).json({ message: `Request resolved: ${result}` }).end();
        } catch (error) {
            console.log('error: ' + error);
            res.status(500).json({ error: "Could not resolve request." }).end();
        }
    }
);


/**
 * Create a new notification post
 * 
 * @name POST /api/messages/notification
 */
router.post(
    '/notification',
    [
        validate.userLoggedIn
    ],
    async (req, res) => {
        try {
            // check if user already exists
            let { to, message } = req.body;
            if (isEmpty(to) || isEmpty(message)) {
                res.status(400).json({ error: "Missing information needed to send the notification." }).end();
                return;
            }
            // create user entry
            let user = await Users.usernameToEntry(req.session.username);
            if (user.userType == constants.generalType) {
                res.status(401).json({ error: "You are not authorized to send a notification." }).end();
                return;
            }
            await Messages.createNotification(to, message, user.userId);
            res.status(201).json({ message: "Notification created!" }).end();
        } catch (error) {
            console.log('error: ' + error);
            res.status(500).json({ error: "Could not create notification." }).end();
        }
    }
);

/**
 * Check current user's notification settings
 * 
 * @name POST /api/messages/notification/settings
 */
router.post(
    '/notification/settings',
    [
        validate.userLoggedIn
    ],
    async (req, res) => {
        try {
            // Retrieves User
            let user = await Users.usernameToEntry(req.session.username);
            let userId = user["userId"];
            // Retrieves business
            let business = await Businesses.getBusinessExact(req.body.businessName, req.body.address);
            let businessId = business["businessId"];
            if (!business) {
                res.status(404).json({ error: "Business does not exist." }).end();
                return;
            }
            console.log("here");
            // Checks if User already gets notifications
            notifs = await Messages.checkNotification(userId, businessId);
            if (notifs) {
                res.status(200).json({ data: notifs, message: `Notifications checked` }).end();
            } else {
                res.status(200).json({ data: notifs, message: `Notifications checked` }).end();
            }

        } catch (error) {
            res.status(500).json({ error: "Could not get notification settings. " }).end();
        }
    }
);

/**
 * Update current user's notification settings (are they following or not following this business's notifications)
 * 
 * @name POST /api/messages/notification/update
 */
router.post(
    '/notification/update',
    [
        validate.userLoggedIn
    ],
    async (req, res) => {
        try {
            // Retrieves User
            let user = await Users.usernameToEntry(req.session.username);
            let userId = user["userId"];
            // Retrieves business
            let business = await Businesses.getBusinessExact(req.body.businessName, req.body.address);
            let businessId = business["businessId"];
            if (!business) {
                res.status(404).json({ error: "Business does not exist." }).end();
                return;
            }

            notifs = await Messages.checkNotification(userId, businessId);
            console.log(notifs);
            if (notifs) {
                Messages.removeNotification(userId, businessId);
            } else {
                Messages.addNotification(userId, businessId);
            }

            res.status(200).json({ data: !notifs, message: `Notifications have been ${notifs? "removed": "added"}` }).end();

        } catch (error) {
            res.status(500).json({ error: "Could not update notification settings. " }).end();

        }
    }
);

/**
 * Create a new request 
 * 
 * @name POST /api/messages/request
 */
router.post(
    '/request',
    [
        validate.userLoggedIn,
    ],
    async (req, res) => {
        try {
            // check if user already exists
            let { message } = req.body;
            if (isEmpty(message)) {
                res.status(400).json({ error: "Missing information needed to send the request." }).end();
                return;
            }
            // create user entry
            let user = await Users.usernameToEntry(req.session.username);
            if (user.userType != constants.businessType) {
                res.status(403).json({ error: "You are not authorized to send a request." }).end();
                return;
            }
            let business = await Messages.getBusinessByOwner(user.userId);
            business = {businessId: 1};
            if (!business) {
                res.status(403).json({ error: "You need to claim a business before submitting a request." }).end();
                return;
            }
            let success = await Messages.createRequest(message, user.userId, business.businessId);
            if (success) {
                res.status(201).json({ message: "Request created!" }).end();
            } else {
                res.status(500).json({ error: "Sorry, could not create request." }).end();
            }
        } catch (error) {
            console.log('error: ' + error);
            res.status(500).json({ error: "Could not create request." }).end();
        }
    }
);

/**
 * Create a new report 
 * 
 * @name POST /api/messages/report
 */
router.post(
    '/report',
    [
        validate.userLoggedIn,
    ],
    async (req, res) => {
        try {
            // check if user already exists
            let { message, type, businessName, businessAddress } = req.body;
            if (isEmpty(message) || isEmpty(businessName) || isEmpty(businessAddress)) {
                res.status(400).json({ error: "Missing information needed to send the report." }).end();
                return;
            }
            // create user entry
            let user = await Users.usernameToEntry(req.session.username);
            let reporterType = "";
            switch (user.userType) {
                case 2:
                    reporterType = "GOV";
                    break;
                case 1:
                    res.status(403).json({ error: "You cannot use a business account to send a report." }).end();
                    return;
                case 0:
                    reporterType = "PUB";
                    break;
                default:
                    res.status(400).json({ error: "Invalid account type." }).end();
                    return;
            }
            let isMaskInfraction = false;
            let isSocialDistancing = false;
            let isOtherInfraction = false;
            switch(type) {
                case "maskInfraction": 
                    isMaskInfraction = true;
                    break;
                case "socialDistancing": 
                    isSocialDistancing = true;
                    break;
                default: 
                    isOtherInfraction = true;
                    break;
            }
            let business = await Businesses.getBusinessExact(businessName, businessAddress);
            if (!business) {
                res.status(404).json({ error: "Could not find the business you want to report." }).end();
                return;
            }
            
            console.log(business);

            let success = await Messages.createReport(message, business.businessId, reporterType, isMaskInfraction, isSocialDistancing, isOtherInfraction);
            if (success) {
                res.status(201).json({ message: "Report created!" }).end();
            } else {
                res.status(500).json({ error: "Sorry, could not create report." }).end();
            }
        } catch (error) {
            console.log('error: ' + error);
            res.status(500).json({ error: "Could not create report." }).end();
        }
    }
);

/**
 * Get all messages sent to user
 * 
 * @name GET /api/messages/
 */
router.get(
    '/',
    [
        validate.userLoggedIn,
    ],
    async (req, res) => {
        try {
            let user = await Users.usernameToEntry(req.session.username);
            let { userId, userType } = user;
            
            let messages = await Messages.getAllMessages(userType, userId);
            res.status(201).json({ message: messages }).end();
        } catch (error) {
            console.log('error: ' + error);
            res.status(500).json({ error: "Could not get messages." }).end();
        }
    }
);

/**
 * Get all notifications sent to user
 * 
 * @name GET /api/messages/notifications
 */
router.get(
    '/notifications',
    [
        validate.userLoggedIn,
    ],
    async (req, res) => {
        try {
            let user = await Users.usernameToEntry(req.session.username);
            let { userId, userType } = user;
            
            let messages = await Messages.getNotifications(userType, userId);
            res.status(201).json({ message: messages }).end();
        } catch (error) {
            console.log('error: ' + error);
            res.status(500).json({ error: "Could not get notifications." }).end();
        }
    }
);

/**
 * Get all reports sent to user
 * 
 * @name GET /api/messages/reports
 */
router.get(
    '/reports',
    [
        validate.userLoggedIn,
    ],
    async (req, res) => {
        try {
            let user = await Users.usernameToEntry(req.session.username);
            let { userId, userType } = user;
            
            let messages = await Messages.getReports(userType, userId);
            res.status(201).json({ message: messages }).end();
        } catch (error) {
            console.log('error: ' + error);
            res.status(500).json({ error: "Could not get messages." }).end();
        }
    }
);

/**
 * Get all requests sent to user
 * 
 * @name GET /api/messages/requests
 */
router.get(
    '/requests',
    [
        validate.userLoggedIn,
    ],
    async (req, res) => {
        try {
            let user = await Users.usernameToEntry(req.session.username);
            let { userId, userType } = user;
            
            let messages = await Messages.getRequests(userType, userId);
            res.status(201).json({ message: messages }).end();
        } catch (error) {
            console.log('error: ' + error);
            res.status(500).json({ error: "Could not get messages." }).end();
        }
    }
);



const isEmpty = (s) => {
    return !s || s.split(" ").join("") == "";
};

module.exports = router;