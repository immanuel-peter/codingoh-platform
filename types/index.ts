import { StaticImageData } from "next/image";

export interface Question {
  id?: number;
  created_at?: Date | string;
  asker?: Coder;
  question?: string;
  tags?: string[];
  description?: string;
  answer_preference?: string;
  notify_email?: boolean;
  notify_desktop?: boolean;
  answer?: boolean;
  artificial_date?: Date | null;
  embedding?: string;
  similarity?: number;
  contributors?: Contributor[];
  [key: string]: any;
}

export interface Coder {
  id?: number;
  created_at?: Date | string;
  first_name?: string;
  last_name?: string;
  gender?: string;
  birthday?: string;
  timezone?: string;
  email_address?: string;
  company?: string;
  position?: string;
  city?: string;
  us_state?: string;
  country?: string;
  about?: string;
  background_image?: number;
  skills?: string[];
  socials?: Social[];
  stack?: Proficiency[];
  education?: string;
  auth_id?: string;
  profile_image?: boolean;
  is_online?: boolean;
}

export interface UserType {
  id?: number;
  name?: string;
  gender?: string;
  dob?: string;
  timezone?: string;
  email?: string;
  education?: string;
  company?: string;
  position?: string;
  city?: string;
  usState?: string;
  country?: string;
  profileImg?: string;
  about?: string;
  backgroundImg?: StaticImageData;
  stack?: Proficiency[];
  skills?: string[];
  socials?: Social[];
}

export interface Proficiency {
  language?: string;
  proficiency?: number;
}

export interface Contributor {
  id?: number;
  created_at?: Date | string;
  question_id?: Question;
  user_id?: Coder;
}

export interface Project {
  id?: number;
  created_at?: Date | string;
  owner?: Coder | null;
  name?: string;
  description?: string;
  start_date?: string;
  end_date?: string;
  github?: string;
  status?: string;
  project_image?: boolean;
  stack?: string[];
  skills?: string[];
  application?: string;
}

export interface Social {
  social?: string;
  link?: string;
}

export interface Comment {
  id?: number;
  created_at?: Date | string;
  parent_comment?: Comment | null;
  commenter?: Coder;
  is_answer?: boolean;
  likes?: number;
  question?: Question;
  text?: string;
  replies?: Comment[];
  level?: number;
  [key: string]: any;
}

export interface Scheduling {
  id?: number;
  created_at?: string;
  scheduler_id?: Coder;
  receiver_id?: Coder;
  scheduled_time?: string;
  sender_note?: string;
  status?: string | null;
  receiver_note?: string | null;
  question_id?: Question;
  meeting_id?: string;
  is_done?: boolean;
  expired?: boolean;
  [key: string]: any;
}

// app/users/[id]/page.tsx
export interface RecordType {
  key?: string;
  title?: string;
  description?: string;
  chosen?: boolean;
}

export interface Tag {
  value?: string;
  label?: string;
}

export interface Conversation {
  id?: number;
  created_at?: Date | string;
  name?: string;
}

export interface Message {
  id?: number;
  created_at?: Date | string;
  sender_id?: Coder;
  conversation_id?: Conversation;
  message?: string;
  attachments?: string[];
  reactions?: string[];
  reply_to?: string;
}

export interface Participant {
  id?: number;
  created_at?: Date | string;
  user_id?: Coder;
  conversation_id?: Conversation;
}

export interface Notification {
  id?: number;
  created_at?: string;
  read?: boolean;
  event?: string;
  coder_ref?: Coder;
  question_ref?: Question;
  comment_ref?: Comment;
  conversation_ref?: number;
  project_ref?: Project;
  scheduling_ref?: Scheduling;
  message_ref?: number;
}

export interface Meeting {
  user?: Coder;
  participant?: Coder;
  is_done?: boolean;
  chat?: { [key: string]: string };
  [key: string]: any;
}
