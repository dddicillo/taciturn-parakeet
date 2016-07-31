class ChatController {

  constructor(Socket, MediaStream, ChatRoom, $sce, $rootScope, AuthApi, SpeechListener, $mdToast, LinkPreviewApi, $window) {
    'ngInject';
    this.Socket = Socket;
    this.MediaStream = MediaStream;
    this.ChatRoom = ChatRoom;
    this.$sce = $sce;
    this.$rootScope = $rootScope;
    this.SpeechListener = SpeechListener;
    this.$mdToast = $mdToast;
    this.LinkPreviewApi = LinkPreviewApi;
    this.$window = $window;

    this.currentUsername = AuthApi.getCurrentUser().username;
    this.peers = [];
    this.messages = [];
    this.showPreview = false;
    this.preview = {};

    this.MediaStream.getUserMedia()
      .then((function(stream) {
        this.ChatRoom.initialize(stream);
        this.stream = stream;
        this.streamUrl = URL.createObjectURL(stream);
        this.SpeechListener.createLocalListener(this);
        this.ChatRoom.joinRoom();
        this.$rootScope.$apply();
      }).bind(this))
      .catch(function(error) {
        console.log(error);
      });

    this.onStream();
    this.onConnect();
    this.onDisconnect();
    this.onMessage();

    this.$window.ChatController = this;
    // this.getPreview('https://www.rockpapershotgun.com/2016/07/29/whats-it-like-to-launch-an-indie-game-from-china/');
  }

  onStream() {
    this.ChatRoom.on('stream.added', (function (peer) {
      peer.streamUrl = URL.createObjectURL(peer.stream);
      peer.speechListener = this.SpeechListener.createPeerListener(peer);
      this.peers.push(peer);

      console.log('peer connected');
      this.$rootScope.$apply();
    }).bind(this));
  }

  onConnect() {
    this.ChatRoom.on('peer.joined', (function (username) {
      // Notify
      this.$mdToast.show(
        this.$mdToast.simple()
          .textContent(username + ' joined the chat')
          .position('top right')
          .parent(angular.element(document.querySelector('#text-chat-wrapper')))
          .hideDelay(3000)
      );
    }).bind(this));
  }

  onDisconnect() {
    this.ChatRoom.on('peer.left', (function (peerId) {
      const peer = this.peers.filter(function (p) {
        return p.id === peerId;
      });
      this.peers.splice(this.peers.indexOf(peer), 1);
      console.log('peer disconnected');
console.log(peer);
      // Notify
      this.$mdToast.show(
        this.$mdToast.simple()
          .textContent(peer[0].username + ' left the chat')
          .position('top right')
          .parent(angular.element(document.querySelector('#text-chat-wrapper')))
          .hideDelay(3000)
      );
    }).bind(this));
  }

  sendMessage() {
    if (this.content) {
      this.Socket.emit('message', {
        sender: this.currentUsername,
        content: this.content,
        time: new Date()
      });
    }
  }

  onMessage() {
    this.Socket.on('message', (function(message) {
      this.messages.push(message);
      this.content = undefined;
    }).bind(this));
  }

  getPreview(url) {
    this.LinkPreviewApi.getMetadata(url)
      .then((function(previewData) {
        this.showPreview = true;
        this.preview = previewData;
      }).bind(this))
      .catch((function(err) {
        console.log('Unable to retrieve link data!');
      }).bind(this));
  }
}

export default ChatController;
