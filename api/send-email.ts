import { Resend } from "resend";
import { render } from "@react-email/render";
import { MeetingRequest } from "./email-templates/MeetingRequest";
import {
  AcceptMeeting,
  createMeetingICS,
} from "./email-templates/AcceptMeeting";
import { RejectMeeting } from "./email-templates/RejectMeeting";
import { RescheduleMeeting } from "./email-templates/RescheduleMeeting";
import { CancelMeeting } from "./email-templates/CancelMeeting";

const resend = new Resend(process.env.NEXT_PUBLIC_RESEND_KEY);

export const sendMeetingRequest = async (props: {
  to_email: string;
  receiver_name: string;
  scheduler_id: string;
  scheduler_name: string;
  scheduled_time: string;
  scheduler_tz: string;
  question_title: string;
  question_id: number;
  sender_note: string;
}) => {
  const {
    to_email,
    receiver_name,
    scheduler_id,
    scheduler_name,
    scheduled_time,
    scheduler_tz,
    question_title,
    question_id,
    sender_note,
  } = props;

  const url = "https://api.resend.com/emails"; // Replace with your actual email API URL
  const headers = {
    Authorization: `Bearer ${process.env.NEXT_PUBLIC_RESEND_KEY}`, // Replace with your actual API key
    "Content-Type": "application/json",
  };
  const htmlContent = await render(
    MeetingRequest({
      receiver_name,
      scheduler_id,
      scheduler_name,
      scheduled_time,
      scheduler_tz,
      question_title,
      question_id,
      sender_note,
    }),
    {
      pretty: true,
    }
  );
  const body = JSON.stringify({
    from: "Codey from CodingOH <codey@codingoh.com>",
    to: [to_email],
    subject: `You received a meeting request from ${scheduler_name}!`,
    html: htmlContent,
  });

  try {
    // const { data, error } = await resend.emails.send({
    //   from: "Codey from CodingOH <codey@codingoh.com>",
    //   to: [to_email],
    //   subject: `You received a meeting request from ${scheduler_name}!`,
    //   react: MeetingRequest({
    //     receiver_name,
    //     scheduler_id,
    //     scheduler_name,
    //     scheduled_time,
    //     scheduler_tz,
    //     question_title,
    //     question_id,
    //     sender_note,
    //   }),
    // });

    // return { data, error };

    const response = await fetch(url, {
      method: "POST",
      headers: headers,
      body: body,
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error("Error:", errorData);
      return {
        data: undefined,
        error: `Error: ${response.status} ${response.statusText}`,
      };
    }

    const data = await response.json();
    return { data, error: undefined };
  } catch (e) {
    return { data: undefined, error: (e as Error).message };
  }
};

export const sendAcceptMeeting = async (props: {
  to_email: string;
  meeting_id: string;
  receiver_id: string;
  receiver_name: string;
  receiver_tz: string;
  scheduler_name: string;
  scheduled_time: string;
  question_title: string;
  question_id: number;
}) => {
  const {
    to_email,
    meeting_id,
    receiver_id,
    receiver_name,
    receiver_tz,
    scheduler_name,
    scheduled_time,
    question_title,
    question_id,
  } = props;

  try {
    const icsFile = createMeetingICS({
      receiver_name,
      receiver_tz,
      scheduler_name,
      scheduled_time,
      question_title,
    });

    const { data, error } = await resend.emails.send({
      from: "Codey from CodingOH <codey@codingoh.com>",
      to: [to_email],
      subject: `Your meeting request was accepted by ${receiver_name}!`,
      react: AcceptMeeting({
        receiver_name,
        receiver_id,
        receiver_tz,
        scheduler_name,
        scheduled_time,
        question_title,
        question_id,
      }),
      headers: {
        "X-Entity-Ref-ID": meeting_id,
      },
      attachments: [
        {
          filename: icsFile.name,
          content: await icsFile.text(),
          content_type: icsFile.type,
        },
      ],
    });

    return { data, error };
  } catch (e) {
    return { data: undefined, error: (e as Error).message };
  }
};

export const sendRejectMeeting = async (props: {
  to_email: string;
  receiver_id: string;
  receiver_name: string;
  scheduler_name: string;
  question_title: string;
  question_id: number;
}) => {
  const {
    to_email,
    receiver_id,
    receiver_name,
    scheduler_name,
    question_title,
    question_id,
  } = props;

  try {
    const { data, error } = await resend.emails.send({
      from: "Codey from CodingOH <codey@codingoh.com>",
      to: [to_email],
      subject: `Your meeting request was rejected by ${receiver_name}.`,
      react: RejectMeeting({
        receiver_name,
        receiver_id,
        scheduler_name,
        question_title,
        question_id,
      }),
    });

    return { data, error };
  } catch (e) {
    return { data: undefined, error: (e as Error).message };
  }
};

export const sendRescheduleMeeting = async (props: {
  to_email: string;
  receiver_id: string;
  receiver_name: string;
  receiver_tz: string;
  receiver_note: string;
  scheduler_name: string;
  question_title: string;
  question_id: number;
}) => {
  const {
    to_email,
    receiver_id,
    receiver_name,
    receiver_tz,
    receiver_note,
    scheduler_name,
    question_title,
    question_id,
  } = props;

  try {
    const { data, error } = await resend.emails.send({
      from: "Codey from CodingOH <codey@codingoh.com>",
      to: [to_email],
      subject: `${receiver_name} has asked to reschedule your meeting.`,
      react: RescheduleMeeting({
        receiver_id,
        receiver_name,
        receiver_tz,
        receiver_note,
        scheduler_name,
        question_title,
        question_id,
      }),
    });

    return { data, error };
  } catch (e) {
    return { data: undefined, error: (e as Error).message };
  }
};

export const sendCancelMeeting = async (props: {
  to_email: string;
  receiver_name: string;
  scheduler_id: string;
  scheduler_name: string;
  question_title: string;
  question_id: number;
}) => {
  const {
    to_email,
    receiver_name,
    scheduler_id,
    scheduler_name,
    question_title,
    question_id,
  } = props;

  try {
    const { data, error } = await resend.emails.send({
      from: "Codey from CodingOH <codey@codingoh.com>",
      to: [to_email],
      subject: `${scheduler_name} has canceled their meeting.`,
      react: CancelMeeting({
        receiver_name,
        scheduler_id,
        scheduler_name,
        question_title,
        question_id,
      }),
    });

    return { data, error };
  } catch (e) {
    return { data: undefined, error: (e as Error).message };
  }
};
