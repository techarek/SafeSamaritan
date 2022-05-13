<template>
    <div style="text-align: left;">
        <br>
        <i> The following safety options have been verified by the owner:</i>
        <br><br>
        <ul>
            <li v-if="masksRequired">Masks Required</li>
            <li v-if="sociallyDistanced">Social Distancing Practiced</li>
            <li v-if="sneezeGuards">Sneeze Guards Used</li>
            <li v-if="handwashingAvailable">Hand Washing Available</li>
            <li v-if="handSanitizerAvailable">Hand Sanitizer Available</li> 
            <li v-if="indoorDining">Indoor Dining Available</li> 
            <li v-if="outdoorDining">Outdoor Dining Available</li> 
            <li v-if="takeout">Takeout Available</li> 
            <li v-if="delivery">Delivery Available</li> 
            <li v-if="seniorHours">Has Senior Hours</li> 
        </ul> 
        <br>
    </div>
</template>

<script>
export default {
    name: "BusinessSafetyContent",
    props: {
        business: Object
    },
    data() {
        return {
            masksRequired: false, 
            sociallyDistanced: false,
            sneezeGuards: false, 
            handwashingAvailable: false, 
            handSanitizerAvailable: false,
            indoorDining: false,
            outdoorDining: false, 
            takeout: false,
            delivery: false, 
            seniorHours: false,
        }
    },
    create: function(){
        this.updateInfo();
    },
    mounted() {
        this.updateInfo();
    },
    methods: {
        updateInfo: function(){
            this.masksRequired = this.business.masksRequired;
            this.sociallyDistanced = this.business.sociallyDistanced;
            this.sneezeGuards = this.business.sneezeGuards;
            this.handwashingAvailable = this.business.handWashing;
            this.handSanitizerAvailable = this.business.handSanitizer;
            this.indoorDining = this.business.indoorDining;
            this.outdoorDining = this.business.outdoorDining;
            this.takeout = this.business.takeout;
            this.delivery = this.business.delivery;
            this.seniorHours = this.business.seniorHours;
        }
    }
}
</script>