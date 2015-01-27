/**
 * `socketEvents` subscribes the client `BaseModel` and `BaseCollection` to socket events if any are defined.
 */

var _ = require('underscore'),
    Backbone = require('backbone');
var socketEvents = module.exports;


socketEvents.delegateSocketEvents = function(){
    if (this.socket_events && _.size(this.socket_events) > 0 && !this.socket_init) {
        this.socket_init =true;
        var events = this.socket_events;

        for (var key in events) {
            var method = events[key];
            if (!_.isFunction(method)) {
                method = this[events[key]];
            }

            if (!method) {
                throw new Error('Method "' + events[key] + '" does not exist');
            }

            method = _.bind(method, this);
            Backbone.socket.on(key, method);
        };
    }
}
