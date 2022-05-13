<template>
    <div class="modal-mask">
        <div class="modal-wrapper">
            <div class="modal-container">
                <b-button class="modal-default-button" @click="toggleClose()">
                    X
                </b-button>
                <br><br>
                <BusinessLocation v-bind:coords="coords"/>
                <br>
                <div class="modal-header">
                    <slot name="header">
                    <h1>{{business.name}}</h1>
                    </slot>
                </div>

                <div class="modal-body">
                    <slot name="distance">
                        <i>{{distanceAway}} miles away</i>
                    </slot>
                </div>

                <div class="modal-body">
                    <slot name="body">
                    {{business.address}}
                    </slot>
                </div>

                <div v-if="business.businessOpen" class="modal-body">
                    Open for Business!
                </div>
                <div v-else class="modal-body">
                    Currently Closed.
                </div>

                <div class="modal-footer">
                    <slot name="footer">
                    {{business.phone}}
                    </slot>
                </div>
                <span v-if="isSignedIn">
                    <span v-if="starredBusiness">
                            <b-button variant="primary" @click="toggleBusinessStar()"> &#9733; Remove from Favorites</b-button>
                    </span>
                    <span v-else> 
                        <b-button variant="outline-primary" @click="toggleBusinessStar()"> &#9734; Add to Favorites</b-button>
                    </span>
                    <br><br>
                    <span v-if="subscribedToBusiness">
                            <b-button variant="primary" @click="toggleNotifications()"> Unsubscribe from Notifications </b-button>
                    </span>
                    <span v-else> 
                        <b-button variant="outline-primary" @click="toggleNotifications()">
                            Subscribe to Notifications
                        </b-button>                    
                    </span>
                    <br><br>
                </span>
                <div v-if="isSignedIn && isBusinessType && !business.owner && !business.ownsBusiness">
                    <form id="claim-business" v-on:submit.prevent="claimBusiness" method="put">
                        <input type='submit' class="loginpage-button" value='Claim Business'>
                    </form>
                    <br><br>
                </div>
                <button type="button" class="collapsible" @click="toggleCollapsible('safetyContent')">
                    Verified Safety Options
                    <span style="float:right;">+</span>
                </button>
                <div id="safetyContent" class="collapsible-content">
                    <keep-alive>
                        <BusinessSafetyContent v-bind:business="business"/>
                    </keep-alive>
                </div>

                <button type="button" class="collapsible" @click="toggleCollapsible('reportContent')">
                    Report this Business
                    <span style="float:right;">+</span>
                </button>
                <div id="reportContent" class="collapsible-content">
                    <keep-alive>
                        <Report v-bind:business="business"/>
                    </keep-alive>
                </div>

                <button type="button" class="collapsible" @click="retrieveReportData()">
                    View Report Data
                    <span style="float:right;">+</span>
                </button>
                <div id="reportVisualization" class="collapsible-content">
                    <keep-alive>
                        <ReportChart v-bind:chartData="chartData"/>
                    </keep-alive>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
import axios from "axios";
import { eventBus } from "../../main";
import Report from "./Report";
import constants from "../../../constants";
import { handleError } from "../handlers";
import BusinessLocation from "./BusinessLocation";
import ReportChart from "../Visualization/ReportChart";
import BusinessSafetyContent from "./BusinessSafetyContent";

