let _videoStreamChunks = [];
class CanvasRecorder{
    constructor(canvas, fps, type){
        this.canvas = canvas;
        this.fps = fps;
        this.videoStream = canvas.captureStream(fps);
        this.mediaRecorder = new MediaRecorder(this.videoStream);
        this.lastURL = "";

        this.mediaRecorder.ondataavailable = function(e) {
            _videoStreamChunks.push(e.data);
        }
        
        this.mediaRecorder.onstop = (e) => {
            let blob = new Blob(_videoStreamChunks, {"type": type == null ? "video/mp4" : type});
            this.lastURL = URL.createObjectURL(blob);
            _videoStreamChunks = [];
        }
    }

    start() { this.mediaRecorder.start(); }
    stop() { this.mediaRecorder.stop(); }
    getURL() { return this.lastURL; }
	active() { return this.mediaRecorder.state == "recording"; }
}