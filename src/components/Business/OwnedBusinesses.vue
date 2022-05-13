<template>
  <div>
    <ul style="list-style-type: none; padding: 0;">
      <li v-for="biz in businesses" v-bind:key="getKey(biz)">
        <h2>{{biz.businessName}}</h2>
        <BusinessSettings v-bind:business="biz"/>
      </li>
    </ul>
  </div>
</template>

<script>
import BusinessSettings from "../Business/BusinessSettings";

export default {
    name: "OwnedBusinesses",
    components:{
      BusinessSettings
    },
    props: {
      businesses: Array
    }, 
    methods: {
      getKey: function(biz) {
        let key = "";
        for (let i in biz) {
          key += biz[i];
        }
        return key;
      }
    }
}
</script>