export interface Doctor {
    doctor_id: number;
    user_id: number;
    first_name: string;
    last_name: string;
    date_of_birth: Date;
    gender: 'male' | 'female' | 'other';
    specialisation: string;
    created_at: Date;
}