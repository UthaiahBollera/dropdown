const eventBus = {};
class PubSub {
  subscribe(eventname = "", callback = () => { }) {
    if (!eventBus[eventname]) {
      eventBus[eventname] = [];
    }
    eventBus[eventname].push(callback);
  };
  publish(eventname = "", data = {}) {
    const callbacks = eventBus[eventname] || [];
    if (callbacks.length > 0) {
      callbacks.forEach((callback) => {
        callback(data);
      });
    }
    return Promise.resolve(data);
  };
};

export default PubSub;