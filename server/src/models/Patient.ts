export interface Patient {
    patient_id: number;
    user_id: number;
    first_name: string;
    last_name: string;
    date_of_birth: Date;
    gender: 'male' | 'female' | 'other';
    created_at: Date;
}