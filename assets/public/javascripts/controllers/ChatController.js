class ChatController {

  constructor(Socket, MediaStream, ChatRoom, $sce, $rootScope, AuthApi, SpeechListener) {
    'ngInject';
    this.Socket = Socket;
    this.MediaStream = MediaStream;
    this.ChatRoom = ChatRoom;
    this.$sce = $sce;
    this.$rootScope = $rootScope;
    this.SpeechListener = SpeechListener;

    this.currentUsername = AuthApi.getCurrentUser().username;
    this.peers = [];
    window.peers = this.peers;

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
    this.onDisconnect();
  }

  onStream() {
    this.ChatRoom.on('stream.added', (function (peer) {
      peer.streamUrl = URL.createObjectURL(peer.stream);
      peer.speechListener = this.SpeechListener.createPeerListener(peer);
      this.peers.push(peer);

      console.log('peer connected');
      console.log(this.peers);
      this.$rootScope.$apply();
    }).bind(this));
  }

  onDisconnect() {
    this.ChatRoom.on('peer.left', (function (peerId) {
      this.peers = this.peers.filter(function (p) {
        return p.id !== peerId;
      });
      console.log('peer disconnected');
    }).bind(this));
  }

  sendMessage() {
    console.log('Sending message...');
  }
}

export default ChatController;
