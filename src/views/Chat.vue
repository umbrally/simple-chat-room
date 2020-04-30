<template>
  <div class="container">
    <div class="row justify-content-center">
      <div class="border border-primary rounded w-50" style="min-height: 400px">
        <ul v-if="msgs.length>0" class="list-group">
          <li v-for="msg in msgs" :key="msg.id" class="list-group-item border-0">
            <div
              :class="[msg.user.id===user.id? 'justify-content-end, flex-row-reverse': 'justify-content-start', 'row']"
            >
              <div class="col-md-2">
                <img :src="msg.user.image | emptyImage" class="img-thumbnail" />
              </div>
              <div class="col-md-8">
                <template v-if="msg.user.id===user.id">
                  <div class="text-right">{{msg.user.name}}</div>
                  <div class="mt-2 text-right">
                    <span class="text-muted mr-2">{{ msg.createdAt | fromNow}}</span>
                    <span class="p-2 speech-bubble-self">{{msg.msg}}</span>
                  </div>
                </template>
                <template v-else>
                  <div>{{msg.user.name}}</div>
                  <div class="mt-2">
                    <span class="p-2 speech-bubble">{{msg.msg}}</span>
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
        <form id="send-form">
          <!-- <input type="text" name="name" id="name" placeholder="暱稱" /> -->
          <input
            type="text"
            class="w-100 mb-1"
            name="msg"
            id="msg"
            placeholder="說點什麼？"
            v-model="newMsg"
          />
          <button type="button" class="btn btn-primary" @click.stop.prevent="sendMessage">送出</button>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import uuid from "uuid/v4";
import { fromNowFilter } from "./../utils/mixins";
import { emptyImageFilter } from "./../utils/mixins";
const currentUser = { id: 3, image: "https://picsum.photos/50", name: "PoPo" };
const dummyData = [
  {
    id: 1,
    msg: "test",
    user: { id: 1, image: "https://picsum.photos/50", name: "Zoey" },
    createdAt: Date.now()
  },
  {
    id: 2,
    msg: "Hi",
    user: { id: 2, image: "https://picsum.photos/50", name: "Maggie" },
    createdAt: Date.now()
  }
];
export default {
  // components: {
  // }
  mixins: [fromNowFilter, emptyImageFilter],
  data() {
    return {
      newMsg: "",
      user: {},
      msgs: []
    };
  },
  sockets: {
    connect: function() {
      console.log("socket connected aaa");
    },
    msg: function(data) {
      console.log("bbb", data);
      this.msgs.push({ ...data, id: uuid(), createdAt: Date.now() });
      console.log("aaa", this.msgs);
    }
  },
  created() {
    this.fetchHistoryMessages();
    this.user = currentUser;
  },
  methods: {
    sendMessage() {
      this.$socket.emit("send", {
        msg: this.newMsg,
        user: this.user
      });
      this.newMsg = "";
    },
    fetchHistoryMessages() {
      this.msgs = dummyData;
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
</style>