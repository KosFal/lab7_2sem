class EventEmitter {
  constructor() {
    this.events = {};
  }

  subscribe(eventName, callback) {
    if (!this.events[eventName]) {
      this.events[eventName] = [];
    }
    this.events[eventName].push(callback);

    return () => this.unsubscribe(eventName, callback);
  }

  emit(eventName, data) {
    const eventListeners = this.events[eventName];
    if (eventListeners) {
      eventListeners.forEach(callback => callback(data));
    }
  }

  unsubscribe(eventName, callbackToRemove) {
    if (!this.events[eventName]) return;

    this.events[eventName] = this.events[eventName].filter(
      callback => callback !== callbackToRemove
    );
  }
}
