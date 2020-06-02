<template>
  <!-- <v-card class="overflow-hidden"> -->
  <div>
    <div ref="appBar">
      <v-app-bar
        fixed
        color="#fcb69f"
        dark
        shrink-on-scroll
        src="https://picsum.photos/id/112/1920/1080"
      >
        <template v-slot:img="{ props }">
          <v-img v-bind="props" gradient="to top right, rgba(19,84,122,.5), rgba(128,208,199,.8)"></v-img>
        </template>

        <v-app-bar-nav-icon></v-app-bar-nav-icon>

        <v-toolbar-title>Simple Chat Room</v-toolbar-title>
        <v-spacer></v-spacer>
        <template v-if="isAuthenticated">
          <v-chip
            v-scroll="scrollHandle"
            class="mt-2 mr-4"
            :style="isScroll? denseClass: largeClass"
            color="primary"
            label
          >
            <v-icon left>mdi-account-circle-outline</v-icon>
            目前共有 {{onlineCount}} 人在線上
          </v-chip>
          <v-btn icon class="mr-2" @click="logout">
            登出
            <br />
            <v-icon large>mdi-logout</v-icon>
          </v-btn>
        </template>
      </v-app-bar>
    </div>
  </div>
  <!-- </v-card> -->
</template>

<script>
import { mapState } from "vuex";
import { Toast } from "./../utils/helpers";
export default {
  computed: {
    ...mapState(["isAuthenticated"])
  },
  data() {
    return {
      onlineCount: 0,
      isScroll: false,
      denseClass: { position: "fixed", top: "56px" },
      largeClass: { position: "fixed", top: "128px" }
    };
  },

  methods: {
    logout() {
      this.$store.commit("revokeAuthentication");
      this.$router.push("/signin");
    },
    scrollHandle() {
      console.log("scroll", window.scrollY);
      if (window.scrollY > 50) {
        this.isScroll = true;
      } else {
        this.isScroll = false;
      }
    }
  },
  sockets: {
    online: function(onlineCount) {
      console.log("收到online");
      this.onlineCount = onlineCount;
    },
    error: function(error) {
      Toast.fire({
        icon: "error",
        title: error
      });
    }
  }
};
</script>