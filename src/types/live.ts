export type VoiceSessionState =
  | "idle"
  | "connecting"
  | "listening"
  | "speaking"
  | "error"
  | "ended";

export interface VoiceMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
}
