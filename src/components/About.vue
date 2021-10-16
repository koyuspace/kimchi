<template>
    <div id="about">
        <div class="widget">
            <h1>About Kimchi</h1>
            <p><strong>Kimchi</strong> (김치) is a friendly server management tool written by koyu.space. We made that software in hope it will be useful to you. As always the source code is available so if you want to extend it go ahead.</p>
            <p><strong>Version:</strong> {{ appVersion }}</p><br>
            <p><a href="https://github.com/koyuspace/kimchi" class="btn btn-primary" target="_blank"><i class="fa fa-github" aria-hidden="true"></i> GitHub</a> <a href="https://creapaid.com/koyuspace" class="btn btn-danger" target="_blank"><i class="fa fa-heart" aria-hidden="true"></i> Donate</a></p>
            <p></p>
        </div>
    </div>
</template>

<script>
import {version} from '../../package'
export default {
    data: function() {
        return {
            appVersion: version
        }
    }
}
</script>

<style scoped>
#about {
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
    width: 30%;
    text-align: center;
}
.btn .fa {
    color: #fff;
    margin-right: 4px;
}
</style>