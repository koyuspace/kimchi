<template>
  <div>
    <div class="widget">
      <svg xmlns="http://www.w3.org/2000/svg" style="display: none;">
        <symbol id="exclamation-triangle-fill" fill="currentColor" viewBox="0 0 16 16">
          <path d="M8.982 1.566a1.13 1.13 0 0 0-1.96 0L.165 13.233c-.457.778.091 1.767.98 1.767h13.713c.889 0 1.438-.99.98-1.767L8.982 1.566zM8 5c.535 0 .954.462.9.995l-.35 3.507a.552.552 0 0 1-1.1 0L7.1 5.995A.905.905 0 0 1 8 5zm.002 6a1 1 0 1 1 0 2 1 1 0 0 1 0-2z"/>
        </symbol>
        <symbol id="check-circle-fill" fill="currentColor" viewBox="0 0 16 16">
          <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zm-3.97-3.03a.75.75 0 0 0-1.08.022L7.477 9.417 5.384 7.323a.75.75 0 0 0-1.06 1.06L6.97 11.03a.75.75 0 0 0 1.079-.02l3.992-4.99a.75.75 0 0 0-.01-1.05z"/>
        </symbol>
      </svg>
      <div class="alert alert-danger d-flex align-items-center" role="alert" v-bind:data-error="isError">
        <svg class="bi flex-shrink-0 me-2" width="24" height="24" role="img" aria-label="Danger:"><use xlink:href="#exclamation-triangle-fill"/></svg>
        <div>
          {{ errorMessage }}
        </div>
      </div>
      <div class="alert alert-success d-flex align-items-center" role="alert" v-bind:data-success="isSuccess">
        <svg class="bi flex-shrink-0 me-2" width="24" height="24" role="img" aria-label="Success:"><use xlink:href="#check-circle-fill"/></svg>
        <div>
          Profile successfully updated!
        </div>
      </div>
      <h1>Edit profile</h1>
      <form class="form-widget" @submit.prevent="updateProfile">
        <div id="profile">
          <Avatar v-model:path="avatar_url" @upload="updateProfile" /><br>
          <div>
            <label for="email">Email</label>
            <input id="email" class="form-control" type="text" :value="store.user.email" disabled />
          </div>
          <div>
            <label for="username">Name</label>
            <input id="username" class="form-control" type="text" v-model="username" />
          </div>
          <div>
            <label for="website">Website</label>
            <input id="website" class="form-control" type="website" v-model="website" />
          </div>

          <div>
            <input
              type="submit"
              class="btn btn-primary block"
              :value="loading ? 'Loading ...' : 'Update'"
              :disabled="loading"
            />
          </div>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
import { supabase } from "../supabase"
import { store } from "../store"
import { onMounted, ref } from "vue"
import Avatar from "./Avatar.vue"

export default {
  components: {
    Avatar,
  },
  setup() {
    const loading = ref(true)
    const username = ref("")
    const website = ref("")
    const avatar_url = ref("")
    const isError = ref(false)
    const errorMessage = ref("")
    const isSuccess = ref("false")

    async function getProfile() {
      try {
        loading.value = true
        isError.value = false
        store.user = supabase.auth.user()

        let { data, error, status } = await supabase
          .from("profiles")
          .select(`username, website, avatar_url`)
          .eq("id", store.user.id)
          .single()

        if (error && status !== 406) throw error

        if (data) {
          username.value = data.username
          website.value = data.website
          avatar_url.value = data.avatar_url
          store.user.greeting = "Hello, "+data.username+" 👋"
        } else {
          store.user.greeting = user.email
        }
      } catch (error) {
        errorMessage.value = error.message
        isError.value = true
      } finally {
        loading.value = false
      }
    }

    async function updateProfile() {
      try {
        loading.value = true
        isError.value = false
        isSuccess.value = false
        store.user = supabase.auth.user()

        const updates = {
          id: store.user.id,
          username: username.value,
          website: website.value,
          avatar_url: avatar_url.value,
          updated_at: new Date(),
        }

        let { error } = await supabase.from("profiles").upsert(updates, {
          returning: "minimal", // Don't return the value after inserting
        })

        if (error) {
          throw error
        } else {
          isSuccess.value = true
        }
      } catch (error) {
        errorMessage.value = error.message
        isError.value = true
      } finally {
        loading.value = false
      }
    }

    onMounted(() => {
      getProfile()
    })

    return {
      store,
      loading,
      username,
      website,
      avatar_url,
      updateProfile,
      isError,
      errorMessage,
      isSuccess,
    }
  },
}
</script>

<style scoped>
#profile {
  width: 30%;
  margin: 0 auto;
  margin-top: 20px;
}
.btn {
  margin-top: 20px;
}
div {
  text-align: center;
}
.alert {
  width: 50%;
  margin: 0 auto;
  margin-bottom: 20px;
  margin-top: 20px;
}
h1 {
  margin-top: 20px;
  font-weight: 800;
}
div[data-error="false"] {
  display: none !important;
}
div[data-success="false"] {
  display: none !important;
}
.widget {
  display: block;
  margin: 0 auto;
  margin-top: 20px;
  background: #eee;
  padding: 20px;
  padding-bottom: 60px;
  border-radius: 4px;
  border: 1px solid #ccc;
  width: 70%;
  text-align: center;
}
</style>