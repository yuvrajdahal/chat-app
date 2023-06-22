import React, { Suspense, useEffect, useRef, useState } from "react";
import Loading from "../../components/Loading";

const CallTab = ({}) => {
  let localStream;
  let remoteStream;
  let peerConnection;
  const videoRoomId = window.location.pathname.split("/")[4];
  const receiverId = window.location.pathname.split("/")[3];

  const user1 = useRef();
  const user2 = useRef();

  async function initVideoStream() {
    localStream = await navigator.mediaDevices.getUserMedia({
      video: true,
      audio: false,
    });
    user1.current.srcObject = localStream;
    remoteStream = new MediaStream();
    user2.current.srcObject = remoteStream;
  }

  return (
    <div className="text-white w-full h-screen border relative">
      <Suspense
        fallback={
          <div className="w-full h-full flex justify-center items-center">
            <Loading className="w-[120px] h-[120px]" />
          </div>
        }
      >
        <video
          className="h-full w-full z-10"
          ref={user1}
          autoPlay
          playsInline
        />
        <video
          className="h-[150px] w-[150px] absolute z-50 top-5 left-5 border"
          autoPlay
          ref={user2}
          playsInline
        />
      </Suspense>
    </div>
  );
};
export default CallTab;
