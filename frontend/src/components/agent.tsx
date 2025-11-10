"use client"

import Image from "next/image";
import { UserContext } from "@/context/UserContext";
import { useContext, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";

enum CallStatus {
  INACTIVE = 'INACTIVE',
  CONNECTING = 'CONNECTING',
  ACTIVE = 'ACTIVE',
  FINISHED = 'FINISHED'
}

const Agent = () => {

  const { user } = useContext(UserContext);
  const router = useRouter();
  // Redirect effect
  useEffect(() => {
    if (user === null) {
      router.push("/login");
    }
  }, [user, router]);


  const [callStatus, setCallStatus] = useState<CallStatus>(CallStatus.INACTIVE);
  const isSpeaking = true;
  const messages = [
    'What is your name?',
    `My name is ${user?.username}`
  ]

  const lastMessage = messages[messages.length - 1]

  const handleCall = async () => {
    setCallStatus(CallStatus.CONNECTING);
    setTimeout(() => {
      setCallStatus(CallStatus.ACTIVE);
    }, 2000)
  }

  const handleDisconnect = () => {
    setCallStatus(CallStatus.FINISHED);
  };

  return (
    <>
      <div className="call-view">
        <div className="card-interviewer">
          <div className="avatar">
            <Image
              src="/ai-avatar.png"
              alt="profile-image"
              width={65}
              height={65}
            />
            {isSpeaking && <span className="animate-speak" />}
          </div>
          <h3>AI Interviewer</h3>
        </div>

        <div className="card-border">
          <div className="card-content">
            <Image
              src="/user-avatar.png"
              alt="profile-image"
              width={539}
              height={539}
              className="rounded-full object-cover size-[120px] border border-white/10 shadow-lg"
            />
            <h3 className="text-lg font-semibold text-white/90 tracking-wide">{user?.username}</h3>
          </div>
        </div>
      </div>

      {messages.length > 0 && (
        <div className="w-full flex justify-center mt-4 px-4">
          <div className="caption-box p-4 max-w-lg w-full">
            <p key={lastMessage} className="text-white animate-captionChange text-sm sm:text-base font-medium">
              {lastMessage}
            </p>
          </div>
        </div>
      )}


      <div className="w-full flex justify-center">
        {callStatus !== "ACTIVE" ? (
          <button className="relative btn-call" onClick={() => handleCall()}>
            <span
              className={cn(
                "absolute animate-ping rounded-full opacity-75",
                callStatus !== "CONNECTING" && "hidden"
              )}
            />
            <span className="relative">
              {callStatus === "INACTIVE" || callStatus === "FINISHED"
                ? "Call"
                : ". . ."}
            </span>
          </button>
        ) : (
          <button className="btn-disconnect" onClick={() => handleDisconnect()}>
            End
          </button>
        )}
      </div>
    </>
  );
};

export default Agent;
