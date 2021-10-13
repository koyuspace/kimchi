<template>
    <div>
        <div class="widget"><h1 class="header">Dashboard</h1></div>
        <div class="welcome">
            <h1 style="font-weight:bold;">안녕하십니까 {{ user.name }}</h1>
        </div>
        <div class="metrics">
            <h2 style="font-weight:bold;">System Metrics</h2>
            <div class="progressbars">
                <div class="progress progress-bar bg-danger" role="progressbar" :style="'width: '+user.cpu+'%;'" :aria-valuenow="user.cpu" aria-valuemin="0" aria-valuemax="100"></div><span style="float:right;"><b>CPU:</b> {{ user.cpu }}%</span>
                <div class="progress progress-bar bg-warning" role="progressbar" :style="'width: '+user.ram+'%;'" :aria-valuenow="user.ram" aria-valuemin="0" aria-valuemax="100"></div><span style="float:right;"><b>RAM:</b> {{ user.ram }}%</span>
                <div class="progress progress-bar bg-success" role="progressbar" :style="'width: '+user.disk+'%;'" :aria-valuenow="user.disk" aria-valuemin="0" aria-valuemax="100"></div><span style="float:right;"><b>Disk:</b> {{ user.disk }}%</span>
                <p><b>Load average:</b> {{ user.la }}</p>
            </div>
        </div>
        <div class="motd">
            <h2 style="font-weight:bold;">Message of the Day</h2>
            <code>
                {{ user.motd }}
            </code>
        </div>
        <div class="clock">
            <h2 class="logo" id="clock"></h2>
        </div>
    </div>
</template>

<style>
body {
    background: url(https://images.unsplash.com/photo-1634017759716-1784f7c57795?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=1935&q=80) no-repeat center center;
    background-size: cover;
}
</style>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Black+Han+Sans&display=swap');
.logo {
  font-family: 'Black Han Sans', sans-serif;
  font-size: 36pt;
  user-select: none;
  margin-right: 20px;
  vertical-align: top;
  font-weight: 400 !important;
}
div {
    margin: 20px;
}
.metrics {
    position: absolute;
    right: 100px;
    width: 30%;
    top: 220px;
    background: #eee;
    padding: 20px;
    border-radius: 4px;
    border: 1px solid #ccc;
    height: 250px;
    width: 350px;
}
.metrics h2 {
    text-align: center;
}
.metrics p {
    margin-left: 20px;
}
.metrics span {
    margin-top: -43px;
}
.motd {
    position: absolute;
    right: 100px;
    width: 30%;
    top: 490px;
    background: #eee;
    padding: 20px;
    border-radius: 4px;
    border: 1px solid #ccc;
    text-align: center;
    width: 350px;
}
.welcome {
    position: absolute;
    left: 100px;
    width: 30%;
    top: 220px;
    background: #eee;
    padding: 20px;
    padding-top: 30px;
    border-radius: 4px;
    border: 1px solid #ccc;
    text-align: center;
    width: 350px;
}
.clock {
    position: absolute;
    left: 470px;
    width: 30%;
    top: 220px;
    background: #eee;
    padding: 20px;
    padding-top: 30px;
    border-radius: 4px;
    border: 1px solid #ccc;
    text-align: center;
    width: 350px;
}
.widget {
    display: block;
    margin: 0 auto;
    background: #eee;
    padding: 20px;
    border-radius: 4px;
    border: 1px solid #ccc;
    width: 400px;
    text-align: center;
}
.header {
    text-align: center;
    font-weight: 800;
    font-size: 48pt;
}
.progressbars {
    width: 80%;
}
.progress {
    padding: 12px !important;
}
</style>

<script>
import { supabase } from "../supabase"
import { store } from "../store"
import { onMounted } from "vue"
import axios from 'axios'

export default {
    setup() {
        async function getProfile() {
            store.user = supabase.auth.user()

            let { data, error, status } = await supabase
            .from("profiles")
            .select(`username, website, avatar_url`)
            .eq("id", store.user.id)
            .single()

            if (error && status !== 406) throw error

            if (data) {
                store.user.greeting = "Hello, "+data.username+" 👋"
                store.user.name = data.username
            } else {
                store.user.greeting = store.user.email
            }
            const backend = import.meta.env.VITE_BACKEND
            window.setInterval(function() {
                axios.post(backend+"/api/v1/get/ram", {user_id: store.user.id}).then(response => {
                    store.user.ram = parseInt(response.data)
                })
            }, 1000)
            window.setInterval(function() {
                axios.post(backend+"/api/v1/get/cpu", {user_id: store.user.id}).then(response => {
                    store.user.cpu = parseInt(response.data)
                })
            }, 1000)
            window.setInterval(function() {
                axios.post(backend+"/api/v1/get/disk", {user_id: store.user.id}).then(response => {
                    store.user.disk = parseInt(response.data)
                })
            }, 1000)
            window.setInterval(function() {
                axios.post(backend+"/api/v1/get/la", {user_id: store.user.id}).then(response => {
                    store.user.la = response.data
                })
            }, 1000)
            axios.post(backend+"/api/v1/get/motd", {user_id: store.user.id}).then(response => {
                store.user.motd = response.data
            })
            function startTime() {
                const today = new Date();
                let h = today.getHours();
                let m = today.getMinutes();
                let s = today.getSeconds();
                m = checkTime(m);
                s = checkTime(s);
                document.getElementById('clock').innerHTML =  h + ":" + m + ":" + s;
                setTimeout(startTime, 1000);
            }

            function checkTime(i) {
                if (i < 10) {i = "0" + i};
                return i;
            }

            startTime()
        }
      
        onMounted(() => {
        getProfile()
        })
    },
    computed: {
        page: {
            get() {
                return store.page;
            },
            set(s) {
                store.page = s;
            }
        },
        user: {
            get() {
                if (store.user) {
                    return store.user;
                } else {
                    return {};
                }
            }
        },
    },
    methods: {
        signOut: function() {
            try {
                let { error } = supabase.auth.signOut()
                if (error) throw error
            } catch (error) {
                alert(error.message)
            } finally {
                location.reload();
            }
        }
    }
}
</script>
