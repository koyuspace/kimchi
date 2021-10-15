import { store } from "./store"
const backend = import.meta.env.VITE_BACKEND
import axios from 'axios'

export const loadServices = function() {
    axios.post(backend+"/api/v1/getservices", {user_id: store.user.id}).then(r1 => {
        let servicesArr = []
        r1.data.split("\n").forEach(e => {
            if (e !== "") {
                let serviceName = e
                axios.post(backend+"/api/v1/servicerunning", {user_id: store.user.id, name: serviceName}).then(r2 => {
                    servicesArr.push({name: serviceName, isRunning: r2.data})
                })
            }
        });
        store.services = servicesArr
    })
}

export const findParameter = function(parameterName) {
    var myUrl = new URL(window.location.href.replace(/#/g,"?"))
    return myUrl.searchParams.get(parameterName)
}