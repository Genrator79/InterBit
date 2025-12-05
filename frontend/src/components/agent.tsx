"use client";

import Image from "next/image";
import { UserContext } from "@/context/UserContext";
import { useContext, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { vapi } from "@/lib/vapi.sdk";
import { interviewer } from "@/constants";
import { cn } from "@/lib/utils";
import { createFeedback } from "@/lib/actions/general.action";
import FeedbackLoading from "./FeedbackLoading";
import { motion, AnimatePresence } from "framer-motion";
import { Mic, Phone, PhoneOff, Radio } from "lucide-react";

interface AgentProps {
  username: string;
  userId: number;
  type: string;
  interviewId: string;
  questions: String[];
}

enum CallStatus {
  INACTIVE = "INACTIVE",
  CONNECTING = "CONNECTING",
  ACTIVE = "ACTIVE",
  FINISHED = "FINISHED",
}

interface SavedMessage {
  role: "user" | "system" | "assistant";
  content: string;
}

const Agent = ({ username, userId, type, interviewId, questions }: AgentProps) => {
  const { user } = useContext(UserContext);
  const router = useRouter();

  // State
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [callStatus, setCallStatus] = useState<CallStatus>(CallStatus.INACTIVE);
  const [messages, setMessages] = useState<SavedMessage[]>([]);
  const [isGeneratingFeedback, setIsGeneratingFeedback] = useState(false);

  // Redirect if no user
  useEffect(() => {
    if (user === null) {
      router.push("/login");
    }
  }, [user, router]);

  // Vapi Event Listeners
  useEffect(() => {
    const onCallStart = () => setCallStatus(CallStatus.ACTIVE);
    const onCallEnd = () => setCallStatus(CallStatus.FINISHED);

    const onMessage = (message: any) => {
      if (message.type === "transcript" && message.transcriptType === "final") {
        const newMessage = { role: message.role, content: message.transcript };
        setMessages((prev) => [...prev, newMessage]);
      }
    };

    const onSpeechStart = () => setIsSpeaking(true);
    const onSpeechEnd = () => setIsSpeaking(false);
    const onError = (error: Error) => console.log("Error:", error);

    vapi.on("call-start", onCallStart);
    vapi.on("call-end", onCallEnd);
    vapi.on("message", onMessage);
    vapi.on("speech-start", onSpeechStart);
    vapi.on("speech-end", onSpeechEnd);
    vapi.on("error", onError);

    return () => {
      vapi.off("call-start", onCallStart);
      vapi.off("call-end", onCallEnd);
      vapi.off("message", onMessage);
      vapi.off("speech-start", onSpeechStart);
      vapi.off("speech-end", onSpeechEnd);
      vapi.off("error", onError);
    };
  }, []);

  // Feedback Generation
  const handleGenerateFeedback = async (messages: SavedMessage[]) => {
    console.log("Generating feedback for messages:", messages.length);
    setIsGeneratingFeedback(true);

    try {
      const { success, feedbackId } = await createFeedback({
        interviewId,
        userId,
        transcript: messages,
      });

      if (success && feedbackId) {
        router.push(`/takeInterview/${interviewId}/feedback`);
      } else {
        console.error("Failed to create feedback");
        setIsGeneratingFeedback(false);
        router.push("/ai-interview");
      }
    } catch (error) {
      console.error("Error in handleGenerateFeedback:", error);
      setIsGeneratingFeedback(false);
      router.push("/ai-interview");
    }
  };

  // Auto-trigger feedback on call finish
  useEffect(() => {
    if (callStatus === CallStatus.FINISHED) {
      if (type === "generate") {
        router.push("/");
      } else {
        handleGenerateFeedback(messages);
      }
    }
  }, [callStatus, messages, router, type, userId, interviewId]); // Dependencies updated

  // Handlers
  const handleCall = async () => {
    setCallStatus(CallStatus.CONNECTING);
    try {
      if (type === "generate") {
        await vapi.start(
          process.env.NEXT_PUBLIC_VAPI_WORKFLOW_ID!,
          {
            variableValues: {
              username: username,
              userid: userId,
            },
          }
        );
      } else {
        let formattedQuestions = "";
        if (questions) {
          formattedQuestions = questions.map((q) => `- ${q}`).join("\n");
        }
        await vapi.start(interviewer, {
          variableValues: {
            questions: formattedQuestions,
          },
        });
      }
    } catch (e) {
      console.error(e)
      // Reset to INACTIVE if start fails? 
      // setCallStatus(CallStatus.INACTIVE) 
    }
  };

  const handleDisconnect = () => {
    setCallStatus(CallStatus.FINISHED);
    vapi.stop();
  };

  // Derived UI State
  const latestMessage = messages[messages.length - 1]?.content;
  const isCallActive = callStatus === CallStatus.ACTIVE;
  const isConnecting = callStatus === CallStatus.CONNECTING;

  if (isGeneratingFeedback) {
    return <FeedbackLoading />;
  }

  return (
    <>
      <div className="flex flex-row gap-4 md:gap-4 w-full items-stretch justify-center h-[260px] md:h-[320px]">
        {/* AI Interviewer Card */}
        <div className="relative flex-1 w-1/2 flex flex-col items-center justify-center p-4 rounded-3xl border border-white/10 bg-gradient-to-b from-slate-900/80 to-slate-950/80 backdrop-blur-md shadow-2xl overflow-hidden group">
          {/* Decorative Background Glows - Keeping slightly different hues (Indigo/Purple) for distinction but same base style */}
          <div className="absolute top-0 right-0 w-40 h-40 bg-indigo-500/10 rounded-full blur-[80px] pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-40 h-40 bg-purple-500/10 rounded-full blur-[80px] pointer-events-none" />

          <motion.div
            animate={isSpeaking ? { scale: [1, 1.1, 1], filter: "drop-shadow(0 0 10px rgba(99, 102, 241, 0.5))" } : { scale: 1, filter: "drop-shadow(0 0 0px rgba(0,0,0,0))" }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            className="avatar relative z-20 w-32 h-32 md:w-32 md:h-32 lg:w-40 lg:h-40 flex items-center justify-center"
          >
            <Image
              src="/ai-avatar.png"
              alt="AI Agent"
              fill
              className="object-contain z-20 relative drop-shadow-2xl grayscale brightness-[100] contrast-[0] invert"
            />

            {/* Pulse Ring - Adjusted for transparent look (behind) */}
            {isSpeaking && (
              <>
                <motion.div
                  initial={{ scale: 0.6, opacity: 0.6 }}
                  animate={{ scale: 1.6, opacity: 0 }}
                  transition={{ duration: 1.5, repeat: Infinity, ease: "easeOut" }}
                  className="absolute inset-0 bg-indigo-500/50 rounded-full z-10"
                />
              </>
            )}

            {/* Connecting Ring (if active but silent) */}
            {callStatus === CallStatus.ACTIVE && !isSpeaking && (
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                className="absolute -inset-4 border border-dashed border-indigo-400/30 rounded-full z-0"
              />
            )}
          </motion.div>

          <h3 className="mt-2 md:mt-4 text-sm md:text-xl font-bold text-white z-20 tracking-tight text-center drop-shadow-md">
            AI Interviewer
            {callStatus === CallStatus.ACTIVE && (
              <span className="ml-2 inline-block w-2 h-2 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_10px_#34d399]" />
            )}
          </h3>
        </div>

        {/* User Profile Card */}
        <div className="relative flex-1 w-1/2 flex flex-col items-center justify-center p-4 rounded-3xl border border-white/10 bg-gradient-to-b from-slate-900/80 to-slate-950/80 backdrop-blur-md shadow-2xl overflow-hidden">
          {/* Decorative Background Glows */}
          <div className="absolute top-0 left-0 w-32 h-32 bg-emerald-500/10 rounded-full blur-[60px] pointer-events-none" />
          <div className="absolute bottom-0 right-0 w-32 h-32 bg-teal-500/10 rounded-full blur-[60px] pointer-events-none" />

          <div className="relative w-24 h-24 md:w-28 md:h-28 lg:w-36 lg:h-36">
            <Image
              src="/user-avatar.png"
              alt="User"
              fill
              className="rounded-full object-cover border-4 border-white/10 shadow-2xl"
            />

            {callStatus === CallStatus.ACTIVE && !isSpeaking && (
              <motion.div
                animate={{ scale: [1, 1.1, 1], opacity: [0.3, 0.1, 0.3] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="absolute inset-0 border-2 border-emerald-500/30 rounded-full"
              />
            )}
          </div>

          <div className="text-center mt-2 md:mt-4 z-10">
            <h3 className="text-sm md:text-lg font-bold text-white tracking-wide drop-shadow-md">
              {user?.username || "You"}
            </h3>
            <p className="text-white/40 text-xs mt-1 font-medium tracking-wider uppercase">Candidate</p>
          </div>
        </div>
      </div>

      {/* Transcript - Reduced Margins */}
      <div className="w-full flex justify-center mt-4 px-4 min-h-[60px]">
        <AnimatePresence mode="wait">
          {messages.length > 0 && (
            <motion.div
              key={latestMessage}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="caption-box p-3 max-w-2xl w-full text-center"
            >
              <p className="text-white text-sm md:text-base font-medium leading-relaxed">
                {latestMessage}
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>


      {/* Controls - Reduced Margins */}
      <div className="w-full flex justify-center mt-4">
        {callStatus !== CallStatus.ACTIVE ? (
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="relative btn-call"
            onClick={() => handleCall()}
            disabled={callStatus === CallStatus.CONNECTING}
          >
            {callStatus === CallStatus.CONNECTING && (
              <span className="absolute inset-0 flex items-center justify-center">
                <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              </span>
            )}

            <span className={cn("relative flex items-center gap-2", callStatus === CallStatus.CONNECTING && "opacity-0")}>
              {callStatus === CallStatus.INACTIVE || callStatus === CallStatus.FINISHED ? (
                <> <Phone className="w-5 h-5" /> Start Interview </>
              ) : (
                "Connecting..."
              )}
            </span>
          </motion.button>
        ) : (
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="btn-disconnect flex items-center gap-2"
            onClick={() => handleDisconnect()}
          >
            <PhoneOff className="w-5 h-5" /> End Interview
          </motion.button>
        )}
      </div>
    </>
  );
};

export default Agent;
