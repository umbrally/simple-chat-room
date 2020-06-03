<template>
  <v-container fluid class="main-content p-0">
    <v-row justify="center" no-gutters class="side-banner" align="center">
      <v-overlay :absolute="true" z-index="0"></v-overlay>
      <v-col cols="10" sm="5" xs="5">
        <v-card elevation="5" class="p-3 mx-auto" outlined>
          <form class="w-100" @submit.prevent.stop="handleSubmit">
            <div class="text-center mb-4">
              <h1 class="h3 mb-3 font-weight-normal">Sign In</h1>
            </div>

            <div class="form-label-group mb-2">
              <label for="email">email</label>
              <input
                id="email"
                v-model="email"
                name="email"
                type="email"
                class="form-control"
                placeholder="email"
                required
                autofocus
              />
            </div>

            <div class="form-label-group mb-3">
              <label for="password">Password</label>
              <input
                id="password"
                v-model="password"
                name="password"
                type="password"
                class="form-control"
                placeholder="Password"
                required
              />
            </div>

            <button
              class="btn btn-lg btn-primary btn-block mb-3"
              type="submit"
              :disabled="isProcessing"
            >Submit</button>

            <div class="text-center mb-3">
              <p>
                <router-link to="/signup">Sign Up</router-link>
              </p>
            </div>
          </form>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import authorizationAPI from "./../apis/authorization";
import { Toast } from "./../utils/helpers";
export default {
  name: "SignIn",
  data() {
    return {
      email: "",
      password: "",
      isProcessing: false
    };
  },
  methods: {
    async handleSubmit() {
      // 如果 email 或 password 為空，則使用 Toast 提示
      // 然後 return 不繼續往後執行
      try {
        if (!this.email || !this.password) {
          Toast.fire({
            type: "warning",
            title: "請填入 email 和 password"
          });
          return;
        }
        this.isProcessing = true;

        let response = await authorizationAPI.signIn({
          email: this.email,
          password: this.password
        });

        const { data, statusText } = response;
        if (statusText !== "OK" || data.status !== "success") {
          throw new Error(statusText);
        }
        localStorage.setItem("token", data.token);
        this.$store.commit("setCurrentUser", data.user);
        this.$router.push("/chat");
        this.$socket.emit("signIn", {
          userName: response.data.user.name,
          userId: response.data.user.id
        });
      } catch (error) {
        // 將密碼欄位清空
        this.password = "";

        // 顯示錯誤提示
        Toast.fire({
          icon: "warning",
          title: "請確認您輸入的帳號密碼錯誤"
        });
        this.isProcessing = false;
        console.log("error", error);
      }
    }
  }
};
</script>
<style scoped>
.side-banner {
  background-image: url("../../public/new-data-services-UO-QYR28hS0-unsplash.jpg");
  background-size: cover;
  background-position: top right;
  background-repeat: no-repeat;
  width: 100%;
  height: 500px;
}
</style>
