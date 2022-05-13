<template>
  <div>
    <div v-if='errors.length' class="error-message" style="width: 250px;">
      <b>We encountered the following error(s):</b>
      <ul>
        <li v-for='error in errors' v-bind:key='error'>{{ error }}</li>
      </ul>
    </div>
    <br>
    <form id="apply-search" v-on:submit.prevent="getResults" method="get">
      <b-form-input id="queryTxt" style="width: 95%;" v-model.trim="queryTxt" type="text" name="queryTxt" placeholder="Search by Business Name"/>
      <b-form-input id="queryAddress" style="width: 95%;" v-model.trim="queryAddress" type="text" name="queryAddress" placeholder=" Search by Address"/> 
      <br>
      <b-button size="sm" type="submit">Search</b-button>
    </form>
  </div>
</template>

<script>
// import axios from "axios";
import { eventBus } from "../../main";

export default {
  name: "Search",

  data() {
    return {
      queryTxt: "", 
      queryAddress: "", 
      errors: [],
      safetyOptions: {}, 
      serviceOptions: {}
    }
  },

  created: function () {
    eventBus.$on("filters-retrieved", (safetyOptions, serviceOptions) => {
      this.safetyOptions = safetyOptions;
      this.serviceOptions = serviceOptions;
    });
  },

  methods: {
    getResults: function(){
      this.errors = [];

      eventBus.$emit("submit-search", this.queryTxt, this.queryAddress);
    }
  },

  beforeDestroy: function () {
    eventBus.$off("submit-search");
  }
};
</script>