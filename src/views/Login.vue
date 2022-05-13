<template>
  <div>
    <NavBar v-bind:isSignedIn="isSignedIn"/>
    <b-row> 
      <b-col>
        <div class="form-container">
          <h2> Love Local (safely).</h2>
          <span v-if=!isSignedIn> 
            <button type="button" class="collapsible" @click="openSignup()">
                Sign up for an account!
                <span style="float: right;">></span>
            </button>
            <span v-if="showSignupModal">
              <Signup/>
            </span>
            <Signin/>
          </span>
          <span v-else>
            <h1> You are now logged in! </h1>
            <h2> <router-link to="/"> Return to Home </router-link></h2>
          </span>
        </div>
      </b-col>
      <b-col>
        <img src="../../public/img/dam.png" width=100%/>
        <p><i>This service is brought to you by the <a href="https://www.cambridgema.gov/departments/citycouncil">Cambridge City Council</a> in partnership with SAUS.</i></p>
      </b-col>
    </b-row>
  </div>
</template>

<script>
import Signin from "../components/Login/Signin.vue";
import Signup from "../components/Login/Signup";
import NavBar from "../components/NavBar";
import { eventBus } from "../main";

export default {
  name: "Login",
  components: {
    Signin,
    Signup,
    NavBar
  },
  data() {
    return {
      isSignedIn: false, 
      accountType: this.$cookie.get("acc-type"),
      showSigninModal: false,
      showSignupModal: false
    }
  },
  created: function () {
    let authenticated = this.$cookie.get("user-auth");
    if (authenticated) {
      this.isSignedIn = true;
    }

    eventBus.$on("signin-success", () => {
      this.showSigninModal = false;
      this.showSignupModal = false;
      this.isSignedIn = true;
    });

    eventBus.$on("create-signup-success", () => {
      this.showSignupModal = false;
    });

    eventBus.$on("signout-success", () => {
      this.isSignedIn = false;
    });

    eventBus.$on("close-signin-modal", () =>{
      this.showSigninModal = false;
    });

    eventBus.$on("close-signup-modal", () =>{
      this.showSignupModal = false;
    });
  },
  methods:{
    openSignin: function(){
      this.showSigninModal = true;
    },
    openSignup: function(){
      this.showSignupModal = true;
    }
  }
};
</script>
