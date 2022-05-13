<template>
    <div class="form-container">
        <div>
            <form id="send-report" v-on:submit.prevent="sendReport" method="post">
                <div style="text-align: left">
                    <p><b>What type of violation or report are you filing?</b></p>
                    <input type="radio" id="maskInfraction" v-model="messageType" value="maskInfraction">
                    <label for="maskInfraction">Masks</label><br>
                    <input type="radio" id="socialDistancing" v-model="messageType" value="socialDistancing">
                    <label for="socialDistancing">Social Distancing Regulations</label><br>
                    <input type="radio" id="other" v-model="messageType" value="other">
                    <label for="other">Other: <input type="text" id="other-type" v-model.trim="otherType" name="other-type"></label><br>
                </div>

                <p style="text-align: left"><b>Message:</b></p>
                <textarea id="reportMessage" name="w3review" rows="4" cols="50" v-model.trim='reportMessage'>
                </textarea>
                <br/>
                <input type='submit' value='Send Report' class="button">
            </form>
        </div>
        <div>
            <b-toast variant="danger" id="error-toast" title="Sorry" static no-auto-hide> 
                <ul>
                    <li v-for='error in errors' v-bind:key='error'>{{ error }}</li>
                </ul>
            </b-toast>
        </div>
        <div>
            <b-toast variant="success" id="success-toast" title="Success!" static no-auto-hide> 
                <ul>
                    <li v-for='success in successes' v-bind:key='success'>{{ success }}</li>
                </ul>
            </b-toast>
        </div>
    </div>
</template>

<script>
import { handleError, handleSuccess, clearMessagesImmediate } from "../handlers";
import axios from "axios";
import {eventBus} from "../../main";

export default {
    name: "Report",
    components: {

    },
    data(){
        return{
            reportMessage: "",
            otherType: "",
            messageType: "",
            successes: [],
            errors: [],
        }
    },
    props: {
        business: Object,
    },
    methods: {
        sendReport: function() {
            const bodyContent = { 
                message: this.reportMessage,
                type: this.messageType,
                otherType: this.otherType,
                businessName: this.business.name,
                businessAddress: this.business.address,
            };
            clearMessagesImmediate(this.errors, this.successes);
            this.hideToast("error-toast");
            this.hideToast("success-toast");

            axios
                .post("/api/messages/report", bodyContent)
                .then((res) => {
                    // handle success
                    eventBus.$emit('send-report-success', res);
                    handleSuccess(res, this.successes);
                    this.showToast("success-toast");
                })
                .catch(err => {
                    // handle error
                    handleError(err, this.errors);
                    this.showToast("error-toast");
                })
                .then(() => {
                    // always executed
                    this.reportMessage = "";
                    this.messageType = "";
                    this.otherType = "";
                });
        },
        showToast: function(id) {
            this.$bvToast.show(id);
        }, 
        hideToast: function(id) {
            this.$bvToast.hide(id);
        }
    }
}
</script>