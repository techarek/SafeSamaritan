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
    <div>

      <b-table fixed hover :fields=fields :items=messages empty-text="You have no messages">
      <template #cell(notifId)="data">
        {{ data.item.notificationId }}
      </template>

      <template #cell(content)="data">
        {{ data.item.messageContent }}
      </template>

      <template #cell(date)="data">
        {{ data.item.date }}
      </template>

      <template #cell(authId)="data">
        {{ data.item.authorId }}
      </template>

      <template #cell(resolve)="data">
        <b-button v-on:click=resolveRow(data.item) >Resolve issue</b-button>
      </template>

      </b-table>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import { eventBus } from "../../main";
import { handleError, handleSuccess, clearMessages } from "../handlers";
import constants from "../../../constants";

export default {
  name: "Inbox",
  components: {
  },
  props: {
    accountType: String
  },
  data() {
      return {
        errors: [],
        successes: [],
        notification: "",
        toAddress: "",
        requestMessage: "",
        // fields: ['things'],
        fields: [{key: 'notifId', label: 'Notification Id'},
                {key: 'content', label: 'Message Content'},
                {key: 'date', label: 'Date'},
                {key: 'authId', label: 'Author Id'}],
        messages: [],
        messageType: "",
        reportMessage: "",
        reportedBusName: "",
        reportedBusAddress: "",
        otherType: "",
        messageID: "",
        pinnedMessageID: ""
      }
  },
  mounted: function() {
      this.getMessages();
      if (this.accountType == 2) {
      this.fields = [{key: 'notifId', label: 'Notification Id'},
                {key: 'content', label: 'Message Content'},
                {key: 'date', label: 'Date'},
                {key: 'authId', label: 'Author Id'},
                {key: 'resolve', label: ''}]
    }
  },
  methods:{
    resolveRow: function(report) {
      const bodyContent = { 
        reportId: report.reportId
      };
      clearMessages(this.errors, this.successes);
      axios
        .post("/api/messages/report/resolve", bodyContent)
        .then((res) => {
          // handle success
          eventBus.$emit('resolve-notification-success', res);
          handleSuccess(res, this.successes);
        })
        .catch(err => {
          // handle error
          handleError(err, this.errors);
        })
    },
    getMessages: function() {
      const bodyContent = {};
      clearMessages(this.errors, this.successes);
      axios
        .get("/api/messages/notifications", bodyContent)
        .then((res) => {
          this.messages = res.data.message;
          if(!(this.messages instanceof Array)){
            this.messages = [this.messages];
      }
          // eventBus.$emit('get-messages-success', res);
          // handleSuccess(res, this.successes);
        })
        .catch(err => {
          // handle error
          handleError(err, this.errors);
        });
    }
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
  }
};
</script>
