<template>
    <div id="firewall">
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
                    {{ successMessage }}
                </div>
            </div>
            <h1>Firewall</h1>
            <pre v-html="ufw_status"></pre>
            <div class="controls">
                <div class="btn-toolbar mb-3" role="toolbar" aria-label="Toolbar with button groups">
                    <div class="btn-group me-2" role="group" aria-label="First group">
                        <button type="button" class="btn btn-success btn-outline-secondary" @click.prevent="addFirewall"><i class="fa fa-plus" aria-hidden="true"></i></button>
                        <button type="button" class="btn btn-danger btn-outline-secondary" @click.prevent="removeFirewall"><i class="fa fa-minus" aria-hidden="true"></i></button>
                    </div>
                    <div class="input-group">
                        <input type="number" required="required" class="form-control" placeholder="Port" id="port">
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped>
#firewall {
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
.btn i {
    color: #fff;
}
div[data-error="false"] {
  display: none !important;
}
div[data-success="false"] {
  display: none !important;
}
</style>

<script>
import { store } from "../store"
import axios from 'axios'

export default {
    data: function() {
        return {
            ufw_status: '',
            isError: false,
            isSuccess: false,
            errorMessage: '',
            successMessage: ''
        }
    },
    created() {
        const backend = import.meta.env.VITE_BACKEND
        axios.post(backend+"/api/v1/ufw/status", {user_id: store.user.id}).then(response => {
            this.ufw_status = response.data
        })
    },
    methods: {
        updateUfw: function() {
            const backend = import.meta.env.VITE_BACKEND
            axios.post(backend+"/api/v1/ufw/status", {user_id: store.user.id}).then(response => {
                this.ufw_status = response.data
            })
        },
        addFirewall: function() {
            this.isSuccess = false
            this.isError = false
            const backend = import.meta.env.VITE_BACKEND
            axios.post(backend+"/api/v1/ufw/add", {user_id: store.user.id, port: document.getElementById("port").value}).then(response => {
                this.isSuccess = true
                this.successMessage = "Successfully added firewall rule"
                const backend = import.meta.env.VITE_BACKEND
                axios.post(backend+"/api/v1/ufw/status", {user_id: store.user.id}).then(response => {
                    this.ufw_status = response.data
                })
            }).catch(e => {
                this.isError = true
                this.errorMessage = e
            })
        },
        removeFirewall: function() {
            this.isSuccess = false
            this.isError = false
            const backend = import.meta.env.VITE_BACKEND
            axios.post(backend+"/api/v1/ufw/del", {user_id: store.user.id, port: document.getElementById("port").value}).then(response => {
                this.isSuccess = true
                this.successMessage = "Successfully deleted firewall rule"
                const backend = import.meta.env.VITE_BACKEND
                axios.post(backend+"/api/v1/ufw/status", {user_id: store.user.id}).then(response => {
                    this.ufw_status = response.data
                })
            }).catch(e => {
                this.isError = true
                this.errorMessage = e
            })
        }
    }
}
</script>