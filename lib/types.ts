
export type SpeechResult = {
    audio: ArrayBuffer; // Raw bytes returned to the caller
    contentType: string; // e.g., "audio/wav"
    fileName: string; // Suggested filename for saving
  };

export enum UserRole{
    ADMIN,
    USER
}