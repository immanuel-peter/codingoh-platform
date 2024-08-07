"use client";

import {
  CallControls,
  CallingState,
  StreamCall,
  StreamTheme,
  StreamVideo,
  StreamVideoClient,
  useCallStateHooks,
  User,
  Call,
  hasScreenShare,
  ParticipantView,
  TranscriptionSettingsRequestModeEnum,
  SpeakerLayout,
} from "@stream-io/video-react-sdk";
import { useEffect, useState } from "react";
import generateToken from "@/utils/generateToken";
import "@stream-io/video-react-sdk/dist/css/styles.css";
import { createClient } from "@/utils/supabase/client";
import { FaUserGroup } from "react-icons/fa6";
import { BsFillChatRightFill } from "react-icons/bs";
import Image from "next/image";
import { Progress, Avatar } from "antd";
import { useRouter } from "next/navigation";

import { Meeting, Proficiency } from "@/types";
import { getTopLanguages } from "@/utils";
import sortedIcons from "@/utils/icons";
import { ChatComponent } from "@/components";

const MyUILayout = ({
  meetingId,
  user_one,
  user_two,
  id,
}: {
  meetingId: string;
  user_one: number;
  user_two: number;
  id: number;
}) => {
  const supabase = createClient();
  const router = useRouter();

  const { useCallCallingState, useCallSettings } = useCallStateHooks();
  const callingState = useCallCallingState();
  const { transcription } = useCallSettings() || {};

  if (transcription) {
    transcription.mode = TranscriptionSettingsRequestModeEnum.AUTO_ON;
  }

  if (callingState !== CallingState.JOINED) {
    return (
      <div className="flex items-center justify-center h-full w-full">
        Loading...
      </div>
    );
  }

  const finishCall = async () => {
    const { data, error } = await supabase
      .from("schedulings")
      .update({ is_done: true })
      .eq("meeting_id", meetingId)
      .select();
    if (error) {
      console.error("Error updating scheduling: ", error.message);
    } else {
      console.log("Scheduling updated successfully: ", data);
      const { data: notif, error } = await supabase
        .from("notifications")
        .insert([
          { event: "finish_meet", coder_ref: user_one, scheduling_ref: id },
          { event: "finish_meet", coder_ref: user_two, scheduling_ref: id },
        ]);
      router.push("/");
    }
  };

  return (
    <StreamTheme>
      <div className="h-full">
        <SpeakerLayout participantsBarPosition="bottom" />
      </div>
      <div>
        <CallControls onLeave={finishCall} />
      </div>
    </StreamTheme>
  );
};

