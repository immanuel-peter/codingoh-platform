import { NextResponse } from "next/server";
import { sendRescheduleMeeting } from "@/api/send-email"; // Adjust path as necessary
import { z } from "zod";

// Schema validation for request body
const RescheduleMeetingSchema = z.object({
  to_email: z.string().email(),
  receiver_id: z.string(),
  receiver_name: z.string(),
  receiver_tz: z.string(),
  receiver_note: z.string(),
  scheduler_name: z.string(),
  question_title: z.string(),
  question_id: z.number(),
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const parsedBody = RescheduleMeetingSchema.parse(body);

    const { data, error } = await sendRescheduleMeeting(parsedBody);

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
