import { NextResponse } from "next/server";
import { sendRejectMeeting } from "@/api/send-email"; // Adjust path as necessary
import { z } from "zod";

// Schema validation for request body
const RejectMeetingSchema = z.object({
  to_email: z.string().email(),
  receiver_id: z.string(),
  receiver_name: z.string(),
  scheduler_name: z.string(),
  question_title: z.string(),
  question_id: z.number(),
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const parsedBody = RejectMeetingSchema.parse(body);

    const { data, error } = await sendRejectMeeting(parsedBody);

    if (error) {
      return NextResponse.json({ error }, { status: 500 });
    }

    return NextResponse.json({ data });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors }, { status: 400 });
    }
    return NextResponse.json(
      { error: (error as Error).message },
      { status: 500 }
    );
  }
}
