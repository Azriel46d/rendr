var _ = require('underscore'),
    Backbone = require('backbone'),
    isServer = (typeof window === 'undefined');



function defaultSocketEvents() {
    function _resolveEvent(event_name,e){

        var obj = Backbone.getIoListener(e.key,event_name);
        if (obj){

            var options = obj.options;
            var defer = obj.defer;
            if (e.error && e.error || e.statusCode !== 200){
                //TODO add status code
                options && options.error && options.error({body : e,status: e.statusCode});
                defer && defer.reject();
            } else {
                options && options.success && options.success(e.data);
                defer && defer.resolve();
            }
            Backbone.removeIoListener(e.key,event_name);
        }

    }
    if (Backbone && Backbone.socket){
        Backbone.socket.on('get',function(res){

            _resolveEvent('get',res);
        });
        Backbone.socket.on('post',function(res){
            _resolveEvent('post',res);
        });
        Backbone.socket.on('put',function(res){
            _resolveEvent('put',res);
        });
        Backbone.socket.on('delete',function(res){
            _resolveEvent('delete',res);
        });
    }

}

module.exports = defaultSocketEvents;