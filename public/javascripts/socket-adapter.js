(function () {

App.Store = DS.Store.extend();

DS.WebsocketAdapter = DS.RESTAdapter.extend({
    callbacks: {},
    socket: null,
    beforeOpenQueue: [],

    ajax: function(url, type, params) {
        var adapter = this;
        var uuid = adapter.generateUuid();

        adapter.initializeSocket();

        return new Ember.RSVP.Promise(function(resolve, reject) {
            var success = function(json) {
                Ember.run(null, resolve, json);
            };
            var error = function(json) {
            Ember.run(null, reject, json);
            }
            callback = { success: success, error: error }
            adapter.callbacks[uuid] = callback;

            var payload = { uuid: uuid, path: adapter.path(url), type: type, params: params, version: adapter.version || 1 };
            if(adapter.socket.readyState === 1) {
                adapter.socket.send(JSON.stringify(payload));
            }
            else {
                adapter.beforeOpenQueue.push(payload);
            }
        });
    },

    initializeSocket: function() {
        var adapter = this;

        if(adapter.socket === null) {
            adapter.socket = new WebSocket(adapter.host + "/websocket");
            adapter.socket.onopen = function(event) { adapter.open.apply(adapter, [event]); };
            adapter.socket.onmessage = function(event) { adapter.message.apply(adapter, [event]); };
            adapter.socket.onerror = function(event) { adapter.error.apply(adapter, [event]); };
        }
    },

    open: function(event) {
        var adapter = this;

        if(adapter.beforeOpenQueue.length > 0) {
            adapter.beforeOpenQueue.forEach(function(payload) {
            adapter.socket.send(JSON.stringify(payload));
        });
        adapter.beforeOpenQueue = [];
        }
    },

    message: function(event) {
        var adapter = this;
        var result = JSON.parse(event.data);

        adapter.callbacks[result.uuid].success(result.payload);
        delete adapter.callbacks[result.uuid];
    },

    error: function(event) {
        alert(event.data);
    },

    generateUuid: function() {
        var date = new Date().getTime();
        var uuid = "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function(character) {
            var random = (date + Math.random() * 16) % 16 | 0;
            date = Math.floor(date/16);
            return (character === "x" ? random : (random & 0x7 | 0x8)).toString(16);
        });
        return uuid;
    },

    path: function(url) {
        return url.replace(this.host, "");
    }
});

Web.ApplicationAdapter = DS.WebsocketAdapter.extend({
    host: "ws://localhost:4000",
    version: 1
});

)};