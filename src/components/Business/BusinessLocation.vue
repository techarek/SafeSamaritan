<template>
    <div id="modalMap">

    </div>
</template>

<script>
import "leaflet/dist/leaflet.css";
import L from "leaflet";
// import config from "../../../config.js";

export default {
    name: "BusinessLocation",
    data() {
        return{
            map: null,
            center: [42.373611, -71.110558],
        }
    },
    props: {
        coords: Object
    },
    mounted(){
        this.setupLeafletMap();
    },
    methods:{
        setupLeafletMap: function () {
            this.center = [this.coords.latitude, this.coords.longitude];
            this.map = L.map("modalMap").setView(this.center, 18);
            console.log("setting up leaflet map");
            this.setupLeafletLayers();
            this.addLocationMarker();
        },
        setupLeafletLayers: function(){
            L.tileLayer(
                `https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}`,
                {
                    attribution:
                    'Map data (c) <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery (c) <a href="https://www.mapbox.com/">Mapbox</a>',
                    maxZoom: 14,
                    tileSize: 512,
                    zoomOffset: -1,
                    id: "mapbox/streets-v11",
                    accessToken: process.env.VUE_APP_MAPBOX_KEY,
                }
            ).addTo(this.map);
            console.log("setting up leaflet layers");
        },
        addLocationMarker: function(){
            L.marker(this.center).addTo(this.map);
        }
    }
}
</script>

<style scoped>
    #modalMap {
        display: flex;
        padding: 10px;
        width: 95%;
        height: 200px;
    }
</style>