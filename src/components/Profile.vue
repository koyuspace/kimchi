<template>
  <div>
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

    async function getProfile() {
      try {
        loading.value = true
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
        alert(error.message)
      } finally {
        loading.value = false
      }
    }

    async function updateProfile() {
      try {
        loading.value = true
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

        if (error) throw error
      } catch (error) {
        alert(error.message)
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

      updateProfile
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
h1 {
  text-align: center;
  margin-top: 20px;
}
</style>