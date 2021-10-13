<template>
    <div>
        <div class="widget">
            <h1>Firewall</h1>
            <pre v-html="ufw_status"></pre>
        </div>
    </div>
</template>

<style scoped>
div {
    margin: 20px;
}
h1 {
    font-weight: 800;
    text-align: center;
    margin-bottom: 40px;
}
.widget {
    display: block;
    margin: 0 auto;
    background: #eee;
    padding: 40px;
    padding-bottom: 20px;
    border-radius: 4px;
    border: 1px solid #ccc;
    width: 40%;
}
</style>

<script>
import { store } from "../store"
import axios from 'axios'

export default {
    data: function() {
        return {
            ufw_status: ''
        }
    },
    created() {
        const backend = import.meta.env.VITE_BACKEND
        axios.post(backend+"/api/v1/ufw/status", {user_id: store.user.id}).then(response => {
            this.ufw_status = response.data
        })
    }
}
</script>