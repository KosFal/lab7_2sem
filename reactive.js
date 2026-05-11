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

class Sensor {
  constructor(name, messenger) {
    this.name = name;
    this.messenger = messenger;
  }

  sendUpdate(value) {
    console.log(`\n [${this.name}] Нові дані: ${value}`);
    this.messenger.emit('dataFlow', {
      value: value,
      sensor: this.name,
      time: new Date().toLocaleTimeString()
    });
  }
}

class Display {
  constructor(label, messenger) {
    this.label = label;
    this.unsub = messenger.subscribe('dataFlow', (data) => {
      console.log(`  [Екран ${this.label}] Відображаю: ${data.value} від ${data.sensor}`);
    });
  }

  close() {
    this.unsub(); 
    console.log(` [Екран ${this.label}] Вимкнено.`);
  }
}

const bus = new EventEmitter()
const weatherSensor = new Sensor("Метеостанція", bus);

const officeDisplay = new Display("Офіс", bus);
const hallDisplay = new Display("Хол", bus);

const logger = (data) => console.log(` [Log] Збережено в базу: ${data.value}`);
bus.subscribe('dataFlow', logger);

weatherSensor.sendUpdate("+20°C");

console.log("\n Оновлення системи: Хол вимикається, логування зупинено ");
hallDisplay.close();
bus.unsubscribe('dataFlow', logger);

weatherSensor.sendUpdate("+22°C");
