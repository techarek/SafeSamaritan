<template>
  <div>
    <h1>The Safe Samaritan TODO</h1>
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
      <form id="create-account" v-on:submit.prevent="createAccount" method="post">
        <input id='createdUsername' v-model.trim='createdUsername' type='text' name='createdUsername' placeholder="Username">
        <br/>
        <input id='emailAddress' v-model.trim='emailAddress' type='text' name='emailAddress' placeholder="Email Address">
        <br/>
        <input id='createdPassword' v-model.trim='createdPassword' :type="createdPwdType" name='createdPassword' placeholder="Password">
        <input type="button" :value="(createdPwdType == 'password' ? 'Show' : 'Hide') + ' Password'" class="button" v-on:click="togglePwdVisibility('createdPwdType')">
        <br/>
        <input id='verifiedPassword' v-model.trim='verifiedPassword' :type="verifiedPwdType" name='verifiedPassword' placeholder="Verify your password">
        <input type="button" :value="(verifiedPwdType == 'password' ? 'Show' : 'Hide') + ' Password'" class="button" v-on:click="togglePwdVisibility('verifiedPwdType')">
        <br/>
        Type of Account:
        <br/>
        <input type="radio" id="general" v-model="userType" value="general">
        <label for="general">General</label><br>
        <input type="radio" id="government" v-model="userType" value="government">
        <label for="government">Government</label><br>
        <input type="radio" id="business" v-model="userType" value="business">
        <label for="business">Business</label><br>
        <input type='submit' value='Create Account' class="button">
      </form>
    </div>
    <div>
      <form id="sign-in" v-on:submit.prevent="signIn" method="post">
        <input id='username' v-model.trim='username' type='text' name='username' placeholder="Username">
        <br/>
        <input id='password' v-model.trim='password' :type="pwdType" name='password' placeholder="Password">
        <input type="button" :value="(pwdType == 'password' ? 'Show' : 'Hide') + ' Password'" class="button" v-on:click="togglePwdVisibility('pwdType')">
        <br/>
        <input type='submit' value='Sign In' class="button">
      </form>
    </div>
    <div>
      <form id="sign-out" v-on:submit.prevent="signOut" method="delete">
        <input type='submit' value='Sign Out' class="button">
      </form>
    </div>
    <div>
      <form id="change-username" v-on:submit.prevent="changeUsername" method="put">
        <input id='newUsername' v-model.trim='newUsername' type='text' name='newUsername' placeholder="New username">
        <br/>
        <input type='submit' value='Change Username' class="button">
      </form>
    </div>
    <div>
      <form id="change-password" v-on:submit.prevent="changePassword" method="put">
        <input id='oldPassword' v-model.trim='oldPassword' :type='oldPwdType' name='oldPassword' placeholder="Old password">
        <input type="button" :value="(oldPwdType == 'password' ? 'Show' : 'Hide') + ' Password'" class="button" v-on:click="togglePwdVisibility('oldPwdType')">
        <br/>
        <input id='newPassword' v-model.trim='newPassword' :type='newPwdType' name='newPassword' placeholder="New password">
        <input type="button" :value="(newPwdType == 'password' ? 'Show' : 'Hide') + ' Password'" class="button" v-on:click="togglePwdVisibility('newPwdType')">
        <br/>
        <input type='submit' value='Change Password' class="button">
      </form>
    </div>
    <div>
      <form id="delete-account" v-on:submit.prevent="deleteAccount" method="delete">
        <input type='submit' value='Delete Account' class="button">
      </form>
    </div>
    <div>
      <form id="claim-business" v-on:submit.prevent="claimBusiness" method="put">
        <input id='claimedBusinessName' v-model.trim='claimedBusinessName' type='text' name='claimedBusinessName' placeholder="Name of business">
        <br/>
        <input id='claimedAddress' v-model.trim='claimedAddress' type='text' name='claimedAddress' placeholder="Address">
        <br/>
        <input type='submit' value='Claim Business' class="button">
      </form>
    </div>
    <div>
      <form id="get-business" v-on:submit.prevent="getBusiness" method="get">
        <input id='businessName' v-model.trim='businessName' type='text' name='businessName' placeholder="Name of business">
        <br/>
        <input id='address' v-model.trim='address' type='text' name='address' placeholder="Address">
        <br/>
        <input type='submit' value='Search Business' class="button">
      </form>
    </div>
    <div>
      <form id="star-business" v-on:submit.prevent="starBusiness" method="put">
        <input id='starredBusinessName' v-model.trim='starredBusinessName' type='text' name='starredBusinessName' placeholder="Name of business">
        <br/>
        <input id='starredAddress' v-model.trim='starredAddress' type='text' name='starredAddress' placeholder="Address">
        <br/>
        <input type='submit' value='Star Business' class="button">
      </form>
    </div>
    <div>
      <form id="get-starred-businesses" v-on:submit.prevent="getStarredBusinesses" method="get">
        <input type='submit' value='Get Starred Business' class="button">
      </form>
    </div>
    <div>
      <form id="send-notification" v-on:submit.prevent="sendNotification" method="post">
        <p>To:</p>
        <input id='toAddress' v-model.trim='toAddress' type='text' name='toAddress'>
        <br/>
        
        <p>Message:</p>
        <textarea id="notification" name="w3review" rows="4" cols="50" v-model.trim='notification'>
        </textarea>
        <br/>
        <input type='submit' value='Send Notification' class="button">
      </form>
    </div>
    <div>
      <form id="send-request" v-on:submit.prevent="sendRequest" method="post">        
        <p>Message:</p>
        <textarea id="requestMessage" name="w3review" rows="4" cols="50" v-model.trim='requestMessage'>
        </textarea>
        <br/>
        <input type='submit' value='Send Request' class="button">
      </form>
    </div>
    <div>
      <form id="send-report" v-on:submit.prevent="sendReport" method="post">
        <p>Business Information</p>
        <p>Name:</p>
        <input id="reportedBusName" v-model.trim="reportedBusName" type="text" name="reportedBusName">
        <br/>

        <p>Address:</p>
        <input id="reportedBusAddress" v-model.trim="reportedBusAddress" type="text" name="reportedBusAddress">
        <br/>

        <p>What type of violation or report are you filing?</p>
        <input type="radio" id="maskInfraction" v-model="messageType" value="maskInfraction">
        <label for="maskInfraction">Masks</label><br>
        <input type="radio" id="socialDistancing" v-model="messageType" value="socialDistancing">
        <label for="socialDistancing">Social Distancing Regulations</label><br>
        <input type="radio" id="other" v-model="messageType" value="other">
        <label for="other">Other: <input type="text" id="other-type" v-model.trim="otherType" name="other-type"></label><br>
        
        <p>Message:</p>
        <textarea id="reportMessage" name="w3review" rows="4" cols="50" v-model.trim='reportMessage'>
        </textarea>
        <br/>
        <input type='submit' value='Send Report' class="button">
      </form>
    </div>
    <div>
      <form id="get-messages" v-on:submit.prevent="getMessages" method="get">
        <input type='submit' value='Get All Messages' class="button">
      </form>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import { eventBus } from "../main";

