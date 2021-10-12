<template>
<nav class="navbar navbar-expand-lg navbar-dark bg-dark" v-if="user.email">
    <div class="container-fluid">
        <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
            <span class="navbar-toggler-icon"></span>
        </button>
        <div class="collapse navbar-collapse" id="navbarContent">
            <ul class="navbar-nav me-auto mb-2 mb-lg-0">
                <li class="nav-item">
                    <a :class="{ 'nav-link': true, active: page === 'home'}" @click.prevent="page='home'" href="#">Home</a>
                </li>
            </ul>
            <ul class="navbar-nav">
                <li class="nav-item dropdown">
                    <a class="nav-link dropdown-toggle" href="#" id="navbarDropdown" role="button" data-bs-toggle="dropdown" aria-expanded="false"> {{ user.greeting }} </a>
                    <ul class="dropdown-menu dropdown-menu-end" aria-labelledby="navbarDropdown">
                        <li><a class="dropdown-item" @click.prevent="page='profile'" href="#">Edit Profile</a></li>
                        <li><a class="dropdown-item" href="#" @click.prevent="signOut">Logout</a></li>
                    </ul>
                </li>
            </ul>
        </div>
    </div>
</nav>
</template>

<script>
import { supabase } from "../supabase"
import { store } from "../store"
import { onMounted } from "vue"

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
            } else {
                store.user.greeting = user.email
            }
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
        }
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
