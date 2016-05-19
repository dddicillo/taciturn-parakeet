import io from 'socket.io-client';

class Socket {

  constructor($rootScope) {
    'ngInject';
    this.$rootScope = $rootScope;

    this.connect('https://voicechat.dev');
    console.log("Connected to WebSocket Server");
  }

  connect(url) {
    this.socket = io.connect(url);
  }

  on(eventName, callback) {
    this.socket.on(eventName, (function() {
      var args = arguments;
      this.$rootScope.$apply((function() {
        callback.apply(this.socket, args);
      }).bind(this));
    }).bind(this));
  }

  emit(eventName, data, callback) {
    this.socket.emit(eventName, data, function() {
      var args = arguments;
      this.$rootScope.$apply(function() {
        if (callback) {
          callback.apply(this.socket, args);
        }
      });
    });
  }
}

export default Socket;
