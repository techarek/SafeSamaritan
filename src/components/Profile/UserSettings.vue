<template>
    <div class="form-container">
      <div>
        <form id="sign-out" v-on:submit.prevent="signOut" method="delete">
            <b-button type='submit'>Sign Out</b-button>
        </form>
      </div>
      <div v-if="isBusinessType">
        <button type="button" class="collapsible" @click="toggleOpenBusinesses()">
          Edit Business Settings
          <span style="float:right;">+</span>
        </button>
        <div v-if="showBusinesses" id="settingsContent">
          <div class="modal-mask">
            <div class="modal-wrapper">
              <div class="modal-container">
                <b-button class="modal-default-button" @click="toggleCloseBusinesses()">
                  X
                </b-button>
                <OwnedBusinesses v-bind:businesses="businesses"/>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div>
        <button type="button" class="collapsible" @click="toggleOpenGeneral()">
          General Settings
          <span style="float:right;">+</span>
        </button>
        <div v-if="showGeneralSettings" id="generalSettings">
          <div class="modal-mask">
            <div class="modal-wrapper">
              <div class="modal-container" style="text-align: left; padding: 2%">
                <b-button class="modal-default-button" @click="toggleCloseGeneral()">
                  X
                </b-button>
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
                <div>
                  <h3>
                    <b>Change username:</b>
                  </h3>
                  <b-form id="change-username" v-on:submit.prevent="changeUsername" method="put">
                    <b-form-input id='newUsername' v-model.trim='newUsername' type='text' name='newUsername' placeholder="New username"/>
                    <b-button type='submit'>Save Change</b-button>
                  </b-form>
                </div>
                <div>
                  <h3>
                    <b>Change password:</b>
                  </h3>
                  <b-form id="change-password" v-on:submit.prevent="changePassword" method="put">
                    <b-form-input 
                      id='oldPassword' 
                      v-model.trim='oldPassword' 
                      :type='oldPwdType' name='oldPassword' 
                      placeholder="Old password"
                    />
                    <label> 
                      <input type="checkbox" v-on:click="togglePwdVisibility('oldPwdType')">
                      <span v-if="oldPwdType == 'password'"> Show Password </span>
                      <span v-else> Hide Password </span>
                    </label>
                    <br/>
                    <b-form-input 
                      id='newPassword' 
                      v-model.trim='newPassword' 
                      :type='newPwdType' 
                      name='newPassword' 
                      placeholder="New password"
                    />
                    <label> 
                      <input type="checkbox" v-on:click="togglePwdVisibility('newPwdType')">
                      <span v-if="newPwdType == 'password'"> Show Password </span>
                      <span v-else> Hide Password </span>
                    </label>
                    <br/>
                    <b-button type='submit'>Save Change</b-button>
                  </b-form>
                </div>
                <div>
                  <h3>
                    <b>Account:</b>
                  </h3>
                  <form id="delete-account" v-on:submit.prevent="showToast('verify-delete-toast')" method="delete">
                    <b-button type='submit' variant="danger">Delete Account</b-button>
                  </form>
                  <div> 
                    <b-toast variant="danger" id="verify-delete-toast" title="Are you sure you want to delete your account?" static no-auto-hide> 
                      <b-button variant="primary" @click="deleteAccount()">Yes, delete my account</b-button>
                      <b-button variant="danger" @click="hideToast('verify-delete-toast')">No, cancel this action</b-button>
                    </b-toast>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
</template>

<script>
import axios from "axios";
import { eventBus } from "../../main";
import { handleError, handleSuccess, clearMessagesImmediate } from "../handlers";
import constants from "../../../constants";
import OwnedBusinesses from "../Business/OwnedBusinesses";

export default {
  name: "UserSettings",
  components: {
    OwnedBusinesses
  },
  data() {
    return {
      errors: [],
      successes: [],
      pwdType: "password",
      newUsername: "",
      newPassword: "",
      newPwdType: "password",
      oldPassword: "",
      oldPwdType: "password",
      businesses: [],
      showBusinesses: false,
      showGeneralSettings: false,
    }
  },
  props: {
    accountType: String
  },
  computed: {
      isBusinessType: function(){
        return this.accountType == constants.businessType;
      }
  },  
  methods: {
    signOut: function() {
      clearMessagesImmediate(this.errors, this.successes);
      axios
        .delete("/api/users/signout", {})
        .then((res) => {
          // handle success
          this.$cookie.set("user-auth", "");
          eventBus.$emit('signout-success', res);
          handleSuccess(res, this.successes);
        })
        .catch(err => {
          // handle error
          handleError(err, this.errors);
        });
      this.$router.push("/");
    },

    togglePwdVisibility: function(pwdType) {
      this[pwdType] = this[pwdType] == "password" ? "text" : "password";
    }, 

    changeUsername: function() {
      const bodyContent = { 
        username: this.newUsername 
      };
      clearMessagesImmediate(this.errors, this.successes);
      this.hideAllToasts();

      axios
        .put("/api/users/change-username", bodyContent)
        .then((res) => {
          // handle success
          eventBus.$emit('change-username-success', res);
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
          this.newUsername = "";
        });
    },

    changePassword: function() {
      const bodyContent = { 
        oldPassword: this.oldPassword,
        password: this.newPassword 
      };
      clearMessagesImmediate(this.errors, this.successes);
      this.hideAllToasts();

      axios
        .put("/api/users/change-password", bodyContent)
        .then((res) => {
          // handle success
          eventBus.$emit('change-password-success', res);
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
          this.newPassword = "";
          this.oldPassword = "";
        });
    },

    deleteAccount: function() {
      const bodyContent = {};
      clearMessagesImmediate(this.errors, this.successes);
      
      axios
        .delete("/api/users/deleteAccount", bodyContent)
        .then((res) => {
          // handle success
          this.$cookie.set("user-auth", "");
          eventBus.$emit('delete-account-success', res);
          handleSuccess(res, this.successes);
          this.$router.push('/');
        })
        .catch(err => {
          // handle error
          handleError(err, this.errors);
        });
    },

    showToast: function(id) {
      this.$bvToast.show(id);
    },

    hideToast: function(id) {
      this.$bvToast.hide(id);
    },

    hideAllToasts: function() {
      this.hideToast("success-toast");
      this.hideToast("error-toast");
      this.hideToast("verify-delete-toast");
    },

    toggleOpenBusinesses: function() {
      clearMessagesImmediate(this.errors, this.successes);
      this.showBusinesses = true;
      
      axios 
        .get("/api/businesses/claimed", {}) 
        .then((res) => {
          this.businesses = res.data.results;
          handleSuccess(res, this.successes);
        })
        .catch(err => {
          handleError(err, this.errors);
        })
    },
    toggleOpenGeneral: function() {
      this.showGeneralSettings = true;
    },
    toggleCloseBusinesses: function() {
      this.showBusinesses = false;
    },
    toggleCloseGeneral: function() {
      this.showGeneralSettings = false;
    }
  }
};
</script>