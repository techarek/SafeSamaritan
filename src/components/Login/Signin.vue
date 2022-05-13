<template>
  <div>
    <div class="form-container">
      <div>
        <b-toast variant="danger" id="error-toast" title="Sorry" static no-auto-hide> 
          <ul>
            <li v-for='error in errors' v-bind:key='error'>{{ error }}</li>
          </ul>
        </b-toast>
      </div>
      <b-form id="sign-in" v-on:submit.prevent="signIn" method="post">
          <b-form-input id='username' v-model.trim='username' type='text' name='username' placeholder="Username"/>
          <br/> <br>
          <div class="password-row">
            <b-form-input id='password' v-model.trim='password' :type="pwdType" name='password' placeholder="Password" style="display: inline-block"/>
            <br>
            <label>
              <input id="viewPassBox" type="checkbox" v-on:click="togglePwdVisibility('pwdType')" style="display: inline-block">
              <span v-if="pwdType == 'password'"> Show Password </span> 
              <span v-else> Hide Password </span>
            </label>
          </div>
          <br/>
          <b-button variant="primary" type='submit' class="loginpage-button" style="border-radius:10px;">
            Sign In 
          </b-button>
      </b-form>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import { eventBus } from "../../main";
import { handleError, handleSuccess, clearMessagesImmediate } from "../handlers";

export default {
  name: "Signin",
  data() {
    return {
      errors: [],
      successes: [],
      username: "" ,
      password: "",
      pwdType: "password",
    }
  },
  methods: {
    signIn: function() {
      const bodyContent = { username: this.username, password: this.password };
      this.hideToast("error-toast");
      clearMessagesImmediate(this.errors, this.successes);

      axios
        .post("/api/users/signin", bodyContent)
        .then((res) => {
          // handle success
          this.$cookie.set("user-auth", res.data.username);
          this.$cookie.set("acc-type", res.data.userType);
          eventBus.$emit('signin-success');
          console.log(res.data);
          handleSuccess(res, this.successes);
          this.$router.push('/');
        })
        .catch(err => {
          // handle error
          handleError(err, this.errors);
          this.showToasts("error-toast");
        })
        .then(() => {
          // always executed
          this.username = "";
          this.password = "";
        });
    },
    togglePwdVisibility: function(pwdType) {
      this[pwdType] = this[pwdType] == "password" ? "text" : "password";
    }, 
    toggleClose: function(){
      eventBus.$emit("close-signin-modal");
    },
    showToasts: function(id) {
      this.$bvToast.show(id);
    },
    hideToast: function(id) {
      this.$bvToast.hide(id);
    }
  }
};
</script>