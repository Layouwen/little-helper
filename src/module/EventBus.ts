class EventBus {
  private events = new Map<string, Function[]>();

  on (eventName: string, cb: Function) {
    let eventFnArr = this.events.get(eventName);
    if (!eventFnArr) {
      eventFnArr = [];
      this.events.set(eventName, eventFnArr);
    }
    const index = eventFnArr.length;
    eventFnArr.push(cb);
    return () => {
      eventFnArr!.splice(index, 1);
    };
  }

  emit (eventName: string, ...params: any[]) {
    const eventFnArr = this.events.get(eventName);
    if (!eventFnArr) {
      console.error(`not event name ${eventName}`);
      return;
    }
    eventFnArr.forEach(cb => cb(...params));
  }

  remove (eventName: string) {
    this.events.delete(eventName);
  }
}

export default EventBus;
