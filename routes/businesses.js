const express = require("express");
const router = express.Router();
const Users = require("../models/Users");
const Businesses = require("../models/Businesses");
const validate = require('./validators');
const constants = require('../constants');
/**
 * Have current user claim business
 * 
 * @name PUT /api/businesses/claim
 */
router.put(
    '/claim',
    [
        validate.userLoggedIn
    ],
    async (req, res) => {
        try {
            // Retrieves User
            let user = await Users.usernameToEntry(req.session.username);
            let userId = user["userId"];

            // Check that business account
            if (user["userType"] != constants.businessType) {
                res.status(401).json({ error: "Could not claim business because this account is not a business account." }).end();
                return;
            }
            // Check that account has been verified
            // if (user["accountPending"] != constants.generalType) {
            //     res.status(401).json({ error: "Could not claim business because this account has not yet been verified." }).end();
            //     return;
            // }
            // Retrieve business info
            let business = await Businesses.getBusinessExact(req.body.businessName, req.body.address);
            let businessId = business["businessId"];
            let claim = await Businesses.checkBusinessClaim(businessId);
            // Business is already claimed
            if (claim) {
                res.status(409).json({ error: "This business has already been claimed. " }).end();
                return;
            }

            // Claim the business
            status = await Businesses.claimBusiness(userId, businessId);
            status["ownsBusiness"] = userId == status.owner;

            res.status(201).json({ results: status, message: `Business was successfuly claimed` }).end();

        } catch (error) {
            console.log(error)
            res.status(500).json({ error: "Could not claim business." }).end();
        }
    }
);

/**
 * Retrieve a filtered list of businesses
 * Retrieves all businesses if query is empty
 * 
 * @name GET /api/businesses
 */
router.get(
    '/',
    [],
    async (req, res) => {
        try {
            let filteredBusinesses = await Businesses.search(req.query.name, req.query.address);
            res.status(200).json({data: filteredBusinesses, message: "Business fetched."}).end();
           
        } catch (error) {
            res.status(500).json({ error: "Could not fetch businesses." }).end();
        }
    }
);

/**
 * Retrieve a list of claimed businesses
 * 
 * @name GET /api/businesses/claimed
 */
router.get(
    '/claimed',
    [],
    async (req, res) => {
        try {
            let user = await Users.usernameToEntry(req.session.username);
            let userId = user["userId"];

            let businesses = await Businesses.getClaimedBusinesses(userId);
            res.status(200).json({ results: businesses, message: "Businesses fetched." }).end();
           
        } catch (error) {
            console.log(error);
            res.status(503).json({ error: "Could not fetch businesses." }).end();
        }
    }
);

/**
 * Retrieve a filtered list of businesses based on a set of query
 * 
 * @name GET /api/businesses/applyFilters
 */
router.get(
    '/applyFilters',
    [],
    async (req, res) => {
        try {
            let { 
                businessName, 
                address,
                masksRequired, 
                sociallyDistanced,
                handWashingAvailable,
                handSanitizerAvailable,
                sneezeGuardsUsed,
                indoorDining,
                outdoorDining, 
                takeout, 
                delivery,
                seniorHours
            } = req.query;

            let filters = {
                masksRequired, 
                sociallyDistanced,
                handWashingAvailable,
                handSanitizerAvailable,
                sneezeGuardsUsed,
                indoorDining,
                outdoorDining, 
                takeout, 
                delivery,
                seniorHours
            };

            let user = await Users.usernameToEntry(req.session.username);
            let userId = -1;
            if (user) {
                userId = user["userId"];
            }

            let filteredBusinesses = await Businesses.searchWithFilters(businessName, address, filters, userId);
            res.status(200).json({results: filteredBusinesses, message: "Business fetched."}).end();
        } catch (error) {
            res.status(500).json({ error: "Could not fetch businesses." }).end();
        }
    }
);

/**
 * Have current user star business
 * 
 * @name PUT /api/businesses/star
 */
router.put(
    '/star',
    [
        validate.userLoggedIn
    ],
    async (req, res) => {
        try {
            // Retrieves User
            let user = await Users.usernameToEntry(req.session.username);
            let userId = user["userId"];
            let action = "star";
            // Retrieves business
            let business = await Businesses.getBusinessExact(req.body.businessName, req.body.address);
            let businessId = business["businessId"];
            if (!business) {
                res.status(404).json({ error: "Business does not exist." }).end();
                return;
            }

            // Checks if User already starred business
            starred = await Businesses.checkStar(userId, businessId);
            if (starred) {
                favorites = await Businesses.removeStar(userId, businessId);
                action = "unstar";
            } else {
                favorites = await Businesses.addStar(userId, businessId);
            }

            res.status(201).json({ data: favorites, action: action, message: `Business was successfuly ${starred? "unstarred": "starred"}` }).end();

        } catch (error) {
            console.log(error);
            res.status(500).json({ error: "Could not star business. " }).end();
        }
    }
);

