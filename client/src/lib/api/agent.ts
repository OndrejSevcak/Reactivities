import axios from "axios";
import { store } from "../stores/store";

const sleep = (delay: number) => {
    return new Promise(resolve => {
        setTimeout(resolve, delay);
    })
}

//configuring the axios http client
const agent = axios.create({
    baseURL: import.meta.env.VITE_API_URL, //url is stored in vite .env.development file
});

//interceptors are functions that are called before a request is sent or after a response is received

//outgoing request interceptor
agent.interceptors.request.use(config => {
    store.uiStore.isBusy();
    return config;
})

//incoming response interceptor
agent.interceptors.response.use(async response => {
    try{
        await sleep(1000);
        return response;
    } 
    catch (error) {
        console.log(error);
        return await Promise.reject(error);
    } 
    finally {
        store.uiStore.isIdle();
    }
})




export default agent;