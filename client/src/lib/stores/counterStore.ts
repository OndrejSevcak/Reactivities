import { action, makeObservable, observable } from 'mobx';

export default class CounterStore {
    //class properties
    title = 'Counter Store';
    count = 42;

    constructor() {
        makeObservable(this, {
            title: observable,  //declaring that title is observable
            count: observable,
            increment: action,  //declaring that increment is an action
            decrement: action
        });
    }

    //actions to change the state
    //arrow functions are automatically bound to the class instance
    increment = (amount = 1) => {
        this.count += amount;
    }

    decrement = (amount = 1) => {
        this.count -= amount;
    }
}