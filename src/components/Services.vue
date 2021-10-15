<template>
    <div>
        <div class="widget">
            <button class="btn btn-success" @click.prevent="page='deploy'" style="float:right;"><i class="fa fa-plus" aria-hidden="true"></i> Deploy new service</button>
            <br><br><h1>Services</h1>
            <table class="table">
                <thead>
                    <tr>
                        <th scope="col">Name</th>
                        <th scope="col">Status</th>
                        <th scope="col">Actions</th>
                        <th scope="col">Type</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>kimchi-frontend</td>
                        <td>Running</td>
                        <td></td>
                        <td>Core</td>
                    </tr>
                    <tr>
                        <td>kimchi-backend</td>
                        <td>Running</td>
                        <td></td>
                        <td>Core</td>
                    </tr>
                    <tr>
                        <td>firewall</td>
                        <td v-html="firewallStatus"></td>
                        <td><button class="btn btn-danger" v-if="firewallStatus==='Running'" @click.prevent="disableFirewall"><i class="fa fa-stop" aria-hidden="true"></i></button> <button class="btn btn-success" v-if="firewallStatus==='Stopped'" @click.prevent="enableFirewall"><i class="fa fa-play" aria-hidden="true"></i></button> <button class="btn btn-secondary" @click.prevent="page='firewall'"><i class="fa fa-pencil" aria-hidden="true"></i></button></td>
                        <td>System</td>
                    </tr>
                    <tr v-for="(service,key) in services" :key="key" >
                        <td>{{service.name}}</td>
                        <td>
                            <span v-if="service.isRunning==='yes'">Running</span>
                            <span v-if="service.isRunning==='no'">Stopped</span>
                            <span v-if="service.isRunning==='deploying'">Deploying</span>
                        </td>
                        <td><button class="btn btn-danger" v-if="service.isRunning==='yes'" @click.prevent="stopService(service.name,key)"><i class="fa fa-stop" aria-hidden="true" @click.prevent="stopService(service.name,key)"></i></button> <button class="btn btn-success" v-if="service.isRunning==='no'" @click.prevent="startService(service.name,key)"><i class="fa fa-play" aria-hidden="true"></i></button> <button class="btn btn-danger" :disabled="service.isRunning==='deploying'" @click.prevent="removeService(service.name,key)"><i class="fa fa-times" aria-hidden="true"></i></button> <a class="btn btn-primary" :href="'#page=console&name='+service.name"><i class="fa fa-terminal" aria-hidden="true"></i></a></td>
                        <td>User</td>
                    </tr>
                </tbody>
            </table>
        </div>
    </div>
</template>

<script>
import { store } from "../store"
import axios from 'axios'
import { loadServices } from '../globalfunc'

Array.prototype.remove = function() {
  var what, a = arguments, L = a.length, ax
  while (L && this.length) {
      what = a[--L]
      while ((ax = this.indexOf(what)) !== -1) {
          this.splice(ax, 1)
      }
  }
  return this
}

export default {
    data: function() {
        return {
            firewallStatus: 'Running',
        }
    },
    mounted() {
        const backend = import.meta.env.VITE_BACKEND
        axios.post(backend+"/api/v1/ufw/status", {user_id: store.user.id}).then(response => {
            if (response.data.includes("inactive")) {
                this.firewallStatus = "Stopped"
            } else {
                this.firewallStatus = "Running"
            }
        })
    },
    methods: {
        enableFirewall: function() {
            const backend = import.meta.env.VITE_BACKEND
            axios.post(backend+"/api/v1/ufw/enable", {user_id: store.user.id}).then(()=> {
                this.firewallStatus = "Running"
            })
        },
        disableFirewall: function() {
            const backend = import.meta.env.VITE_BACKEND
            axios.post(backend+"/api/v1/ufw/disable", {user_id: store.user.id}).then(() => {
                this.firewallStatus = "Stopped"
            })
        },
        removeService: function(service, key) {
            if (confirm("Do you really want to remove that service?\nWarning: All data will be irrecoverably deleted")) {
                const backend = import.meta.env.VITE_BACKEND
                axios.post(backend+"/api/v1/stop", {user_id: store.user.id, name: service})
                axios.post(backend+"/api/v1/delservice", {user_id: store.user.id, name: service}).then(
                    store.services.splice(key, 1)
                )
            }
        },
        startService: function(service, key) {
            const backend = import.meta.env.VITE_BACKEND
            axios.post(backend+"/api/v1/start", {user_id: store.user.id, name: service}).then(()=> {
                store.services[key].isRunning = true
                loadServices()
            })
        },
        stopService: function(service, key) {
            const backend = import.meta.env.VITE_BACKEND
            axios.post(backend+"/api/v1/stop", {user_id: store.user.id, name: service}).then(() =>{
                store.services[key].isRunning = false
                loadServices()
            })
        }
    },
    computed: {
        page: {
            get() {
                return store.page
            },
            set(s) {
                store.page = s
            }
        },
        services: {
            get() {
                return store.services
            }
        }
    }
}
</script>

<style>
@import url(https://cdn.jsdelivr.net/npm/fork-awesome@1.2.0/css/fork-awesome.min.css);
</style>

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
    width: 80%;
}
button i,
a .fa {
    color: #fff;
}
</style>