const MeetingPage = ({ params }: { params: { id: string } }) => {
  const supabase = createClient();
  const router = useRouter();
  const [meeting, setMeeting] = useState<Meeting>({});
  const [client, setClient] = useState<StreamVideoClient | null>(null);
  const [call, setCall] = useState<Call | null>(null);
  const [show, setShow] = useState<string>("");
  const [timeRemaining, setTimeRemaining] = useState<number>(0);
  const [showMeetingUI, setShowMeetingUI] = useState<boolean>(false);

  useEffect(() => {
    const fetchMeeting = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      const { data: meeting, error } = await supabase
        .from("schedulings")
        .select(
          `id, scheduler_id (id, first_name, last_name, education, company, position, city, skills, stack, profile_image, auth_id), receiver_id (id, first_name, last_name, education, company, position, city, skills, stack, profile_image, auth_id), scheduled_time, is_done`
        )
        .eq("meeting_id", params.id)
        .single();
      if (meeting) {
        const { id, scheduler_id, receiver_id, scheduled_time, is_done } =
          meeting;
        let updatedUser = {};
        let updatedParticipant = {};
        if (user?.id === scheduler_id.auth_id) {
          updatedUser = {
            id: scheduler_id.id,
            first_name: scheduler_id.first_name,
            last_name: scheduler_id.last_name,
            education: scheduler_id.education,
            company: scheduler_id.company,
            position: scheduler_id.position,
            city: scheduler_id.city,
            skills: scheduler_id.skills,
            stack: scheduler_id.stack,
            profile_image: scheduler_id.profile_image,
            auth_id: scheduler_id.auth_id,
          };
          updatedParticipant = {
            id: receiver_id.id,
            first_name: receiver_id.first_name,
            last_name: receiver_id.last_name,
            education: receiver_id.education,
            company: receiver_id.company,
            position: receiver_id.position,
            city: receiver_id.city,
            skills: receiver_id.skills,
            stack: receiver_id.stack,
            profile_image: receiver_id.profile_image,
            auth_id: receiver_id.auth_id,
          };
        } else {
          updatedUser = {
            id: receiver_id.id,
            first_name: receiver_id.first_name,
            last_name: receiver_id.last_name,
            education: receiver_id.education,
            company: receiver_id.company,
            position: receiver_id.position,
            city: receiver_id.city,
            skills: receiver_id.skills,
            stack: receiver_id.stack,
            profile_image: receiver_id.profile_image,
            auth_id: receiver_id.auth_id,
          };
          updatedParticipant = {
            id: scheduler_id.id,
            first_name: scheduler_id.first_name,
            last_name: scheduler_id.last_name,
            education: scheduler_id.education,
            company: scheduler_id.company,
            position: scheduler_id.position,
            city: scheduler_id.city,
            skills: scheduler_id.skills,
            stack: scheduler_id.stack,
            profile_image: scheduler_id.profile_image,
            auth_id: scheduler_id.auth_id,
          };
        }
        const updatedMeeting = {
          id,
          user: updatedUser,
          participant: updatedParticipant,
          scheduled_time,
          is_done,
        };
        console.log(updatedMeeting);
        setMeeting(updatedMeeting);
      } else {
        console.log(error);
      }
    };
    fetchMeeting();

    const channel = supabase
      .channel("finish-meeting")
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "schedulings",
          filter: `meeting_id=eq.${params.id}`,
        },
        (payload) => {
          console.log("Meeting finished!", payload);
          router.push("/");
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [supabase, router]);

  useEffect(() => {
    if (meeting.scheduled_time) {
      const updateTimer = () => {
        const now = new Date();
        const meetingStart = new Date(meeting.scheduled_time);
        const timeDiff = meetingStart.getTime() - now.getTime();
        const fifteenMinutesInMillis = 15 * 60 * 1000;

        console.log("Current Time:", now);
        console.log("Meeting Start Time:", meetingStart);
        console.log("Time Difference (ms):", timeDiff);

        if (timeDiff <= fifteenMinutesInMillis) {
          setShowMeetingUI(true);
        } else {
          setShowMeetingUI(false);
          setTimeRemaining(Math.max(0, Math.ceil(timeDiff / 1000)));
        }
      };

      updateTimer();
      const timerId = setInterval(updateTimer, 1000);
      return () => clearInterval(timerId);
    }
  }, [meeting.scheduled_time]);

  useEffect(() => {
    const name = `${meeting.user?.first_name} ${meeting.user?.last_name}`;
    const apiKey = process.env.NEXT_PUBLIC_STREAM_VIDEO_API_KEY ?? "";
    const userId = name.replace(/\s+/g, "").toLowerCase();
    const token = generateToken(userId);
    const callId = params.id;

    const user: User = {
      id: userId,
      name: name,
    };

    const streamClient = new StreamVideoClient({ apiKey, user, token });
    const streamCall = streamClient.call("default", callId);

    streamCall.join({ create: true });

    setClient(streamClient);
    setCall(streamCall);

    // Cleanup function to leave the call when the component is unmounted
    return () => {
      streamCall.leave();
      streamClient.disconnectUser();
    };
  }, [meeting]);

  if (!client || !call) {
    return (
      <div className="flex items-center justify-center h-full w-full">
        Loading...
      </div>
    );
  }

  const coderTopLanguages: Proficiency[] = meeting.participant?.stack
    ? getTopLanguages(meeting.participant?.stack, 5)
    : [];

  return (
    <div className="flex h-full w-full bg-slate-300">
      {showMeetingUI ? (
        <>
          <div className="flex fixed h-screen w-3/4 items-center justify-center">
            <StreamVideo client={client}>
              <StreamCall call={call}>
                <MyUILayout
                  meetingId={params.id}
                  user_one={meeting.user?.id ?? 0}
                  user_two={meeting.participant?.id ?? 0}
                  id={meeting.id}
                />
              </StreamCall>
            </StreamVideo>
          </div>
          <div className="h-full w-1/4 ml-auto">
            <div className="flex items-center justify-between p-2">
              <FaUserGroup
                onClick={() =>
                  setShow(show != "participants" ? "participants" : "")
                }
                className={`text-3xl cursor-pointer ${show != "participants" ? "text-blue-400 hover:text-blue-700" : "text-blue-700 hover:text-blue-400"}`}
              />
              <BsFillChatRightFill
                onClick={() => setShow(show != "chat" ? "chat" : "")}
                className={`text-3xl cursor-pointer ${show != "chat" ? "text-blue-400 hover:text-blue-700" : "text-blue-700 hover:text-blue-400"}`}
              />
            </div>
            {show == "participants" ? (
              <div className="min-h-screen rounded-lg bg-gray-100">
                <div className="flex flex-col items-center justify-center p-2 gap-1">
                  {meeting.participant?.profile_image ? (
                    <Image
                      src={`${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/avatars/profileImg-${meeting.participant?.auth_id}`}
                      alt="Profile Image"
                      className="rounded-full h-1/2 w-1/2 my-2"
                      height={100}
                      width={100}
                    />
                  ) : (
                    <Avatar
                      size={100}
                      className="rounded-full h-1/2 w-1/2 my-2 bg-blue-300 text-blue-700"
                    >
                      {meeting.participant?.first_name?.[0]}
                      {meeting.participant?.last_name?.[0]}
                    </Avatar>
                  )}
                  <div className="p-2 w-full border border-black rounded-md">
                    <h1 className="text-xl font-bold">
                      {meeting.participant?.first_name}{" "}
                      {meeting.participant?.last_name}
                    </h1>
                    <p className="text-sm font-normal">
                      {meeting.participant?.position} at{" "}
                      {meeting.participant?.company}
                    </p>
                    <p className="text-sm font-normal">
                      Studied at {meeting.participant?.education}
                    </p>
                    <p className="text-sm font-normal">
                      Located in {meeting.participant?.city}
                    </p>
                  </div>
                  <div className="w-full mt-2 p-2 border border-black rounded-md">
                    <h1 className="mb-1 text-xl font-bold underline">
                      Tech Stack
                    </h1>
                    {coderTopLanguages.map((language, index) => (
                      <div
                        key={index}
                        className="flex flex-row items-center justify-between p-1 text-sm font-normal"
                      >
                        <p className="flex w-1/4">
                          {sortedIcons[language.language ?? ""]}
                        </p>
                        <Progress
                          size="small"
                          percent={language.proficiency}
                          format={(percent) => `${percent}`}
                          className="w-3/4"
                        />
                      </div>
                    ))}
                  </div>
                  <div className="w-full mt-2 p-2 border border-black rounded-md">
                    <h1 className="mb-1 text-xl font-bold underline">Skills</h1>
                    {meeting.participant?.skills
                      ?.slice(0, 5)
                      .map((skill, index) => (
                        <p key={index} className="text-sm font-normal">
                          {skill}
                        </p>
                      ))}
                  </div>
                </div>
              </div>
            ) : show == "chat" ? (
              <div className="flex flex-col min-h-screen rounded-lg bg-gray-100 overflow-y-auto">
                <ChatComponent
                  meetingId={params.id}
                  userId={meeting.user?.id ?? 0}
                />
              </div>
            ) : null}
          </div>
        </>
      ) : (
        <div className="flex items-center justify-center h-screen w-full">
          <div className="p-4 bg-white rounded shadow">
            <h1 className="text-lg font-bold mb-3">Meeting starts in:</h1>
            <div className="text-center">
              <Progress
                type="circle"
                percent={(1 - timeRemaining / (15 * 60)) * 100}
                format={() => {
                  const minutes = Math.floor(timeRemaining / 60);
                  const seconds = timeRemaining % 60;
                  console.log("Time Remaining:", timeRemaining);
                  return `${minutes}:${seconds.toString().padStart(2, "0")}`;
                }}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MeetingPage;
