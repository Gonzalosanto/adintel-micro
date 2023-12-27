export default class Queue {
    
    static queue = [];
    static workingOnPromise = false;

    static enqueue(promise){
        if(this.workingOnPromise){ this.queue.push(promise) }
        else {
            if(this.queue.length >= 100) {this.queue.push(promise);}
            else {
                this.dequeue(promise);
            }
        }
        
    }

    static async dequeue(promise){
        if(this.workingOnPromise){
            return false;
        }
        const item = promise || this.queue.shift();
        if(!item) return false;
        try {
            this.workingOnPromise = true;
            await item;
        } catch (error) {
            console.error(error)
        } finally {
            this.workingOnPromise = false;
            this.dequeue();
        }
        return true;
    }
}