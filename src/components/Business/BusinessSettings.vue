<template>
    <div class="form-container">
        <div>
            <div>
                <button type="button" class="collapsible" @click="toggleCollapsible(general)">
                    General or Service Information
                    <span style="float:right;">+</span>
                </button>
                <div :id=general class="collapsible-content">
                    <keep-alive>
                        <b-form id="updateGeneral" v-on:submit.prevent="updateGeneral" method="put" style="text-align: left">
                            <p>Phone Number:</p>
                            <b-form-input id="phoneNumber" v-model.trim="phoneNumber" type="text" name="phoneNumber"/>
                            <br/>
                            <p>Open for business?</p>
                            <b-form-radio id="openYes" v-model="businessOpen" value="openYes">Yes</b-form-radio>
                            <b-form-radio id="openNo" v-model="businessOpen" value="openNo">No</b-form-radio>
                            <br/>
                            <p>Website:</p>
                            <b-form-input id="website" v-model.trim="website" type="text" name="website"/>
                            <br/>
                            <p>Facebook:</p>
                            <b-form-input id="facebook" v-model.trim="facebook" type="text" name="facebook"/>
                            <br/>
                            <p>Twitter:</p>
                            <b-form-input id="twitter" v-model.trim="twitter" type="text" name="twitter"/>
                            <br/>
                            <p>Instagram:</p>
                            <b-form-input id="instagram" v-model.trim="instagram" type="text" name="instagram"/>
                            <br/>
                            <b-button variant="primary" type='submit' value='Save Changes' class="button">Save Changes</b-button>
                            <div> 
                                <b-toast variant="success" id="general-success-toast" title="Success!" static no-auto-hide> 
                                    <ul>
                                    <li v-for='success in successes' v-bind:key='success'>{{ success }}</li>
                                    </ul>
                                </b-toast>
                            </div>
                            <div>
                                <b-toast variant="danger" id="general-error-toast" title="Sorry" static no-auto-hide> 
                                    <ul>
                                    <li v-for='error in errors' v-bind:key='error'>{{ error }}</li>
                                    </ul>
                                </b-toast>
                            </div>
                        </b-form>
                    </keep-alive>
                </div>
                </div>
                <div>
                <button type="button" class="collapsible" @click="toggleCollapsible(safety)">
                    Safety Information
                    <span style="float:right;">+</span>
                </button>
                <div :id=safety class="collapsible-content">
                    <keep-alive>
                        <b-form id="updateSafety" v-on:submit.prevent="updateSafety" method="put" style="text-align: left">
                            <p>Masks Required?</p>
                            <b-form-radio id="masksYes" v-model="masksRequired" value="masksYes">Yes</b-form-radio>
                            <b-form-radio id="masksNo" v-model="masksRequired" value="masksNo">No</b-form-radio>
                            <br/>
                            <p>Social Distancing Regulation or Protocol?</p>
                            <b-form-radio id="distanceYes" v-model="sociallyDistanced" value="distanceYes">Yes</b-form-radio>
                            <b-form-radio id="distanceNo" v-model="sociallyDistanced" value="distanceNo">No</b-form-radio>
                            <br/>
                            <p>Hand Washing Available?</p>
                            <b-form-radio id="washYes" v-model="handWashing" value="washYes">Yes</b-form-radio>
                            <b-form-radio type="radio" id="washNo" v-model="handWashing" value="washNo">No</b-form-radio>
                            <br/>
                            <p>Hand Sanitizer Available?</p>
                            <b-form-radio id="sanitizerYes" v-model="handSanitizer" value="sanitizerYes">Yes</b-form-radio>
                            <b-form-radio id="sanitizerNo" v-model="handSanitizer" value="sanitizerNo">No</b-form-radio>
                            <br/>
                            <p>Sneeze Guards Used?</p>
                            <b-form-radio id="sneezeGuardsYes" v-model="sneezeGuards" value="sneezeGuardsYes">Yes</b-form-radio>
                            <b-form-radio id="sneezeGuardsNo" v-model="sneezeGuards" value="sneezeGuardsNo">No</b-form-radio>
                            <br/>
                            <p>Indoor Dining Available?</p>
                            <b-form-radio id="indoorYes" v-model="indoorDining" value="indoorYes">Yes</b-form-radio>
                            <b-form-radio id="indoorNo" v-model="indoorDining" value="indoorNo">No</b-form-radio>
                            <br/>
                            <p>Outdoor Dining Available?</p>
                            <b-form-radio id="outdoorYes" v-model="outdoorDining" value="outdoorYes">Yes</b-form-radio>
                            <b-form-radio id="outdoorNo" v-model="outdoorDining" value="outdoorNo">No</b-form-radio>
                            <br/>
                            <p>Takeout Available?</p>
                            <b-form-radio id="takeoutYes" v-model="takeout" value="takeoutYes">Yes</b-form-radio>
                            <b-form-radio id="takeoutNo" v-model="takeout" value="takeoutNo">No</b-form-radio>
                            <br/>
                            <p>Delivery Available?</p>
                            <b-form-radio id="deliveryYes" v-model="delivery" value="deliveryYes">Yes</b-form-radio>
                            <b-form-radio id="deliveryNo" v-model="delivery" value="deliveryNo">No</b-form-radio>
                            <br/>
                            <p>Senior Hours Available?</p>
                            <b-form-radio id="seniorYes" v-model="seniorHours" value="seniorYes">Yes</b-form-radio>
                            <b-form-radio id="seniorNo" v-model="seniorHours" value="seniorNo">No</b-form-radio>
                            <br/>
                            <b-button variant="primary" type='submit' value='Save Changes' class="button">Save Changes</b-button>
                            <div> 
                                <b-toast variant="success" id="safety-success-toast" title="Success!" static no-auto-hide> 
                                    <ul>
                                    <li v-for='success in successes' v-bind:key='success'>{{ success }}</li>
                                    </ul>
                                </b-toast>
                            </div>
                            <div>
                                <b-toast variant="danger" id="safety-error-toast" title="Sorry" static no-auto-hide> 
                                    <ul>
                                    <li v-for='error in errors' v-bind:key='error'>{{ error }}</li>
                                    </ul>
                                </b-toast>
                            </div>
                        </b-form>
                    </keep-alive>
                </div>
                </div>
        </div>
    </div>
