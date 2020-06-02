<template>
  <div class="v-container mb-2 main-content">
    <div class="row justify-content-center">
      <div class="border border-primary rounded w-50" style="min-height: 400px">
        <ul v-if="msgs.length>0" class="list-group">
          <li v-for="msg in msgs" :key="msg.id" class="list-group-item border-0">
            <div
              :class="[msg.UserId===currentUser.id? 'justify-content-end, flex-row-reverse': 'justify-content-start', 'row']"
            >
              <div class="col-md-2">
                <img :src="msg.User.image | emptyImage" class="img-thumbnail" />
              </div>
              <div class="col-md-8">
                <template v-if="msg.UserId===currentUser.id">
                  <div class="text-right">{{msg.User.name}}</div>
                  <div class="mt-2 text-right">
                    <span class="text-muted mr-2">{{ msg.createdAt | fromNow}}</span>
                    <span class="p-2 speech-bubble-self">{{msg.content}}</span>
                  </div>
                </template>
                <template v-else>
                  <div>{{msg.User.name}}</div>
                  <div class="mt-2">
                    <span class="p-2 speech-bubble">{{msg.content}}</span>
                    <span class="text-muted ml-2">{{ msg.createdAt | fromNow}}</span>
                  </div>
                </template>
              </div>
            </div>
          </li>
        </ul>
      </div>
    </div>
    <div class="row justify-content-center mt-3">
      <div id="send-box" class="w-50">
        <form id="send-form" @keyup.enter="sendMessage" @submit.stop.prevent="sendMessage">
          <v-text-field name="msg" id="msg" placeholder="說點什麼？" v-model="newMsg" required outlined></v-text-field>
          <button type="submit" class="btn btn-primary" :disabled="!newMsg">送出</button>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import uuid from "uuid/v4";
import { fromNowFilter } from "./../utils/mixins";
import { emptyImageFilter } from "./../utils/mixins";
import { Toast, ToastBottom } from "./../utils/helpers";
import messageAPI from "./../apis/message";
import { mapState } from "vuex";

export default {
  mixins: [fromNowFilter, emptyImageFilter],
  data() {
    return {
      newMsg: "",
      msgs: [],
      isLoading: true,
      onlineCount: 0
    };
  },
  computed: {
    ...mapState(["currentUser"])
  },
  sockets: {
    connect: function() {
      console.log("socket connected");
    },
    // online: function(onlineCount) {
    //   console.log("收到online");
    //   this.onlineCount = onlineCount;
    // },
    signInUser: function(user) {
      if (this.currentUser.id === user.userId) {
        return;
      }
      ToastBottom.fire({
        icon: "info",
        title: `${user.userName}上線了`
      });
    },
    msg: function(data) {
      this.msgs.push({ ...data, id: uuid(), createdAt: Date.now() });
    },
    error: function(error) {
      Toast.fire({
        icon: "error",
        title: error
      });
    }
  },
  created() {
    this.fetchHistoryMessages();
  },
  methods: {
    async sendMessage() {
      try {
        if (this.newMsg === "") return;
        this.$socket.emit("send", {
          content: this.newMsg,
          UserId: this.currentUser.id,
          User: this.currentUser
        });
        this.newMsg = "";
      } catch (error) {
        Toast.fire({
          icon: "error",
          title: "訊息儲存失敗，請再試一次"
        });
      }
    },
    async fetchHistoryMessages() {
      try {
        const response = await messageAPI.getHistoryMessages();
        // STEP 2：將 response 中的 data 和 statusText 取出
        const { data, statusText } = response;
        // STEP 3：如果 statusText 不是 OK 的話則進入錯誤處理
        if (statusText !== "OK") {
          throw new Error(statusText);
        }
        this.msgs = data.historicalMsgs;
      } catch (error) {
        Toast.fire({
          icon: "error",
          title: "無法取得歷史訊息，請稍後再試"
        });
      }
    }
  }
};
</script>
<style scoped>
.speech-bubble {
  position: relative;
  background: #00aabb;
  border-radius: 0.4em;
}

.speech-bubble:after {
  content: "";
  position: absolute;
  left: 0;
  top: 50%;
  width: 0;
  height: 0;
  border: 15px solid transparent;
  border-right-color: #00aabb;
  border-left: 0;
  border-top: 0;
  margin-top: -7.5px;
  margin-left: -15px;
}

.speech-bubble-self {
  position: relative;
  background: #ff80ff;
  border-radius: 0.4em;
}

.speech-bubble-self:after {
  content: "";
  position: absolute;
  right: 0;
  top: 50%;
  width: 0;
  height: 0;
  border: 15px solid transparent;
  border-left-color: #ff80ff;
  border-right: 0;
  border-top: 0;
  margin-top: -7.5px;
  margin-right: -15px;
}

.main-content {
  margin-top: 150px;
}
</style>