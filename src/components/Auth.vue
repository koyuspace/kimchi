<template>
  <div>
    <div class="container" style="padding: 50px 0 100px 0">
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
    const email = ref("")

    const handleLogin = async () => {
      try {
        loading.value = true
        const { error } = await supabase.auth.signIn({ email: email.value })
        if (error) throw error
        alert("Check your email for the login link!")
      } catch (error) {
        alert(error.error_description || error.message)
      } finally {
        loading.value = false
      }
    }

    return {
      loading,
      email,
      handleLogin,
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
</style>