export default {
    name: "BusinessModal",
    components:{
        Report,
        BusinessLocation,
        ReportChart,
        BusinessSafetyContent
    },
    props: {
        business: Object,
        accountType: String,
        coords: Object,
        distanceAway: String, 
        positionAvailable: Boolean
    },
    data(){
        return {
            chartData: {},
            errors: [],
            subscribedToBusiness: false,
            starredBusiness: false
        }
    },
    computed: {
        isBusinessType: function(){
            return this.accountType == constants.businessType;
        }, 

        isSignedIn: function() {
            return this.$cookie.get("user-auth") ? true : false;
        }
    },
    created: function(){
        this.checkNotificationStatus();
        this.checkStarred();
    },
    methods:{
        getNotifs: function() {
            let bodyContent = {businessName: this.business.name, address: this.business.address};
            axios
                .post("/api/messages/notification/update", bodyContent)
                .then((res) => {
                // handle success
                console.log("SUCCESS: " + res);
                })
                .catch(err => {
                // handle error=
                console.log("ERROR: " + err);
                });
        },
        followbusiness: function() {
            let bodyContent = {businessName: this.business.name, address: this.business.address};
            axios
                .put("/api/businesses/star", bodyContent)
                .then((res) => {
                // handle success
                console.log("SUCCESS: " + res);
                })
                .catch(err => {
                // handle error=
                console.log("ERROR: " + err);
                });
        },
        toggleClose: function(){
            eventBus.$emit("close-modal");
        },
        toggleCollapsible: function(id) {
            var coll = document.getElementById(id);
            if (coll.style.display === "block") {
                coll.style.display = "none";
            } else {
                coll.style.display = "block";
            }
        },
        claimBusiness: function() {
            this.errors = [];
            const bodyContent = { 
                businessName: this.business.name,
                address: this.business.address 
            };
            axios
                .put("/api/businesses/claim", bodyContent)
                .then((res) => {
                    // handle success
                    eventBus.$emit('claim-business-success', res);
                    this.business.ownsBusiness = res.data.results.ownsBusiness;
                })
                .catch(err => {
                    // handle error
                    handleError(err, this.errors);
                });
        },
        retrieveReportData: function() {
            let bodyContent = {
                businessName: this.business.name, 
                address: this.business.address
            };
            axios
                .post("/api/businesses/reportData", bodyContent)
                .then((res) => {
                    // handle success
                    this.chartData = res.data.data;
                })
                .catch(err => {
                    // handle error
                    console.log("ERROR: " + err);
                })
                .then(() => {
                    // always executed
                    this.toggleCollapsible("reportVisualization");
                });
        },
        toggleBusinessStar: function() {
            let bodyContent = {businessName: this.business.name, address: this.business.address};
            axios
                .put("/api/businesses/star", bodyContent)
                .then((res) => {
                    // handle success
                    console.log("SUCCESS: " + res.data.action);
                    let action = res.data.action;
                    console.log(action);
                    if(action === "star"){
                        this.starredBusiness = true;
                    } else {
                        this.starredBusiness = false;
                    }
                    eventBus.$emit("updated-starring");
                })
                .catch(err => {
                    // handle error=
                    console.log("ERROR: " + err);
                });
        },
        checkNotificationStatus: function(){
            let bodyContent = {businessName: this.business.name, address: this.business.address};
            axios
                .post("/api/messages/notification/settings", bodyContent)
                .then((res) => {
                    // handle success
                    console.log("SUCCESS: " + res.data.notifs);
                    let notifs = res.data.data;
                    if(notifs){
                        this.subscribedToBusiness = true;
                    } else {
                        this.subscribedToBusiness = false;
                    }
                })
                .catch(err => {
                    // handle error=
                    console.log("ERROR: " + err);
                });
        },
        toggleNotifications: function(){
            let bodyContent = {businessName: this.business.name, address: this.business.address};
            axios
                .post("api/messages/notification/update", bodyContent)
                .then((res) => {
                    // handle success
                    console.log("SUCCESS: " + res);
                    let notifs = res.data.data;
                    if(notifs){
                        this.subscribedToBusiness = true;
                    } else {
                        this.subscribedToBusiness = false;
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
                .post("/api/businesses/isStarred", bodyContent)
                .then((res) => {
                    // handle success
                    console.log("SUCCESS b-modal starred: " + res.data.data);
                    if(res.data.data){
                        this.starredBusiness = true;
                    } else {
                        this.starredBusiness = false;
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