
export interface CalendarEvent {
  id?: string;
  title: string;
  description?: string | null;
  event_date: string;
  event_type?: string | null;
  user_id?: string | null;
  created_at?: string | null;
}
