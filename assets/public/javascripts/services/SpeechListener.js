import hark from '../../../../node_modules/hark/hark.js'

class SpeechListener {

  constructor($rootScope) {
    'ngInject';
    this.$rootScope = $rootScope;
  }

  createListener(peer) {
    const listener = hark(peer.stream);

    listener.on('speaking', (function() {
      peer.speaking = true;
      console.log('speaking');
      console.log(peer);
      this.$rootScope.$apply();
    }).bind(this));

    listener.on('stopped_speaking', (function() {
      peer.speaking = false;
      this.$rootScope.$apply();
    }).bind(this));

    return listener
  }
}

export default SpeechListener;