/**
 * Check if a business is in a user's starred businesses
 * 
 * @name POST /api/businesses/isStarred
 */
router.post(
    '/isStarred',
    [
        validate.userLoggedIn
    ],
    async (req, res) => {
        try {
            // Retrieves user id
            let user = await Users.usernameToEntry(req.session.username);
            let userId = user["userId"];
             // Retrieves business
             let business = await Businesses.getBusinessExact(req.body.businessName, req.body.address);
             let businessId = business["businessId"];
             if (!business) {
                 res.status(404).json({ error: "Business does not exist." }).end();
                 return;
             }
 
             // Checks if User already starred business
             starred = await Businesses.checkStar(userId, businessId);
            
            // return true or false 
            res.status(200).json({data: starred, message: "Fetched starred businesses."}).end();
           
        } catch (error) {
            console.log(error);
            res.status(500).json({ error: "Could not fetch starred businesses." }).end();
        }
    }
)

/**
 * Retrieves current user's starred businesses
 * 
 * @name GET /api/businesses/starred
 */
router.get(
    '/starred',
    [
        validate.userLoggedIn
    ],
    async (req, res) => {
        try {
            // Retrieves user id
            let user = await Users.usernameToEntry(req.session.username);
            let id = user["userId"];

            // Retrieves user's favorite businesses
            favorites = await Businesses.getFavorite(id);
            res.status(200).json({data: favorites, message: "Fetched starred businesses."}).end();
           
        } catch (error) {
            console.log(error);
            res.status(500).json({ error: "Could not fetch starred businesses." }).end();
        }
    }
);

/**
 * Update general business information 
 * 
 * @name PUT /api/businesses/updateGeneral/:id
 */
router.put(
    '/updateGeneral/:id',
    [
        validate.userLoggedIn
    ],
    async (req, res) => {
        try {
            let id = req.params.id;
            let updateSuccess = await Businesses.updateInformation(id, req.body);
            results = null;
            if (updateSuccess) {
                results = await Businesses.getBusinessById(id);
            }
            res.status(200).json({ results, message: "Successfully updated general information."}).end();
        } catch (error) {
            console.log(error);
            res.status(503).json({ error: "Could not update this business's general information." }).end();
        }
    }
);

/**
 * Update business safety information 
 * 
 * @name PUT /api/businesses/updateSafety/:id
 */
router.put(
    '/updateSafety/:id',
    [
        validate.userLoggedIn
    ],
    async (req, res) => {
        try {
            let id = req.params.id;
            let updateSuccess = await Businesses.updateSafety(id, req.body);
            results = null;
            if (updateSuccess) {
                results = await Businesses.getBusinessPropertiesById(id);
            }
            res.status(200).json({ results, message: "Successfully updated safety information."}).end();
        } catch (error) {
            console.log(error);
            res.status(503).json({ error: "Could not update this business's safety information." }).end();
        }
    }
);

/*
 * Retrieves the aggregate data of business reports, separated by report type
 * Used for data visualization
 * 
 * @name POST /api/businesses/reportData
 */
router.post(
    '/reportData',
    [],
    async (req, res) => {
        try {
            let business = await Businesses.getBusinessExact(req.body.businessName, req.body.address);
            if (!business) {
                res.status(404).json({ error: "Business does not exist." }).end();
                return;
            }
            let businessId = business.businessId;
            let reports = await Businesses.getReports(businessId);
            let today = new Date();
            let data = {};

            let labels = [];
            for (i = 6; i >= 0; i--) {
                labels.push(constants.days[((today.getDay()-i % 7) + 7) % 7]);
            }

            let maskData = [0, 0, 0, 0, 0, 0, 0]
            let socialDistancingData = [0, 0, 0, 0, 0, 0, 0]
            let otherData = [0, 0, 0, 0, 0, 0, 0]
            for (let report of reports) {
                let day = new Date(report.date);
                for (i = 1; i <= 7; i++) {
                    let compareDate = new Date();
                    compareDate.setDate(compareDate.getDate() - i);
                    if (day > compareDate) {
                        maskData[7-i] += report.maskInfraction;
                        socialDistancingData[7-i] += report.socialDistancingInfraction;
                        otherData[7-i] += report.otherInfraction;
                        break;
                    }
                }
            }
            let datasets = [
                {
                    label: 'Masks',
                    backgroundColor: '#f87979',
                    data: maskData
                },
                {
                    label: 'Social Distancing',
                    backgroundColor: '#79b9f8',
                    data: socialDistancingData
                },
                {
                    label: 'Other',
                    backgroundColor: '#7afacd',
                    data: otherData
                }
            ]

            data.labels = labels;
            data.datasets = datasets;

            res.status(200).json({data: data}).end();
           
        } catch (error) {
            console.log(error);
            res.status(500).json({ error: "Could retrieve business reports." }).end();
        }
    }
);

module.exports = router;