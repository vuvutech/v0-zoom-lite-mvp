// Recording utility functions for meeting recordings

export interface RecordingSession {
  id: string;
  meetingId: string;
  startTime: Date;
  endTime?: Date;
  chunks: Blob[];
  isActive: boolean;
}

export class MediaRecorder {
  private recorder: any;
  private chunks: Blob[] = [];
  private stream: MediaStream;

  constructor(stream: MediaStream) {
    this.stream = stream;
    this.recorder = new (window as any).MediaRecorder(stream, {
      mimeType: "video/webm;codecs=vp9",
    });

    this.recorder.ondataavailable = (event: BlobEvent) => {
      if (event.data.size > 0) {
        this.chunks.push(event.data);
      }
    };
  }

  start() {
    this.chunks = [];
    this.recorder.start();
  }

  stop(): Blob {
    this.recorder.stop();
    return new Blob(this.chunks, { type: "video/webm" });
  }

  pause() {
    if (this.recorder.state === "recording") {
      this.recorder.pause();
    }
  }

  resume() {
    if (this.recorder.state === "paused") {
      this.recorder.resume();
    }
  }

  isSupported(): boolean {
    return typeof (window as any).MediaRecorder !== "undefined";
  }
}
