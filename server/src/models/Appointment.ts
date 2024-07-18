export interface Appointment {
    appointment_id: number;
    patient_id: number;
    doctor_id: number;
    appointment_date: Date;
    reason: 'Routine Check-up' | 'Follow-up' | 'Consultation' | 'Emergency';
    status: 'upcoming' | 'canceled' | 'past';
    created_at: Date;
}