</template>

<script>
import { handleError, handleSuccess, clearMessagesImmediate } from "../handlers";
import axios from "axios";
import {eventBus} from "../../main";

export default {
    name: "BusinessSettings",
    components: {

    },
    data(){
        return{
            phoneNumber: this.business.phoneNumber,
            website: this.business.website,
            facebook: this.business.facebook,
            twitter: this.business.twitter,
            instagram: this.business.instagram,
            businessOpen: this.business.businessOpen ? "openYes" : "openNo",
            masksRequired: this.business.masksRequired ? "masksYes" : "masksNo",
            sociallyDistanced: this.business.sociallyDistanced ? "distanceYes" : "distanceNo",
            handWashing: this.business.handWashing ? "washYes" : "washNo",
            handSanitizer: this.business.handSanitizer ? "sanitizerYes" : "sanitizerNo",
            sneezeGuards: this.business.sneezeGuards ? "sneezeGuardsYes" : "sneezeGuardsNo",
            indoorDining: this.business.indoorDining ? "indoorYes" : "indoorNo",
            outdoorDining: this.business.outdoorDining ? "outdoorYes" : "outdoorNo",
            takeout: this.business.takeout ? "takeoutYes" : "takeoutNo",
            delivery: this.business.delivery ? "deliveryYes" : "deliveryNo",
            seniorHours: this.business.seniorHours ? "seniorYes" : "seniorNo",
            safety: ("safety" + this.business.businessName + this.business.businessAddress).split(" ").join(""),
            general: ("general" + this.business.businessName + this.business.businessAddress).split(" ").join(""),
            successes: [],
            errors: [],
        }
    },
    props: {
      business: Object
    },
    methods: {
        updateGeneral: function(){
            const bodyContent = { 
                businessPhone: this.phoneNumber,
                website: this.website,
                facebook: this.facebook,
                twitter: this.twitter,
                instagram: this.instagram,
                businessOpen: this.businessOpen == "openYes" ? 1 : 0
            };
            clearMessagesImmediate(this.errors, this.successes);
            this.hideToast("general-success-toast");
            this.hideToast("general-error-toast");

            axios
                .put("/api/businesses/updateGeneral/" + this.business.id, bodyContent)
                .then((res) => {
                    // handle success
                    eventBus.$emit('send-update-general-success', res);
                    handleSuccess(res, this.successes);
                    this.showToast("general-success-toast");
                })
                .catch(err => {
                    // handle error
                    handleError(err, this.errors);
                    this.showToast("general-error-toast");
                });
        },
        updateSafety: function(){
            const bodyContent = { 
                masksRequired: this.masksRequired == "masksYes" ? 1 : 0,
                sociallyDistanced: this.sociallyDistanced == "distanceYes" ? 1 : 0,
                handWashing: this.handWashing == "washYes" ? 1 : 0,
                handSanitizer: this.handSanitizer == "sanitizerYes" ? 1 : 0,
                sneezeGuards: this.sneezeGuards == "sneezeGuardsYes" ? 1 : 0,
                indoorDining: this.indoorDining == "indoorYes" ? 1 : 0,
                outdoorDining: this.outdoorDining == "outdoorYes" ? 1 : 0,
                takeout: this.takeout == "takeoutYes" ? 1 : 0,
                delivery: this.delivery == "deliveryYes" ? 1 : 0,
                seniorHours: this.seniorHours == "seniorYes" ? 1 : 0,
            };
            clearMessagesImmediate(this.errors, this.successes);
            this.hideToast("safety-success-toast");
            this.hideToast("safety-error-toast");

            axios
                .put("/api/businesses/updateSafety/" + this.business.id, bodyContent)
                .then((res) => {
                    // handle success
                    eventBus.$emit('send-update-safety-success', res);
                    handleSuccess(res, this.successes);
                    this.showToast("safety-success-toast");
                })
                .catch(err => {
                    // handle error
                    handleError(err, this.errors);
                    this.showToast("safety-error-toast");
                });
        },
        toggleCollapsible: function(id) {
            var coll = document.getElementById(id);
            if (coll.style.display === "block") {
                coll.style.display = "none";
            } else {
                coll.style.display = "block";
            }
        }, 
        showToast: function(id) {
            this.$bvToast.show(id);
        }, 
        hideToast: function(id) {
            this.$bvToast.hide(id);
        }, 
        beforeDestroy: function (){
            eventBus.$off("send-update-general-success");
            eventBus.$off("send-update-safety-success");
        }
    }
}
</script>