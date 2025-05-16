import { makeAutoObservable } from 'mobx';

export default class CounterStore {
    //class properties
    title = 'Counter Store';
    count = 42;
    events: string[] = [
        `Initial count is ${this.count}`,
    ]

    constructor() {
        makeAutoObservable(this);  //this will automatically make all properties observable and all functions actions and we do not need to set it manually in makeObservable

        // makeObservable(this, {
        //     title: observable,  
        //     count: observable,
        //     increment: action,  
        //     decrement: action
        // });
    }

    //actions to change the state
    //arrow functions are automatically bound to the class instance
    increment = (amount = 1) => {
        this.count += amount;
        this.events.push(`Incremented by ${amount} - new count is ${this.count}`);
    }

    decrement = (amount = 1) => {
        this.count -= amount;
        this.events.push(`Decremented by ${amount} - new count is ${this.count}`);
    }

    //a computed property example
    get eventCount(){
        return this.events.length;
    }
}