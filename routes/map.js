const express = require("express");
const router = express.Router();
// const config = require("../config");
const validate = require('./validators');
const axios = require('axios');

router.get(
    '/geocode/:formattedAddress',
    [
    ],
    (req, res) => {
        try{
            let formattedAddress = req.params.formattedAddress;
            axios
                .get(
                    `https://maps.googleapis.com/maps/api/geocode/json?address=${formattedAddress}&key=${process.env.GEOCODER_KEY}`
                )
                .then( (resData) => {
                    let lat = parseFloat(resData.data.results[0].geometry.location.lat);
                    let long = parseFloat(resData.data.results[0].geometry.location.lng);
                    let coords = {lat: lat, long: long};
                    res.status(201).json({ data: coords, message: `Successfully retrieved coordinates.` }).end();
                });
        } catch {
            res.status(500).json({error: "Unable to retrieve coordinates from server."});
        } 
    }
);



module.exports = router;