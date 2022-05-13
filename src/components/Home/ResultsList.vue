<template>
    <div>
        <span v-if="!businessResults.length">
            <br>
            <i> {{ message }} </i>
        </span>
        <b-list-group style="list-style-type: none; padding: 0;">
          <b-list-group-item v-for="biz in businessResults" v-bind:key="biz.name + biz.address" class="business-box">
            <BusinessBlock 
                v-bind:business="biz" 
                v-bind:accountType="accountType"
                v-bind:positionAvailable="positionAvailable" 
                v-bind:userPosition="userPosition"
                v-bind:isSignedIn="isSignedIn"
            />
          </b-list-group-item>
        </b-list-group>
    </div>
</template>

<script>
import BusinessBlock from "../Business/BusinessBlock";
import { eventBus } from "../../main";
import axios from 'axios';

export default {
    name: "ResultsList",
    components:{
        BusinessBlock
    },
    props: {
        accountType: String,
        userPosition: Array,
        positionAvailable: Boolean,
        isSignedIn: Boolean
    },
    data(){
        return {
            errors: [],
            searchParameters: [],
            searchQuery: [],
            businessResults: [],
            message: "No search results available yet."
        }
    },
    created: function(){
        // some event on that takes search parameters and search query from the filter settings page
        // and uses it to set the data then call getBusinessResults
        eventBus.$on("filters-retrieved", (queryTxt, queryAddress, safetyOptions, serviceOptions) => {
            this.businessResults = [];
            this.errors = [];

            if ((queryTxt + queryAddress).split(" ").join("") == "") {
                this.errors.push("Please provide a business name or address you would like to search for");
                return;
            }

            const bodyContent = {};
            let params = "";
            let hasName = queryTxt.split(" ").join("") != "";
            if (hasName) params += `businessName=${queryTxt}`;
            if (queryAddress.split(" ").join("") != "") {
                if (hasName) params += '&';
                params += `address=${queryAddress}`;
            }
            params += this.genParams(safetyOptions);
            params += this.genParams(serviceOptions);
            axios.get("/api/businesses/applyFilters/?" + params, bodyContent)
                .then((res) => {
                    if (!res.data || !res.data.results) {
                        this.errors.push("no or undefined search results");
                        return;
                    }
                    for (let i = 0; i < res.data.results.length; i++) {
                        let biz = res.data.results[i];
                        this.businessResults.push({
                            id: biz.id, 
                            name: biz.businessName, 
                            address: biz.businessAddress, 
                            phone: biz.businessPhone, 
                            owner: biz.owner,
                            ownsBusiness: biz.ownsBusiness,
                            businessOpen: biz.businessOpen, 
                            website: biz.website,
                            facebook: biz.facebook,
                            twitter: biz.twitter,
                            instagram: biz.instagram,
                            masksRequired: biz.masksRequired,
                            sociallyDistanced: biz.sociallyDistanced,
                            handWashing: biz.handWashing,
                            handSanitizer: biz.handSanitizer,
                            sneezeGuards: biz.sneezeGuards,
                            indoorDining: biz.indoorDining,
                            outdoorDining: biz.outdoorDining,
                            takeout: biz.takeout,
                            delivery: biz.delivery,
                            seniorHours: biz.seniorHours
                        });
                    }
                    eventBus.$emit("got-results-success", res);
                    if(this.businessResults.length === 0){
                        this.message = "No matching results were found.";
                    }
                })
                .catch((err) => {
                    let e = err.response.data.error;
                    if (e) this.errors.push(e); 
                    else this.errors.push(err);
                });
        });
    },
    methods:{
        genParams: function (options) {
            let result = "";
            for (let i = 0; i < options.length; i++) {
                result += `&${options[i].id}=${options[i].selected}`;
            }
            return result;
        }
    },
    beforeDestroy: function () {
        eventBus.$off("got-results-success");
    }
}   
</script>