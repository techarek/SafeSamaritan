<template>
    <div>
        <b-row>
            <b-col @click="toggleModal()">
                <h3>{{business.name}}<span style="color: white;">&#8599;</span> </h3>
                 <p>
                    <span v-if="positionAvailable">
                        <i>{{distanceAway}} miles away</i><br>
                    </span>
                    <b>{{business.address}}</b> <br>
                    {{business.phone}}
                </p>
            </b-col>
            <b-col>
                <span v-if="isSignedIn">
                    <p style="text-align:right;"> 
                        <span v-if="followingBusiness">
                            <b-button variant="primary" @click="toggleBusinessStar()"> &#9733; </b-button>
                        </span>
                        <span v-else> 
                            <b-button variant="outline-primary" @click="toggleBusinessStar()"> &#9734; </b-button>
                        </span>
                    </p>
                </span>
            </b-col>
        </b-row>
        <div v-if="showModal">
            <BusinessModal 
                v-bind:business="business" 
                v-bind:accountType="accountType" 
                v-bind:coords="coords" 
                v-bind:positionAvailable="positionAvailable" 
                v-bind:distanceAway="distanceAway"
                v-bind:isSignedIn="isSignedIn"
                v-bind:followingBusiness="followingBusiness"
            />
        </div>
    </div>
</template>

<script>
import { eventBus } from "../../main";
import BusinessModal from "./BusinessModal";
import axios from 'axios';
import geopoint from "geopoint";

export default {
    name: "BusinessBlock",
    components:{
        BusinessModal
    },
    props:{
        business: Object,
        accountType: String,
        userPosition: Array, 
        positionAvailable: Boolean,
        isSignedIn: Boolean
    },
    data(){
        return{
            showModal: false,
            coords: null, 
            distanceAway: 0,
            followingBusiness: false
        }
    },
    created: function(){
        this.checkStarred();

        eventBus.$on("close-modal", () => {
            this.showModal = false;
        });

        eventBus.$on("updated-starring", () => {
            this.checkStarred();
        })

        eventBus.$on("send-update-general-success", (res) => {
            this.business.phoneNumber = res.data.results.businessPhone;
            this.business.website = res.data.results.website;
            this.business.facebook = res.data.results.facebook;
            this.business.twitter = res.data.results.twitter;
            this.business.instagram = res.data.results.instagram;
            this.business.businessOpen = res.data.results.businessOpen;
        });
        eventBus.$on("send-update-safety-success", (res) => {
            this.business.masksRequired = res.data.results.masksRequired;
            this.business.sociallyDistanced = res.data.results.sociallyDistanced;
            this.business.handWashing = res.data.results.handWashing;
            this.business.handSanitizer = res.data.results.handSanitizer;
            this.business.sneezeGuards = res.data.results.sneezeGuards;
            this.business.indoorDining = res.data.results.indoorDining;
            this.business.outdoorDining = res.data.results.outdoorDining;
            this.business.takeout = res.data.results.takeout;
            this.business.delivery = res.data.results.delivery;
            this.business.seniorHours = res.data.results.seniorHours;
        });

        // sometimes trippy? maybe its my internet it was working all of yesterday
        if(this.coords === null){
            this.getCoords();
        }
    },
    methods:{
        toggleModal: function(){
            this.showModal = !this.showModal;
        },
        getCoords: function(){
            let formattedAddress = this.business.address.split(' ').join('+');
            formattedAddress = formattedAddress + "+Cambridge+MA"
            axios
                .get(
                    `/api/map/geocode/${formattedAddress}`
                )
                .then( (res) => {
                    console.log(res.data.data);
                    this.coords = {latitude: res.data.data.lat, longitude: res.data.data.long};
                    
                })
                .then(() => {
                    this.getDistanceAway();
                });
        },
        getDistanceAway: function(){
            let businessPoint = new geopoint(this.coords.latitude, this.coords.longitude);
            let userPoint = new geopoint(this.userPosition[0], this.userPosition[1]);
            this.distanceAway = businessPoint.distanceTo(userPoint, false).toFixed(2); // false to calculate in miles
        },
        toggleBusinessStar: function() {
            let bodyContent = {businessName: this.business.name, address: this.business.address};
            axios
                .put("/api/businesses/star", bodyContent)
                .then((res) => {
                    // handle success
                    console.log("SUCCESS: " + res);
                    let action = res.data.action;
                    console.log(action);
                    if(action === "star"){
                        this.followingBusiness = true;
                    } else {
                        this.followingBusiness = false;
                    }
                })
                .catch(err => {
                    // handle error=
                    console.log("ERROR: " + err);
                });
        },
        checkStarred: function(){
            let bodyContent = {businessName: this.business.name, address: this.business.address};
            axios
                .post("/api/businesses/isStarred/", bodyContent)
                .then((res) => {
                    // handle success
                    console.log("SUCCESS check star biz block: " + res.data.data);
                    if(res.data.data){
                        this.followingBusiness = true;
                    } else {
                        this.followingBusiness = false;
                    }
                })
                .catch(err => {
                    // handle error=
                    console.log("ERROR: " + err);
                });
        }
    }
}
</script>