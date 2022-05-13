<template>
    <div style="text-align: left;">
        <br>
        <i style="font-size:small; margin-right: 10px;">
            <b>Note:</b> Businesses whose owners are not on this platform and have not verified their information may be filtered out by your search criteria
        </i>
        <br><br>
        <b-row cols="2" style="margin-right: 10px;">
            <b-col>
                <b-button :pressed.sync="servicePressed" v-b-toggle.collapse-1 :variant="serviceStyle">Service Options</b-button>
                <b-collapse id="collapse-1" class="mt-2">
                    <b-card>
                        <keep-alive>
                            <ul style="list-style-type: none; padding:0; margin: 0;"> 
                                <li v-for="item in serviceOptions" :key="item.name" style="margin: 10px;">
                                    <input type="checkbox" :id="item.name" @click="toggle(item)"/>
                                        {{ item.name }}
                                </li>
                            </ul>
                        </keep-alive>
                    </b-card>
                </b-collapse>
            </b-col>
            <b-col>
                <b-button id="safetyButton" :pressed.sync="safetyPressed" v-b-toggle.collapse-2 :variant="safetyStyle">Safety Options</b-button>
                <b-collapse id="collapse-2" class="mt-2">
                    <b-card>
                        <keep-alive>
                            <ul style="list-style-type: none; padding:0; margin: 0;">
                            <li v-for="item in safetyOptions" :key="item.name" style="margin: 10px;">
                                <input type="checkbox" :id="item.name" @click="toggle(item)"/> 
                                {{ item.name }}
                            </li>
                            </ul>
                        </keep-alive>
                        <b-button small v-b-popover.hover.bottom="'These safety options were chosen using the CDC safety guidelines.'" title="Safety Guidelines">
                            * Note
                        </b-button>
                    </b-card>
                </b-collapse>
            </b-col>
        </b-row>
    </div>
</template>

<script>
import { eventBus } from "../../main";

export default {
    name: "FilterSettings",
    components:{

    },
    data(){
        return{
            servicePressed: false, 
            safetyPressed: false,
            safetyOptions: [
                {id: "masksRequired", name: "Masks Required", selected: false},
                {id: "sociallyDistanced", name: "Socially Distanced", selected: false},
                {id: "handWashingAvailable", name: "Handwashing Available", selected: false},
                {id: "handSanitizerAvailable", name: "Hand Sanitizer Available", selected: false},
                {id: "sneezeGuardsUsed", name: "Sneeze Guards Used", selected: false},
            ],
            serviceOptions: [
                {id: "indoorDining", name: "Indoor Dining", selected: false},
                {id: "outdoorDining", name: "Outdoor Dining", selected: false},
                {id: "takeout", name: "Takeout", selected: false},
                {id: "delivery", name: "Delivery", selected: false},
                {id: "seniorHours", name: "Senior Hours", selected: false},
            ],
        }
    },
    computed: {
        serviceStyle: function() {
            if(this.servicePressed){
                return "primary";
            } else {
                return "outline-primary";
            }
        },
        safetyStyle: function(){
            if(this.safetyPressed){
                return "primary";
            } else {
                return "outline-primary";
            }
        }
    },
    created: function() {
        // on search entered, add the filters and emit something else so that results list can get everything
        // and return results in ResultsList.vue
        eventBus.$on("submit-search", (queryTxt, queryAddress) => {
            eventBus.$emit("filters-retrieved", queryTxt, queryAddress, this.safetyOptions, this.serviceOptions);
        });
    },
    methods: {
        toggle: function(item) {
            item.selected = !item.selected;
        },
        toggleCollapsible: function(contentId){
            var coll = document.getElementById(contentId);
            if (coll.style.display === "block") {
                coll.style.display = "none";
            } else {
                coll.style.display = "block";
            }
        }
    },
    beforeDestroy: function() {
        eventBus.$off("filters-retrieved");
    }
}
</script>