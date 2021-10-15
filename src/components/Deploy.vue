<template>
    <div id="deploy">
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
            <button class="btn btn-warning" @click.prevent="page='services'" style="float:right;"><i class="fa fa-chevron-left" style="margin-right:4px;" aria-hidden="true"></i> Back</button>
            <br><br><h1>Deploy or edit service</h1>
            <form>
                <input type="text" v-model="currentTemplate.name" class="form-control" placeholder="Service name"><br>
                <input type="text" v-model="currentTemplate.command" class="form-control" placeholder="Service command"><br>
                <input type="text" v-model="currentTemplate.file" class="form-control" placeholder="File name"><br>
                <textarea v-model="currentTemplate.deploy" style="font-family:monospace;" class="form-control" placeholder="Deployment instructions" rows="8"></textarea><br>
                <label class="visually-hidden" for="autoSizingSelect">Preference</label>
                <select v-model="template" class="form-select" @change.prevent="generateFromTemplate()">
                    <option value="0">Deploy from Template...</option>
                    <option value="1">Minecraft (PaperMC)</option>
                    <option value="2">Node</option>
                    <option value="3">Python</option>
                </select><br>
                <button @click.prevent="deployService" :disabled="isDeploying" class="btn btn-primary form-control"><i class="fa fa-cogs" aria-hidden="true"></i> Deploy Service</button>
            </form>
        </div>
    </div>
</template>

<script>
import { store } from "../store"
import axios from 'axios'

export default {
    data: function() {
        return {
            template: 0,
            currentTemplate: {
                name: '',
                command: '',
                file: '',
                deploy: ''
            },
            isError: false,
            isSuccess: false,
            isDeploying: false,
            errorMessage: '',
            successMessage: '',
            templates: [
                {
                    name: '',
                    command: '',
                    file: '',
                    deploy: ''
                },
                {
                    name: '',
                    command: 'java -jar',
                    file: 'server.jar',
                    deploy: '#!/bin/bash\nmkdir %%name%%\ncd %%name%%\nwget %%latestPaper%% -O server.jar\necho "eula=true" > eula.txt'
                },
                {
                    name: '',
                    command: 'node',
                    file: 'index.js',
                    deploy: '#!/bin/bash\nmkdir %%name%%'
                },
                {
                    name: '',
                    command: 'python',
                    file: 'main.py',
                    deploy: '#!/bin/bash\nmkdir %%name%%'
                }
            ]
        }
    },
    methods: {
        generateFromTemplate: function() {
            this.currentTemplate = this.templates[this.template];
            axios.get("https://papermc.io/api/v2/projects/paper").then(r1 => {
                axios.get("https://papermc.io/api/v2/projects/paper/versions/"+r1.data.versions[r1.data.versions.length - 1]).then(r2 => {
                    axios.get("https://papermc.io/api/v2/projects/paper/versions/"+r2.data.version+"/builds/"+r2.data.builds[r2.data.builds.length - 1]).then(r3 => {
                        this.currentTemplate.deploy = this.currentTemplate.deploy.replaceAll("%%latestPaper%%", 'https://papermc.io/api/v2/projects/paper/versions/'+r3.data.version+"/builds/"+r3.data.build+"/downloads/"+r3.data.downloads.application.name)
                    })
                })
            })
        },
        deployService: function() {
            //TODO: Service deployment
            this.isError = false
            const backend = import.meta.env.VITE_BACKEND
            if (this.currentTemplate.name !== '') {
                this.currentTemplate.name = this.currentTemplate.name.replaceAll(" ", "-").toLowerCase()
                this.currentTemplate.deploy = this.currentTemplate.deploy.replaceAll("%%name%%", this.currentTemplate.name)
                this.isDeploying = true
                axios.post(backend+"/api/v1/deploy", {user_id: store.user.id, payload: this.currentTemplate}).then(() => {
                    store.page = 'services'
                    this.isDeploying = false
                })
            } else {
                this.isError = true
                this.errorMessage = "Name cannot be empty"
            }
        }
    },
    computed: {
        page: {
            get() {
                return store.page;
            },
            set(s) {
                store.page = s;
            }
        }
    }
}
</script>

<style>
@import url(https://cdn.jsdelivr.net/npm/fork-awesome@1.2.0/css/fork-awesome.min.css);
</style>

<style scoped>
#deploy {
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
    width: 50%;
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
</style>