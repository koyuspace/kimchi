<template>
  <div>
    <svg xmlns="http://www.w3.org/2000/svg" style="display: none;">
      <symbol id="exclamation-triangle-fill" fill="currentColor" viewBox="0 0 16 16">
        <path d="M8.982 1.566a1.13 1.13 0 0 0-1.96 0L.165 13.233c-.457.778.091 1.767.98 1.767h13.713c.889 0 1.438-.99.98-1.767L8.982 1.566zM8 5c.535 0 .954.462.9.995l-.35 3.507a.552.552 0 0 1-1.1 0L7.1 5.995A.905.905 0 0 1 8 5zm.002 6a1 1 0 1 1 0 2 1 1 0 0 1 0-2z"/>
      </symbol>
      <symbol id="check-circle-fill" fill="currentColor" viewBox="0 0 16 16">
        <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zm-3.97-3.03a.75.75 0 0 0-1.08.022L7.477 9.417 5.384 7.323a.75.75 0 0 0-1.06 1.06L6.97 11.03a.75.75 0 0 0 1.079-.02l3.992-4.99a.75.75 0 0 0-.01-1.05z"/>
      </symbol>
    </svg>
    <div class="container" style="padding: 50px 0 100px 0">
      <div class="alert alert-danger d-flex align-items-center" role="alert" v-bind:data-error="isError">
        <svg class="bi flex-shrink-0 me-2" width="24" height="24" role="img" aria-label="Danger:"><use xlink:href="#exclamation-triangle-fill"/></svg>
        <div>
          {{ errorMessage }}
        </div>
      </div>
      <div class="alert alert-success d-flex align-items-center" role="alert" v-bind:data-success="isSuccess">
        <svg class="bi flex-shrink-0 me-2" width="24" height="24" role="img" aria-label="Success:"><use xlink:href="#check-circle-fill"/></svg>
        <div>
          Check your email for the login link!
        </div>
      </div>
      <form class="row flex flex-center" @submit.prevent="handleLogin">
        <div class="col-6 form-widget">
          <h1 class="header logo">김치</h1>
          <p class="description">Sign in via magic link with your email below</p>
          <div>
            <input
              class="form-control"
              type="email"
              placeholder="Your email"
              v-model="email"
            />
          </div>
          <div>
            <input
              type="submit"
              class="btn btn-primary"
              :value="loading ? 'Loading...' : 'Send magic link'"
              :disabled="loading"
            />
          </div>
        </div>
      </form>
    </div>
    <footer>
      &copy; 2021 The Kimchi Project
    </footer>
  </div>
</template>

<script>
import { ref } from "vue"
import { supabase } from "../supabase"

export default {
  setup() {
    const loading = ref(false)
    const isError = ref(false)
    const isSuccess = ref(false)
    const email = ref("")
    const errorMessage = ref("")

    const handleLogin = async () => {
      isError.value = false
      isSuccess.value = false
      try {
        loading.value = true
        const { error } = await supabase.auth.signIn({ email: email.value })
        if (error) throw error
        isSuccess.value = true
      } catch (error) {
        errorMessage.value = error.error_description || error.message;
        isError.value = true
      } finally {
        loading.value = false
      }
    }

    return {
      loading,
      email,
      handleLogin,
      isError,
      errorMessage,
      isSuccess,
    }
  },
}
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Black+Han+Sans&display=swap');
.logo {
  font-family: 'Black Han Sans', sans-serif;
  font-size: 52pt;
  color: #000;
  user-select: none;
}
div {
  text-align: center;
}
footer {
  position: fixed;
  left: 50%;
  bottom: 20px;
  transform: translate(-50%, -50%);
  margin: 0 auto;
  font-size: 8pt;
  color: #aaa;
}
.btn {
  margin-top: 20px;
}
div[data-error="false"] {
  display: none !important;
}
div[data-success="false"] {
  display: none !important;
}
</style>