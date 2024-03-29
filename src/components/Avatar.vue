<template>
  <div>
    <img
      v-if="src"
      :src="src"
      alt="Avatar"
      class="avatar image"
      :style="{ height: size, width: size }"
    />
    <img
      v-else
      class="avatar no-image"
      :style="{ height: size, width: size }"
      alt="Avatar"
      :src="gravatar"
    />
    <div :style="{ width: size }">
      <label class="upload-button block" for="single">
        <input
        style="visibility: hidden; position: absolute"
        type="file"
        id="single"
        accept="image/*"
        @change="uploadAvatar"
        :disabled="uploading"
        />
      </label>
    </div>
  </div>
</template>

<script>
import { ref, toRefs, watch } from "vue"
import { supabase } from "../supabase"
import { store } from "../store"
import md5 from "md5"

export default {
  props: {
    path: String,
  },
  computed: {
    gravatar: {
      get() {
        return "https://www.gravatar.com/avatar/"+md5(store.user.email)+"?d=mp&s=160"
      }
    }
  },
  emits: ["upload", "update:path"],
  setup(prop, { emit }) {
    const { path } = toRefs(prop)
    const size = ref("10em")
    const uploading = ref(false)
    const src = ref("")
    const files = ref()

    const downloadImage = async () => {
      try {
        const { data, error } = await supabase.storage
          .from("avatars")
          .download(path.value)
        if (error) throw error
        src.value = URL.createObjectURL(data)
      } catch (error) {
        console.error("Error downloading image: ", error.message)
      }
    }

    const uploadAvatar = async (evt) => {
      files.value = evt.target.files
      try {
        uploading.value = true
        if (!files.value || files.value.length === 0) {
          throw new Error("You must select an image to upload.")
        }

        const file = files.value[0]
        const fileExt = file.name.split(".").pop()
        const fileName = `${Math.random()}.${fileExt}`
        const filePath = `${fileName}`

        let { error: uploadError } = await supabase.storage
          .from("avatars")
          .upload(filePath, file)

        if (uploadError) throw uploadError
        emit("update:path", filePath)
        emit("upload")
      } catch (error) {
        alert(error.message)
      } finally {
        uploading.value = false
      }
    }

    watch(path, () => {
      path.value ? downloadImage() : ""
    })

    return {
      path,
      size,
      uploading,
      src,
      files,

      uploadAvatar,
    }
  },
}
</script>

<style scoped>
div {
  margin: 0 auto;
}
.upload-button {
  height: 12.5em;
  width: 12.5em;
  position: absolute;
  margin-top: -12.5em;
  border-radius: 50%;
}
.avatar {
  display: block;
  margin: 0 auto;
}
img,
input,
label {
  cursor: pointer;
}
</style>