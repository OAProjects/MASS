export interface User {
  user_id: number;
  email: string;
  password: string;
  role: 'patient' | 'doctor';
  created_at: Date;
  newPassword?: string;
}
