class MediaStream {

  constructor($q) {
    'ngInject';
    this.$q = $q;
  }

  getUserMedia() {
    if (!this.streamPromise) {
      this.streamPromise = navigator.mediaDevices.getUserMedia({
        audio: true,
        video: true
      });
    }

    return this.streamPromise;
  }
}

export default MediaStream;
