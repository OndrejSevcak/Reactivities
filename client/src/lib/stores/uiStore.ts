//this store is going to track any UI elements we need to keep track of globally

import { makeAutoObservable } from "mobx";

export class UIStore{
    isLoading = false;

    constructor(){
        makeAutoObservable(this);
    }

    isBusy(){
        this.isLoading = true;
    }

    isIdle(){
        this.isLoading = false;
    }
}