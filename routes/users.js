const express = require("express");
const router = express.Router();
const Users = require("../models/Users");
const validate = require('./validators');

/**
 * Create a new user account
 * 
 * @name POST /api/users/createAccount
 */
router.post(
    '/createAccount',
    [
        validate.userNotLoggedIn,
        validate.validUsername,
        validate.validPassword,
        validate.validVerifiedPassword,
        validate.validEmail,
        validate.validAccountType,
    ],
    async (req, res) => {
        try {
            // check if user or email address already exists
            let user = await Users.usernameToEntry(req.body.username);
            let email = await Users.emailToEntry(req.body.emailAddress);
            if (user) {
                res.status(409).json({ error: `Username ${req.body.username} already exists.` }).end();
                return;
            }
            if (email) {
                res.status(409).json({ error: `Email ${req.body.emailAddress} already exists` }).end();
                return;
            }
            // create user entry
            user = await Users.createUserEntry(req.body.username, req.body.password, req.body.emailAddress, req.body.userType, req.body.accountPending);
            res.status(201).json({data: req.session.username, message: "Account created. Sign in to continue."}).end();
           
        } catch (error) {
            res.status(500).json({ error: "Could not create an account." }).end();
        }
    }
);

/**
 * Sign in and create an authentication session
 * 
 * @name POST /api/users/signin
 */
router.post(
    '/signin',
    [
        validate.userNotLoggedIn,
        validate.validUsername,
        validate.validPassword,
    ],
    async (req, res) => {
        try {
            // fetch the user from the DB
            let user = await Users.usernameToEntry(req.body.username);
            // must find user in the DB
            if (!user) {
                res.status(404).json({ error: `Could not find user ${req.body.username}` }).end();
                return;
            }
            // must have passwords match in DB
            if (user.password !== req.body.password) {
                res.status(400).json({ error: `Incorrect password.` }).end();
                return;
            }
            // authenticate and sign the user in
            req.session.username = req.body.username;
            res.status(201).json({username: req.session.username, userType: user.userType, message: "You have signed in!"}).end();
           
        } catch (error) {
            res.status(500).json({ error: "Could not sign user in." }).end();
        }
    }
);


/**
 * Sign the user out
 * 
 * @name DELETE /api/users/signout
 */
router.delete(
    '/signout', 
    [
        validate.userLoggedIn
    ],
    async (req, res) => {
        try {
            req.session.username = undefined;
            res.status(200).json({ message: "Successfuly signed out!" }).end();
        } catch (error) {
            res.status(500).json({ error: "Could not sign user out" }).end();
        }
    }
);

/**
 * Delete a user account
 * 
 * @name DELETE /api/users/deleteAccount
 */
router.delete(
    '/deleteAccount', 
    [
        validate.userLoggedIn
    ],
    async (req, res) => {
        try {
            // in the unlikely case the update doesn't change anything, raise an error
            let user = await Users.deleteUsername(req.session.username);
            if (user) {
                res.status(500).json({ error: `Error in deleting account.` }).end();
                return;
            }
            // remove authentication
            req.session.username = undefined;
            res.status(200).json({ message: "Successfuly deleted account. You've been signed out." }).end();
        } catch (error) {
            console.log("error: " + error);
            res.status(500).json({ error: "Could not delete account." }).end();
        }
    }
);

/**
 * Change a user's password
 * 
 * @name PUT /api/users/change-password
 */
router.put(
    '/change-password', 
    [
        validate.userLoggedIn,
        validate.validPassword,
    ],
    async (req, res) => {
        try {
            // old password must match current password
            let user = await Users.usernameToEntry(req.session.username);
            if (user.password !== req.body.oldPassword) {
                res.status(401).json({ error: `Old password does not match your current password` }).end();
                return;
            }
            // in the unlikely case the update doesn't change anything, raise an error
            let newUser = await Users.changePassword(user.userId, req.body.password);
            if (!newUser) {
                res.status(500).json({ error: `Error in changing password.` }).end();
                return;
            }
            res.status(200).json({ message: "Successfuly changed password!" }).end();
        } catch (error) {
            res.status(500).json({ error: "Could not change password" }).end();
        }
    }
);

/**
 * Change a user's username
 * 
 * @name PUT /api/users/change-username
 */
router.put(
    '/change-username', 
    [
        validate.userLoggedIn,
        validate.validUsername,
    ],
    async (req, res) => {
        try {
            let user = await Users.usernameToEntry(req.session.username);
            // in the unlikely case the update doesn't change anything, raise an error
            let newUser = await Users.changeUsername(user.userId, req.body.username);
            if (!newUser) {
                res.status(500).json({ error: `Error in changing username.` }).end();
                return;
            }
            // authenticate with new username
            req.session.username = req.body.username;
            res.status(200).json({ message: "Successfuly changed username!" }).end();
        } catch (error) {
            res.status(500).json({ error: "Could not change username" }).end();
        }
    }
);

module.exports = router;