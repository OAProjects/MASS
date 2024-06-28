export interface User {
  user_id: number;
  username: string;
  password: string;
  email: string;
  role: 'patient' | 'doctor';
  first_name: string;
  last_name: string;
  date_of_birth: Date;
  gender: 'male' | 'female' | 'other';
  created_at: Date;
  newPassword?: string;
}
