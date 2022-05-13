<template>
    <b-navbar toggleable="lg" type="dark" variant="info" sticky>
        <b-navbar-brand href="/"> The Safe Samaritan </b-navbar-brand>
            <span v-if="!isSignedIn">   
                <b-navbar-nav right>
                    <b-nav-item href="/" right>Home</b-nav-item>
                    <b-nav-item href="/login" right>Login</b-nav-item>
                </b-navbar-nav>
            </span>
            <span v-else>
                <b-navbar-nav>
                    <b-nav-item href="/" right>Home</b-nav-item>
                    <b-nav-item href="/profile" right>Profile</b-nav-item>
                    <b-nav-item @click="logOut()" right>Logout</b-nav-item>
                </b-navbar-nav>
            </span>
    </b-navbar>
</template>

<script>
import axios from "axios";
import { eventBus } from "../main";

export default {
    name: "NavBar",
    components: {
    },
    props: {
        isSignedIn: Boolean
    },
    methods: {
        logOut: function(){
            axios
                .delete("/api/users/signout", {})
                .then((res) => {
                    // handle success
                    this.$cookie.set("user-auth", "");
                    eventBus.$emit('signout-success', res);
                    //handleSuccess(res, this.successes);
                })
                .catch(err => {
                    // handle error
                    console.log(err);
                    //handleError(err, this.errors);
                });
            this.$router.push("/");
        }
    }
}
</script>