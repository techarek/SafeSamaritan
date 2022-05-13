<template>
  <div>
    <NavBar v-bind:isSignedIn="isSignedIn"/>
    <div>
      <b-container fluid="true">
        <b-row cols="2" align-v="stretch" class="h-100">
          <b-col>
            <Map/>
          </b-col>
          <b-col>
            <div styel="margin-left: 10px;">
              <Search/>
              <FilterSettings/>
            </div>
            <br>
            <ResultsList 
              v-bind:accountType="accountType"
              v-bind:positionAvailable="positionAvailable" 
              v-bind:userPosition="userPosition"
              v-bind:isSignedIn="isSignedIn"
            />      
          </b-col>
        </b-row>
      </b-container>
    </div>
  </div>
</template>

<script>
import { eventBus } from "../main";
import FilterSettings from "../components/Home/FilterSettings";
import ResultsList from "../components/Home/ResultsList";
import Map from "../components/Map";
import Search from "../components/Home/Search";
import NavBar from "../components/NavBar";

export default {
  name: "Main",
  components: {
    FilterSettings,
    ResultsList,
    Map,
    Search,
    NavBar
  },
  data() {
    return {
      isSignedIn: false, 
      accountType: this.$cookie.get("acc-type"),
      positionAvailable: false,
      userPosition: []
    }
  },
  created: function () {
    let authenticated = this.$cookie.get("user-auth");
    if (authenticated) {
      this.isSignedIn = true;
    }

    eventBus.$on("signin-success", () => {
      this.isSignedIn = true;
    });

    eventBus.$on("signout-success", () => {
      this.isSignedIn = false;
    });
    this.getLocation();
  },
  methods: {
    updateAccountType: function(accountType){
      this.accountType = accountType;
    },
    getLocation: function(){
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(this.saveCoordinates);
      } else {
        this.positionAvailable = false;
      }
    },
    saveCoordinates: function(position){
      if(position != null && position != undefined){
        this.userPosition = [position.coords.latitude, position.coords.longitude];
        this.positionAvailable = true;
      }
    }
  }
};
</script>
