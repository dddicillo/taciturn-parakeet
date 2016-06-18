import EventEmitter from 'wolfy87-eventemitter';

let self;

class ChatRoom extends EventEmitter {

  constructor(Socket, PeerConnection, AuthApi) {
    'ngInject';
    super();

    self = this;

    this.Socket = Socket;
    this.PeerConnection = PeerConnection;
    this.AuthApi = AuthApi;

    this.listenForRTCEvents();
  }

  // Listen for events from the signalling server
  listenForRTCEvents() {

    // User ID created
    this.Socket.on('id.created', (function(userId) {
      this.currentId = userId;
    }).bind(this));

    // Peer joined the room
    this.Socket.on('peer.joined', (function(username, peerId) {
      this.PeerConnection.sendOffer(username, this.currentId, peerId);
      this.emit('peer.joined', username);
    }).bind(this));

    // Peer left the room
    this.Socket.on('peer.left', (function(peerId) {
      this.emit('peer.left', peerId);
    }).bind(this));

    // Handle sdp offer/answer and ice candidates
    this.Socket.on('signal', this.onSignal.bind(this));
  }

  onSignal(username, data) {
    switch (data.type) {
      case 'sdp-offer':
        self.PeerConnection.handleReceiveOffer(username, data);
        break;
      case 'sdp-answer':
        self.PeerConnection.handleReceiveAnswer(username, data);
        break;
      case 'ice-candidate':
        self.PeerConnection.handleReceiveIce(username, data);
        break;
    }
  }

  initialize(stream) {
    this.PeerConnection.setStream(stream);
  }

  joinRoom() {
    this.Socket.emit('init', this.AuthApi.getCurrentUser());
  }
}

export default ChatRoom;
