module.exports = {
  publicPath: process.env.NODE_ENV === 'production'
    ? '/simple-chat-room-vue/' : "./",
  "transpileDependencies": [
    "vuetify"
  ]
}