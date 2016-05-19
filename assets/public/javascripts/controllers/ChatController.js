class ChatController {

  constructor(Socket, MediaStream, ChatRoom, $sce, $rootScope) {
    'ngInject';
    this.Socket = Socket;
    this.MediaStream = MediaStream;
    this.ChatRoom = ChatRoom;
    this.$sce = $sce;
    this.$rootScope = $rootScope;
    this.peers = [];

    this.MediaStream.getUserMedia()
      .then((function(stream) {
        this.ChatRoom.initialize(stream);
        this.streamUrl = URL.createObjectURL(stream);
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
      this.peers.push({
        id: peer.id,
        streamUrl: URL.createObjectURL(peer.stream)
      });
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
}

export default ChatController;
