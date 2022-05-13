<template>
    <div class="form-container">
        <div v-if='successes.length' class="success-message" style="width: 250px;">
            <b>Success:</b>
            <ul>
                <li v-for='success in successes' v-bind:key='success'>{{ success }}</li>
            </ul>
        </div>
        <div v-if='errors.length' class="error-message" style="width: 250px;">
            <b>We encountered the following error(s):</b>
            <ul>
                <li v-for='error in errors' v-bind:key='error'>{{ error }}</li>
            </ul>
        </div>
        To compose a message, simply select which group you want to send it to. Then, type your message out and click send!

        <div v-if="!isGeneralType">
            <b-form id="send-notification" v-on:submit.prevent="sendNotification" method="post">
                <b-form-group
                    id="input-to-group"
                    label="To:"
                    label-for="input-to"
                >
                    <b-form-radio
                    v-model="toAddress"
                    value="all"
                    >All</b-form-radio>

                    <b-form-radio
                    v-model="toAddress"
                    value="general"
                    >General Users</b-form-radio>

                    <b-form-radio
                    v-model="toAddress"
                    value="businesses"
                    >Businesses</b-form-radio>
                </b-form-group>
                
                <b-form-group
                    id="input-notif-group"
                    label="Message:"
                    label-for="input-notif"
                >
                    <b-form-textarea
                    id="input-notif"
                    v-model.trim="notification"
                    required
                    placeholder="Enter message"
                    ></b-form-textarea>
                </b-form-group>

                 <b-button type='submit' value='Send Notification'>Send Notification</b-button>
            </b-form>
        </div>

        <div v-if="isBusinessType">
            <b-form id="send-request" v-on:submit.prevent="sendRequest" method="post">  
                <b-form-group
                    id="requestMessage-group"
                    label="Request:"
                    label-for="input-notif"
                >
                    <b-form-textarea
                    id="requestMessage"
                    v-model.trim="requestMessage"
                    required
                    placeholder="Enter request"
                    ></b-form-textarea>
                </b-form-group>
                 <b-button type='submit' value='Send Request'>Send Request</b-button>
            </b-form>
        </div>
    </div>
</template>

<script>
import axios from "axios";
import { eventBus } from "../../main";
import { handleError, handleSuccess, clearMessages } from "../handlers";
import constants from "../../../constants";

export default {
  name: "ComposeMessage",
  components: {
  },
  data() {
      return {
        errors: [],
        successes: [],
        notification: "",
        toAddress: "",
        requestMessage: "",
        messageType: ""
      }
  },
  props: {
    accountType: String
  },
  computed: {
      isGeneralType: function(){
          return this.accountType == constants.generalType;
      },
      isBusinessType: function(){
          return this.accountType == constants.businessType;
      },
      isGovernmentType: function(){
          return this.accountType == constants.governmentType;
      }
  },
  methods:{
    sendNotification: function() {
        const bodyContent = { 
            to: this.toAddress,
            message: this.notification,
        };
        clearMessages(this.errors, this.successes);
        axios
            .post("/api/messages/notification", bodyContent)
            .then((res) => {
            // handle success
            eventBus.$emit('send-notification-success', res);
            handleSuccess(res, this.successes);
            })
            .catch(err => {
            // handle error
            handleError(err, this.errors);
            })
            .then(() => {
            // always executed
            this.toAddress = "";
            this.notification = "";
            });
        },
    sendRequest: function() {
      const bodyContent = { 
        message: this.requestMessage,
      };
      clearMessages(this.errors, this.successes);
      axios
        .post("/api/messages/request", bodyContent)
        .then((res) => {
          // handle success
          eventBus.$emit('send-request-success', res);
          handleSuccess(res, this.successes);
        })
        .catch(err => {
          // handle error
          handleError(err, this.errors);
        })
        .then(() => {
          // always executed
          this.requestMessage = "";
        });
    }
  }
};
</script>