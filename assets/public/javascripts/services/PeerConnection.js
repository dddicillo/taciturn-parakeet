/**
 * Factory which returns PeerConnections, which extend the RTCPeerConnection
 * class to include custom signaling
 */
class PeerConnection {

  constructor(Socket, $injector) {
    'ngInject';
    this.Socket = Socket;
    this.$injector = $injector;
    this.RTCPeerConnections = {};
  }

  getOrCreateInstance(username, peerId) {
    if (this.RTCPeerConnections[peerId]) {
      return this.RTCPeerConnections[peerId];
    }
    return this.newInstance(username, peerId);
  }

  newInstance(username, peerId) {
    let pc;
    try {
      pc = new RTCPeerConnection();
    } catch (ex) {
      console.log('Failed to create PeerConnection, exception: ' + ex.message);
      return
    }
    this.RTCPeerConnections[peerId] = pc;
    console.log('stream: ' + this.stream);
    pc.username = username;
    pc.peerId = peerId;
    pc.Socket = this.Socket;
    pc.$injector = this.$injector;
    pc.addStream(this.stream);
    pc.onicecandidate = this.onIceCandidate;
    pc.onaddstream = this.onAddStream;
    return pc;
  }

  // Send ICE candidates to peers
  onIceCandidate(event) {
    console.log('sending ice candidate');
    if (event.candidate) {
      console.log(this);
      this.Socket.emit('signal', {
        senderId: this.$injector.get('ChatRoom').currentId,
        receiverId: this.peerId,
        candidate: event.candidate,
        type: 'ice-candidate'
      });
    }
  }

  // Signal the controller when a new stream is added
  onAddStream(event) {
    console.log('stream added');
    console.log(event);
    this.$injector.get('ChatRoom').emit('stream.added', {
      id: this.peerId,
      username: this.username,
      stream: event.stream
    });
  }

  // Send description offer to peer
  sendOffer(username, senderId, receiverId) {
    console.log('sending offer');
    const pc = this.getOrCreateInstance(username, receiverId);
    pc.createOffer()
      .then((function(sdp) {
        pc.setLocalDescription(sdp);
        this.Socket.emit('signal', {
          senderId: senderId,
          receiverId: receiverId,
          sdp,
          type: 'sdp-offer'
        });
      }).bind(this));
  }

  handleReceiveOffer(username, data) {
    console.log('offer received');
    const pc = this.getOrCreateInstance(username, data.senderId);
    pc.setRemoteDescription(new RTCSessionDescription(data.sdp))
      .then((function() {
        pc.createAnswer()
          .then((function(sdp) {
            console.log('sending answer');
            pc.setLocalDescription(sdp);
            this.Socket.emit('signal', {
              senderId: data.receiverId,
              receiverId: data.senderId,
              sdp,
              type: 'sdp-answer'
            });
          }).bind(this));
      }).bind(this))
      .catch(function(error) {
        console.error(error.name + ': ' + error.message);
      });
  }

  handleReceiveAnswer(username, data) {
    console.log('answer received');
    var pc = this.getOrCreateInstance(username, data.senderId);
    pc.setRemoteDescription(new RTCSessionDescription(data.sdp))
      .catch(function(error) {
        console.error(error.name + ': ' + error.message);
      });
  }

  handleReceiveIce(username, data) {
    console.log('ice candidate received');
    var pc = this.getOrCreateInstance(username, data.senderId);
    pc.addIceCandidate(new RTCIceCandidate(data.candidate));
  }

  setStream(stream) {
    this.stream = stream;
  }
}

export default PeerConnection;
