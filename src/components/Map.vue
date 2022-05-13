<template>
    <div id="mapContainer">

    </div>
</template>

<script>
import "leaflet/dist/leaflet.css";
import L from "leaflet";
// import config from "../../config.js";
import { eventBus } from "../main";
import axios from 'axios';

export default {
    name: "Map",
    data() {
        return{
            center: [42.373611, -71.110558], // Cambridge coordinates
            mapDiv: null,
            markers: null
        }
    },
    mounted(){
        this.setupLeafletMap();
        if(this.mapDiv){
            this.setupLeafletLayers();
        }
    },
    created: function(){
       eventBus.$on("got-results-success", (res) => {
            this.addMarkers(res.data.results).then( () => {
                console.log("Map updated");
            });
       });
    },
    methods: {
        setupLeafletMap: function () {
            this.mapDiv = L.map("mapContainer").setView(this.center, 13);
        },
        setupLeafletLayers: function(){
            L.tileLayer(
                `https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}`,
                {
                    attribution:
                    'Map data (c) <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery (c) <a href="https://www.mapbox.com/">Mapbox</a>',
                    maxZoom: 18,
                    tileSize: 512,
                    zoomOffset: -1,
                    id: "mapbox/streets-v11",
                    accessToken: process.env.VUE_APP_MAPBOX_KEY,
                }
            ).addTo(this.mapDiv);
        },
        addMarkers: async function(businessData){
            if(this.markers === null){
                this.markers = L.layerGroup().addTo(this.mapDiv);
            } else {
                this.markers.clearLayers();
            }
            
            let businessPinInfo = this.parseData(businessData);
            for (let p = 0; p < businessPinInfo.length; p++){
                if(!businessPinInfo[p].address.includes("All locations")){
                    let formattedAddress = businessPinInfo[p].address.split(' ').join('+');
                    formattedAddress = formattedAddress + "+Cambridge+MA"
                    axios
                        .get(
                            `/api/map/geocode/${formattedAddress}`
                        )
                        .then( (res) => {
                            let coords = [res.data.data.lat, res.data.data.long];
                            var m = L.marker(coords).addTo(this.markers);
                            let popup = new L.Popup({ autoClose: false, closeOnClick: false })
                                .setContent(businessPinInfo[p].name + ": " + businessPinInfo[p].address)
                                .setLatLng(coords);
                            m.bindPopup(popup).openPopup();
                        });
                } 
            }
        },
        parseData: function(businessData) {
            let businessPinInfo = [];
            let stop = businessData.length;
            if(stop > 10){
                stop = 10;
            }
            for (let i = 0; i < stop; i++) {
                    let businessName = businessData[i].businessName;
                    let businessAddress = businessData[i].businessAddress;
                    businessPinInfo.push({
                        name: businessName, 
                        address: businessAddress
                });
            }
            return businessPinInfo;
        }
    },
};
</script>

<style scoped>
    #mapContainer {
        width: 50vw;
        height: 100vh;
        position: fixed;
    }
</style>
