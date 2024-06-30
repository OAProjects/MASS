CREATE DATABASE MASS_DB;

\c MASS_DB;

-- users table
CREATE TABLE IF NOT EXISTS users (
    user_id SERIAL PRIMARY KEY,
    email VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    role VARCHAR(20) NOT NULL CHECK (role IN ('patient', 'doctor')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- patients table
CREATE TABLE IF NOT EXISTS patients (
    patient_id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL UNIQUE REFERENCES users(user_id),
    first_name VARCHAR(50) NOT NULL,
    last_name VARCHAR(50) NOT NULL,
    date_of_birth DATE NOT NULL,
    gender VARCHAR(20) NOT NULL CHECK (gender IN ('male', 'female', 'other')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- doctors table
CREATE TABLE IF NOT EXISTS doctors (
    doctor_id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL UNIQUE REFERENCES users(user_id),
    first_name VARCHAR(50) NOT NULL,
    last_name VARCHAR(50) NOT NULL,
    date_of_birth DATE NOT NULL,
    gender VARCHAR(20) NOT NULL CHECK (gender IN ('male', 'female', 'other')),
    specialisation VARCHAR(100) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- appointments table
CREATE TABLE IF NOT EXISTS appointments (
    appointment_id SERIAL PRIMARY KEY,
    patient_id INTEGER NOT NULL REFERENCES patients(patient_id),
    doctor_id INTEGER NOT NULL REFERENCES doctors(doctor_id),
    appointment_date TIMESTAMP NOT NULL,
    reason VARCHAR(255) NOT NULL CHECK (reason IN ('Routine Check-up', 'Follow-up', 'Consultation', 'Emergency')),
    status VARCHAR(20) NOT NULL CHECK (status IN ('scheduled', 'canceled', 'completed')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP