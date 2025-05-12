import axios from "axios";

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
//this is an interceptor to introduce a fake delay in the response
agent.interceptors.response.use(async response => {
    try{
        await sleep(1000);
        return response;
    } catch (error) {
        console.log(error);
        return await Promise.reject(error);
    }
})

export default agent;