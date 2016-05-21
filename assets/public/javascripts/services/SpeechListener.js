import hark from '../../../../node_modules/hark/hark.js'

class SpeechListener {

  constructor($rootScope) {
    'ngInject';
    this.$rootScope = $rootScope;
  }

  createPeerListener(peer) {
    const listener = hark(peer.stream);

    listener.on('speaking', (function() {
      peer.speaking = true;
      this.$rootScope.$apply();
    }).bind(this));

    listener.on('stopped_speaking', (function() {
      peer.speaking = false;
      this.$rootScope.$apply();
    }).bind(this));

    return listener
  }

  createLocalListener(controller) {
    console.log('controller context');
    console.log(controller);
    const listener = hark(controller.stream);

    listener.on('speaking', (function() {
      controller.speaking = true;
      this.$rootScope.$apply();
    }).bind(this));

    listener.on('stopped_speaking', (function() {
      controller.speaking = false;
      this.$rootScope.$apply();
    }).bind(this));

    return listener
  }
}

export default SpeechListener;
