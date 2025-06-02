import axios from "axios";
import { store } from "../stores/store";
import { toast } from "react-toastify";
import { router } from "../../app/router/Routes";

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
agent.interceptors.response.use(
    //the use() method takes two functions as arguments: 
    //      onFulfilled?: ((value: AxiosResponse<any, any>) => AxiosResponse<any, any> | Promise<AxiosResponse<any, any>>) | null | undefined, 
    //      onRejected?: ((error: any) => any) | null) => number
    async response => {
        await sleep(1000);
        store.uiStore.isIdle(); //changes isLoading flag to false
        return response;
    },
    async error => {
        await sleep(1000);
        store.uiStore.isIdle();
        
        const { status, data } = error.response;    //axios response object has a response property that contains the status code and data returned from the server
        switch (status) {
            case 400:
                //bad request
                if(data.errors){
                    const modalStateErrors = [];
                    for(const key in data.errors){
                        if(data.errors[key]){
                            modalStateErrors.push(data.errors[key]);
                        }
                    }
                    throw modalStateErrors.flat();
                } else{
                    toast.error(data);
                }
                break;
            case 401:
                //unauthorized
                toast.error("Unauthorized");
                break;
            case 404:
                //not found
                router.navigate('/not-found');
                break;
            case 500:
                //server error
                router.navigate('/server-error', { state: { error: data}} )
                break;
            default:
                toast.error("Unknown error");
        
        }
        return Promise.reject(error);
    }
)




export default agent;