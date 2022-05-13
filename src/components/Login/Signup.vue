<template>
  <div class="modal-mask">
    <div class="modal-wrapper">
      <div class="modal-container">
        <b-button class="modal-default-button" @click="toggleClose()">
            X
        </b-button>
        <br><br>
        <div class="modal-header">
          <slot name="header">
            <h1>Sign-Up for an Account!</h1>
          </slot>
        </div>
        <div class="form-container">
          <b-form id="create-account" v-on:submit.prevent="createAccount" method="post">
            <b-form-input id='createdUsername' 
              v-model.trim='createdUsername' 
              type='text' 
              name='createdUsername' 
              placeholder="Username*"
            />
            <br/><br>
            <b-form-input id='emailAddress' 
              v-model.trim='emailAddress' 
              type='text' 
              name='emailAddress' 
              placeholder="Email Address*"
            />
            <br/><br>
            <b-form-input id='createdPassword' 
              v-model.trim='createdPassword' 
              :type="createdPwdType" 
              name='createdPassword' 
              placeholder="Password*"
            />
            <br><br>
            <label>
              <input type="checkbox" id="createdPassBox" style="display: inline-block;" v-on:click="togglePwdVisibility('createdPwdType')"> 
              <span v-if="createdPwdType == 'password'"> Show Password </span>
              <span v-else> Hide Password </span>
            </label><br><br>
            <b-form-input id='verifiedPassword' 
              v-model.trim='verifiedPassword' 
              :type="verifiedPwdType" 
              name='verifiedPassword' 
              placeholder="Verify your password*"
            />
            <br><br>
            <label> 
              <input type="checkbox" v-on:click="togglePwdVisibility('verifiedPwdType')">
              <span v-if="verifiedPwdType == 'password'"> Show Password </span>
              <span v-else> Hide Password </span>
            </label>
            <br><br>
            <div style="text-align:left;">
              <h3>Type of Account:*</h3>
              <b-form-radio id="general" v-model="userType" value="general">General</b-form-radio>
              <b-form-radio id="government" v-model="userType" value="government">Government</b-form-radio>
              <b-form-radio id="business" v-model="userType" value="business">Business</b-form-radio>
            </div>
            <br>
            <br>
            <b-button type='submit' variant="primary" class="loginpage-button" style="border-radius:10px;">
              Create Account
            </b-button>
            <br/>
            <div> 
              <b-toast variant="success" id="success-toast" title="Success!" static no-auto-hide> 
                <ul>
                  <li v-for='success in successes' v-bind:key='success'>{{ success }}</li>
                </ul>
              </b-toast>
            </div>
            <div>
              <b-toast variant="danger" id="error-toast" title="Sorry" static no-auto-hide> 
                <ul>
                  <li v-for='error in errors' v-bind:key='error'>{{ error }}</li>
                </ul>
              </b-toast>
            </div>
          </b-form>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import { eventBus } from "../../main";
import { handleError, handleSuccess, clearMessagesImmediate } from "../handlers";

export default {
  name: "Signup",
  data() {
    return {
      errors: [],
      successes: [],
      createdUsername: "" ,
      createdPassword: "",
      verifiedPassword: "",
      emailAddress: "",
      userType: "",
      createdPwdType: "password",
      verifiedPwdType: "password",
    }
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
      this.hideToast("success-toast");
      this.hideToast("error-toast");
      clearMessagesImmediate(this.successes, this.errors);

      axios
        .post("/api/users/createAccount", bodyContent)
        .then((res) => {
          // handle success
          eventBus.$emit('create-account-success', res);
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
          this.createdUsername = "";
          this.createdPassword = "";
          this.verifiedPassword = "";
          this.emailAddress = "";
          this.userType = "";
        });
    },
    togglePwdVisibility: function(pwdType) {
      this[pwdType] = this[pwdType] == "password" ? "text" : "password";
    },
    toggleClose: function(){
      eventBus.$emit("close-signup-modal");
    },
    showToast: function(id) {
      this.$bvToast.show(id);
    },
    hideToast: function(id) {
      this.$bvToast.hide(id);
    }
  }
};
</script>