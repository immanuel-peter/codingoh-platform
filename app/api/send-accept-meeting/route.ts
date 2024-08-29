import { NextResponse } from "next/server";
import { sendAcceptMeeting } from "@/api/send-email"; // Adjust the path accordingly
import { z } from "zod";

// Schema validation for request body
const AcceptMeetingSchema = z.object({
  to_email: z.string().email(),
  meeting_id: z.string(),
  receiver_id: z.string(),
  receiver_name: z.string(),
  receiver_tz: z.string(),
  scheduler_name: z.string(),
  scheduled_time: z.string(),
  question_title: z.string(),
  question_id: z.number(),
});

export async function POST(req: Request) {
  try {
    const body = await req.json();

    // Validate the request body
    const parsedBody = AcceptMeetingSchema.parse(body);

    const { data, error } = await sendAcceptMeeting(parsedBody);

    if (error) {
      return NextResponse.json({ error }, { status: 500 });
    }

    return NextResponse.json({ data });
  } catch (error) {
    if (error instanceof z.ZodError) {
      // Handle validation errors
      return NextResponse.json({ error: error.errors }, { status: 400 });
    }
    // Handle other errors
    return NextResponse.json(
      { error: (error as Error).message },
      { status: 500 }
    );
  }
}
