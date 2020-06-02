import { apiHelper } from './../utils/helpers'

export default {
  getHistoryMessages() {
    return apiHelper.get('/chat')
  },
  get({ userId }) {
    return apiHelper.get(`/users/${userId}`)
  },
  signUp({ name, email, password, passwordCheck }) {
    return apiHelper.post('/signup', {
      name,
      email,
      password,
      passwordCheck
    })
  },

}