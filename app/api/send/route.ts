import { render } from "@react-email/render";
import { Resend } from "resend";
import { MeetingRequest } from "@/api/email-templates/MeetingRequest";

const resend = new Resend(process.env.NEXT_PUBLIC_RESEND_KEY);

export async function POST(request: Request) {
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
  } = await request.json();

  try {
    const { data, error } = await resend.emails.send({
      from: "Codey from CodingOH <codey@codingoh.com>",
      to: [to_email],
      subject: `You received a meeting request from ${scheduler_name}!`,
      react: MeetingRequest({
        receiver_name,
        scheduler_id,
        scheduler_name,
        scheduled_time,
        scheduler_tz,
        question_title,
        question_id,
        sender_note,
      }),
    });

    if (error) {
      console.error("[UP] Error sending email:", error);
      return Response.json({ error }, { status: 500 });
    }

    return Response.json({ data });
  } catch (error) {
    console.error("[DOWN] Error sending email:", error);
    return Response.json({ error }, { status: 500 });
  }

  // try {
  //   const response = await fetch("https://api.resend.com/emails", {
  //     method: "POST",
  //     headers: {
  //       Authorization: `Bearer ${process.env.NEXT_PUBLIC_RESEND_KEY}`,
  //       "Content-Type": "application/json",
  //     },
  //     body: JSON.stringify({
  //       from: "Codey from CodingOH <codey@codingoh.com>",
  //       to: [to_email],
  //       subject: `You received a meeting request from ${scheduler_name}!`,
  //       html: htmlContent,
  //     }),
  //   });

  //   const responseText = await response.text(); // Get the raw response text
  //   console.log("Response text:", responseText); // Log the raw response text

  //   // Attempt to parse JSON
  //   const responseData = JSON.parse(responseText);

  //   return NextResponse.json({ data: responseData });
  // } catch (error) {
  //   console.error("Error sending email:", error);
  //   return NextResponse.json(
  //     { error: "Failed to send email" },
  //     { status: 500 }
  //   );
  // }
}
