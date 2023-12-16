<template>
    <div id="console">
        <div class="widget">
            <h1>Console</h1>
            <div id="consoletext" v-html="consoleText"></div><br>
            <div style="text-align:center">
                <p><i class="fa fa-chevron-right ticon" aria-hidden="true"></i> <input type="text" id="input" v-model="consoleInput" @keyup.enter="handleInput" style="width:95%;display:inline;" class="form-control" autocomplete="off"></p>
            </div>
        </div>
    </div>
</template>

<script>
import { store } from "../store"
import axios from 'axios'
import { findParameter } from '../globalfunc'

export default {
    data: function() {
        return {
            consoleInput: '',
            count: 5
        }
    },
    mounted() {
        document.getElementById("input").focus()
        window.setInterval(function() {
            try {
                const el = document.getElementById("consoletext")
                el.scrollBy(0, 999)
            } catch (e) {}
            const backend = import.meta.env.VITE_BACKEND
            axios.post(backend+"/api/v1/log", {user_id: store.user.id, name: findParameter("name")}).then(response => {
                store.consoleText = response.data.toString().replaceAll("[m", "").replaceAll("[33;1m", "").replaceAll("[31;1m", "").replaceAll("[K", "").replaceAll("[K", "").replaceAll("[?1h=[?2004h> ", "").replaceAll(">", "").replaceAll("[31ml[0m[31mi[0m[31ms[0m", "").replaceAll("[?1l[?1000l[?2004l", "").replaceAll("[31ms[0m[31mt[0m[31mo[0m", "").replaceAll(">", "&gt;").replaceAll("<", "&lt;").replaceAll("\n", "<br>")
            })
        }, 10)
    },
    computed: {
        consoleText: {
            get() {
                return store.consoleText
            }
        }
    },
    methods: {
        handleInput: function() {
            const backend = import.meta.env.VITE_BACKEND
            const consoleInput = this.consoleInput
            this.consoleInput = ''
            axios.post(backend+"/api/v1/enter", {user_id: store.user.id, name: findParameter("name"), command: consoleInput})
        }
    }
}
</script>

<style scoped>
#console {
    margin: 20px;
    margin-bottom: 80px;
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
    width: 60%;
}
button .fa-cogs {
    color: #fff;
    margin-right: 4px;
}
div[data-error="false"] {
  display: none !important;
}
div[data-success="false"] {
  display: none !important;
}
.ticon {
    font-size: 16px;
    margin-right: 10px;
}
#consoletext {
    height: 450px;
    overflow: hidden;
    font-family: monospace;
    font-size: 10pt;
}
</style>