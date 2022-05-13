const db = require('../db/db_config');
const constants = require('../constants');
const Users = require("../models/Users");

// Session Verification

const userNotLoggedIn = function(req, res, next) {
    if (req.session.username) {
        res.status(403).json({ error: "You are already signed in!" }).end();
        return;
    }
    next();
};

const userLoggedIn = function(req, res, next) {
    if (!req.session.username) {
        res.status(401).json({ error: "You are not signed in!" }).end();
        return;
    }
    next();
};

// Request Body Verification

const validUsername = function(req, res, next) {
    if (!req.body.username) {
        res.status(400).json({ error: "Username must be nonempty" }).end();
        return;
    }
    next();
};

const validPassword = function(req, res, next) {
    if (!req.body.password) {
        res.status(400).json({ error: "Password must be nonempty" }).end();
        return;
    }
    next();
};

const validVerifiedPassword = function(req, res, next) {
    if (req.body.verifiedPassword !== req.body.password) {
        res.status(400).json({ error: "Passwords do not match." }).end();
        return;
    }
    next();
};

const validEmail = function(req, res, next) {
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(req.body.emailAddress)) {
        res.status(400).json({ error: "Please enter a valid email address" }).end();
        return;
    }
    next();
};

const validAccountType = function(req, res, next) {
    switch (req.body.userType) {
        case "government":
            req.body.userType = constants.governmentType;
            req.body.accountPending = true;
            break;
        case "business":
            req.body.userType = constants.businessType;
            req.body.accountPending = true;
            break;
        case "general":
            req.body.userType = constants.generalType;
            req.body.accountPending = false;
            break;
        default:
            res.status(400).json({ error: "Invalid account type." }).end();
            return;
    }
    next();
};



module.exports = {
    userNotLoggedIn,
    userLoggedIn,
    validUsername,
    validPassword,
    validVerifiedPassword,
    validEmail,
    validAccountType
};