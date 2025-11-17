// WebRTC utility functions for peer connections and signaling

export interface RTCPeerConfig {
  iceServers: RTCIceServer[];
}

export const getIceServers = (): RTCIceServer[] => {
  return [
    {
      urls: ["stun:stun.l.google.com:19302", "stun:stun1.l.google.com:19302"],
    },
  ];
};

export const createPeerConnection = (config?: RTCPeerConfig): RTCPeerConnection => {
  const peerConnection = new RTCPeerConnection({
    iceServers: config?.iceServers || getIceServers(),
  });

  return peerConnection;
};

export const getLocalStream = async (
  audio: boolean = true,
  video: boolean = true
): Promise<MediaStream> => {
  try {
    const stream = await navigator.mediaDevices.getUserMedia({
      audio,
      video: video ? { width: { ideal: 1280 }, height: { ideal: 720 } } : false,
    });
    return stream;
  } catch (error) {
    console.error("[v0] Error getting local stream:", error);
    throw error;
  }
};

export const stopStream = (stream: MediaStream) => {
  stream.getTracks().forEach((track) => track.stop());
};

export interface SignalingMessage {
  type: "offer" | "answer" | "ice-candidate";
  from: string;
  to: string;
  data: any;
  roomId: string;
}

export const createOffer = async (peerConnection: RTCPeerConnection): Promise<RTCSessionDescriptionInit> => {
  const offer = await peerConnection.createOffer({
    offerToReceiveAudio: true,
    offerToReceiveVideo: true,
  });
  await peerConnection.setLocalDescription(offer);
  return offer;
};

export const createAnswer = async (peerConnection: RTCPeerConnection): Promise<RTCSessionDescriptionInit> => {
  const answer = await peerConnection.createAnswer();
  await peerConnection.setLocalDescription(answer);
  return answer;
};
