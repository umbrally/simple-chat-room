<template>
  <div id="chat_room">
    <v-app>
      <!-- <main role="main" class="bg-white"> -->
      <Navbar app />
      <v-content>
        <router-view />
      </v-content>
      <!-- </main> -->
    </v-app>
  </div>
</template>

<script>
import "bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import Navbar from "./components/Navbar";
export default {
  name: "App",
  components: {
    Navbar
  }
};
</script>
<style scoped>
/* main {
  margin-top: 65px !important;
} */
v-content {
  margin-top: 150px;
}
</style>
