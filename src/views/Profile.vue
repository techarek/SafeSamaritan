<template>
  <div>
    <NavBar v-bind:isSignedIn="isSignedIn"/>
    <div class="home-row">
      <div class="home-column">
        <b-card>
          <b-tabs card>
          <b-tab no-body title="Notifications" active v-if="!isGovernmentType">
              <b-card-text>
                  <NotificationInbox v-bind:accountType="accountType" />
              </b-card-text>
          </b-tab>
          <b-tab no-body title="Reports" v-if="!isGeneralType">
              <b-card-text><ReportInbox v-bind:accountType="accountType" /></b-card-text>
          </b-tab>
          <b-tab no-body title="Requests" v-if="isGovernmentType">
              <b-card-text><RequestInbox v-bind:accountType="accountType" /></b-card-text>
          </b-tab>
          <b-tab no-body title="Compose Message" v-if="!isGeneralType">
              <b-card-text><ComposeMessage v-bind:accountType="accountType"/></b-card-text>
          </b-tab>
          </b-tabs>
      </b-card>
      <br>
      <h3> Favorites </h3>
      <div>
        <b-list-group style="list-style-type: none; padding: 0;">
          <b-list-group-item v-for="biz in favorites" v-bind:key="biz.name + biz.address" class="business-box">
            <BusinessBlock 
                v-bind:business="biz" 
                v-bind:accountType="accountType"
                v-bind:positionAvailable=false
                v-bind:userPosition=[]
                v-bind:isSignedIn="isSignedIn"
            />
          </b-list-group-item>
        </b-list-group>
    </div>
        
      </div>
      <div class="home-column">
        <UserSettings v-bind:accountType="accountType"/>
      </div>
    </div>
  </div>
</template>

<script>
import constants from "../../constants";
import { eventBus } from "../main";
import UserSettings from "../components/Profile/UserSettings";
import ComposeMessage from "../components/Profile/ComposeMessage";
import NotificationInbox from "../components/Profile/NotificationInbox";
import RequestInbox from "../components/Profile/RequestInbox";
import ReportInbox from "../components/Profile/ReportInbox";
import NavBar from "../components/NavBar";
import BusinessBlock from "../components/Business/BusinessBlock";
import { handleError, handleSuccess, clearMessages } from "../components/handlers";
import axios from "axios";

export default {
  name: "Profile",
  components: {
    UserSettings, 
    ComposeMessage,
    NotificationInbox,
    ReportInbox,
    RequestInbox,
    NavBar,
    BusinessBlock
  },
  data() {
    return {
      isSignedIn: false, 
      accountType: this.$cookie.get("acc-type"),
      favorites: []
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
    this.getFavorites();
  },
  methods:{
    getFavorites: function() {
      let bodyContent = {};
      axios
      .get("/api/businesses/starred", bodyContent)
      .then((res) => {
        // handle success
        // this.favorites = res.data;
        if(!(res.data instanceof Array)){
            res.data.data = [res.data.data];
        }
        this.favorites = [];

        for (let i = 0; i < res.data.data.length; i++) {
          let biz = res.data.data[i];
          this.favorites.push({
              id: biz.id, 
              name: biz.businessName, 
              address: biz.businessAddress, 
              phone: biz.businessPhone, 
              owner: biz.owner,
              ownsBusiness: biz.ownsBusiness,
              businessOpen: biz.businessOpen, 
              website: biz.website,
              facebook: biz.facebook,
              twitter: biz.twitter,
              instagram: biz.instagram,
              masksRequired: biz.masksRequired,
              sociallyDistanced: biz.sociallyDistanced,
              handWashing: biz.handWashing,
              handSanitizer: biz.handSanitizer,
              sneezeGuards: biz.sneezeGuards,
              indoorDining: biz.indoorDining,
              outdoorDining: biz.outdoorDining,
              takeout: biz.takeout,
              delivery: biz.delivery,
              seniorHours: biz.seniorHours
          });
        }
        eventBus.$emit('retrieve-favorites', res);
        handleSuccess(res, this.successes);
      })
      .catch(err => {
        // handle error
        handleError(err, this.errors);
      })
      clearMessages();
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
  },
  mounted: function () {
    this.getFavorites();
  }
};
</script>