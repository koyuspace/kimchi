<template>
    <div>
        <div class="widget">
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
                <button @click.prevent="deployService" class="btn btn-primary form-control" disabled><i class="fa fa-cogs" aria-hidden="true"></i> Deploy Service</button>
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
    width: 50%;
}
button .fa-cogs {
    color: #fff;
    margin-right: 4px;
}
</style>