export default {
  name: "Skeleton",

  data() {
    return {
      errors: [],
      successes: [],
      username: "",
      password: "",
      emailAddress: "",
      userType: "",
      pwdType: "password",
      newUsername: "",
      newPassword: "",
      newPwdType: "password",
      oldPassword: "",
      oldPwdType: "password",
      claimedBusinessName: "",
      claimedAddress: "",
      starredBusinessName: "",
      starredAddress: "",
      businessName: "",
      address: "",
      createdPassword: "",
      createdPwdType: "password",
      createdUsername: "",
      verifiedPassword: "",
      verifiedPwdType: "password",
      notification: "",
      toAddress: "",
      requestMessage: "",
      messageType: "",
      reportMessage: "",
      reportedBusName: "",
      reportedBusAddress: "",
      otherType: "",
      messageID: "",
      pinnedMessageID: "",
    }
  },

  components: {
  },

  methods: {
    createAccount: function() {
      const bodyContent = { 
        username: this.createdUsername, 
        password: this.createdPassword, 
        verifiedPassword: this.verifiedPassword,
        emailAddress: this.emailAddress,
        userType: this.userType
      };
      this.clearMessages();

      axios
        .post("/api/users/createAccount", bodyContent)
        .then((res) => {
          // handle success
          eventBus.$emit('create-account-success', res);
          this.handleSuccess(res);
        })
        .catch(err => {
          // handle error
          this.handleError(err);
        })
        .then(() => {
          // always executed
          this.createdUsername = "";
          this.createdPassword = "";
          this.verifiedPassword = "";
          this.emailAddress = "";
          this.userType = "";
        });
    },

    signIn: function() {
      const bodyContent = { username: this.username, password: this.password };
      this.clearMessages();
      axios
        .post("/api/users/signin", bodyContent)
        .then((res) => {
          // handle success
          eventBus.$emit('signin-success', res);
          this.handleSuccess(res);
        })
        .catch(err => {
          // handle error
          this.handleError(err);
        })
        .then(() => {
          // always executed
          this.username = "";
          this.password = "";
        });
    },

    signOut: function() {
      this.clearMessages();
      axios
        .delete("/api/users/signout", {})
        .then((res) => {
          // handle success
          eventBus.$emit('signout-success', res);
          this.handleSuccess(res);
        })
        .catch(err => {
          // handle error
          this.handleError(err);
        });
    },

    togglePwdVisibility: function(pwdType) {
      this[pwdType] = this[pwdType] == "password" ? "text" : "password";
    }, 

    changeUsername: function() {
      const bodyContent = { 
        username: this.newUsername 
      };
      this.clearMessages();
      axios
        .put("/api/users/change-username", bodyContent)
        .then((res) => {
          // handle success
          eventBus.$emit('change-username-success', res);
          this.handleSuccess(res);
        })
        .catch(err => {
          // handle error
          this.handleError(err);
        })
        .then(() => {
          // always executed
          this.newUsername = "";
        });
    },

    changePassword: function() {
      const bodyContent = { 
        oldPassword: this.oldPassword,
        password: this.newPassword 
      };
      this.clearMessages();
      axios
        .put("/api/users/change-password", bodyContent)
        .then((res) => {
          // handle success
          eventBus.$emit('change-password-success', res);
          this.handleSuccess(res);
        })
        .catch(err => {
          // handle error
          this.handleError(err);
        })
        .then(() => {
          // always executed
          this.newPassword = "";
          this.oldPassword = "";
        });
    },

    deleteAccount: function() {
      const bodyContent = {};
      this.clearMessages();
      axios
        .delete("/api/users/deleteAccount", bodyContent)
        .then((res) => {
          // handle success
          eventBus.$emit('delete-account-success', res);
          this.handleSuccess(res);
        })
        .catch(err => {
          // handle error
          this.handleError(err);
        });
    },

    claimBusiness: function() {
      const bodyContent = { 
        businessName: this.claimedBusinessName,
        address: this.claimedAddress 
      };
      this.clearMessages();
      axios
        .put("/api/businesses/claim", bodyContent)
        .then((res) => {
          // handle success
          eventBus.$emit('claim-business-success', res);
          this.handleSuccess(res);
        })
        .catch(err => {
          // handle error
          this.handleError(err);
        })
        .then(() => {
          // always executed
          this.claimedBusinessName = "";
          this.claimedAddress = "";
        });
    },

    starBusiness: function() {
      const bodyContent = { 
        businessName: this.starredBusinessName,
        address: this.starredAddress 
      };
      this.clearMessages();
      axios
        .put("/api/businesses/star", bodyContent)
        .then((res) => {
          // handle success
          eventBus.$emit('star-business-success', res);
          this.handleSuccess(res);
        })
        .catch(err => {
          // handle error
          this.handleError(err);
        })
        .then(() => {
          // always executed
          this.starredBusinessName = "";
          this.starredAddress = "";
        });
    },

    getBusiness: function() {
      const bodyContent = { 
        businessName: this.businessName, 
        address: this.address 
      };
      this.clearMessages();
      axios
        .get(`/api/businesses?name=${this.businessName}&address=${this.address}`, bodyContent)
        .then((res) => {
          // handle success
          eventBus.$emit('get-business-success', res);
          this.handleSuccess(res);
        })
        .catch(err => {
          // handle error
          this.handleError(err);
        })
        .then(() => {
          // always executed
          this.businessName = "";
          this.address = "";
        });
    },

    getStarredBusinesses: function() {
      const bodyContent = {};
      this.clearMessages();
      axios
        .get("/api/businesses/starred", bodyContent)
        .then((res) => {
          // handle success
          eventBus.$emit('get-starred-businesses-success', res);
          this.handleSuccess(res);
        })
        .catch(err => {
          // handle error
          this.handleError(err);
        });
    },

    sendNotification: function() {
      const bodyContent = { 
        to: this.toAddress,
        message: this.notification,
      };
      this.clearMessages();
      axios
        .post("/api/messages/notification", bodyContent)
        .then((res) => {
          // handle success
          eventBus.$emit('send-notification-success', res);
          this.handleSuccess(res);
        })
        .catch(err => {
          // handle error
          this.handleError(err);
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
      this.clearMessages();
      axios
        .post("/api/messages/request", bodyContent)
        .then((res) => {
          // handle success
          eventBus.$emit('send-request-success', res);
          this.handleSuccess(res);
        })
        .catch(err => {
          // handle error
          this.handleError(err);
        })
        .then(() => {
          // always executed
          this.requestMessage = "";
        });
    },

    sendReport: function() {
      const bodyContent = { 
        message: this.reportMessage,
        type: this.messageType,
        otherType: this.otherType,
        businessName: this.reportedBusName,
        businessAddress: this.reportedBusAddress,
      };
      this.clearMessages();
      axios
        .post("/api/messages/report", bodyContent)
        .then((res) => {
          // handle success
          eventBus.$emit('send-report-success', res);
          this.handleSuccess(res);
        })
        .catch(err => {
          // handle error
          this.handleError(err);
        })
        .then(() => {
          // always executed
          this.reportMessage = "";
          this.messageType = "";
          this.otherType = "";
          this.reportedBusName = "";
          this.reportedBusAddress = "";
        });
    },

    getMessages: function() {
      const bodyContent = {};
      this.clearMessages();
      axios
        .get("/api/messages/", bodyContent)
        .then((res) => {
          // handle success
          eventBus.$emit('get-messages-success', res);
          this.handleSuccess(res);
        })
        .catch(err => {
          // handle error
          this.handleError(err);
        });
    },

    clearMessages: function() {
      this.errors = [];
      this.successes = [];
    },

    handleError: function(err) {
      let e = err.response.data.error;
      if (e) this.errors.push(e); 
      else this.errors.push("Unsuccessful action");
    },

    handleSuccess: function(res) {
      let m = res.data.message; 
      if (m) {
        this.successes.push(m);
      }
    },

    beforeDestroy: function () {
      eventBus.$off("create-account-success");
      eventBus.$off("signin-success");
      eventBus.$off("signout-success");
      eventBus.$off("change-username-success");
      eventBus.$off("change-password-success");
      eventBus.$off("claim-business-success");
      eventBus.$off("star-business-success");
      eventBus.$off("get-business-success");
      eventBus.$off("send-notification-success");
      eventBus.$off("send-request-success");
      eventBus.$off("send-report-success");
      eventBus.$off("get-messages-success");
      eventBus.$off("get-message-id-success");
      eventBus.$off("pin-message-success");
      eventBus.$off("get-pinned-messages-success");
      eventBus.$off("get-starred-businesses-success");
    },
  }
};
</script>
