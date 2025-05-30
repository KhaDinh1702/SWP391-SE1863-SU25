CREATE DATABASE HIV_Treatment
USE HIV_Treatment


-- 1. Users Table
CREATE TABLE Users (
    user_id INT PRIMARY KEY IDENTITY(1,1),
    username VARCHAR(50) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    phone VARCHAR(11),
    full_name VARCHAR(100),
    date_of_birth DATE,
    gender VARCHAR(20) CHECK (gender IN ('Male', 'Female', 'Other')),
    address TEXT,
    is_anonymous BIT DEFAULT 0,
    role VARCHAR(20) CHECK (role IN ('Guest', 'Customer', 'Staff', 'Doctor', 'Manager', 'Admin'))
);

-- 2. Doctors Table
CREATE TABLE Doctors (
    doctor_id INT PRIMARY KEY,
    qualification TEXT,
    specialization VARCHAR(100),
    working_days VARCHAR(100),
    FOREIGN KEY (doctor_id) REFERENCES Users(user_id)
);

-- 3. Appointments Table
CREATE TABLE Appointments (
    appointment_id INT PRIMARY KEY IDENTITY(1,1),
    patient_id INT,
    doctor_id INT,
    appointment_date DATETIME,
    reason TEXT,
    status VARCHAR(20) CHECK (status IN ('Scheduled', 'Completed', 'Cancelled')),
    is_anonymous BIT DEFAULT 0,
    FOREIGN KEY (patient_id) REFERENCES Users(user_id),
    FOREIGN KEY (doctor_id) REFERENCES Doctors(doctor_id)
);


-- 4. Treatment Plans Table
CREATE TABLE TreatmentPlans (
    plan_id INT PRIMARY KEY IDENTITY(1,1),
    doctor_id INT,
    patient_id INT,
    regimen_code VARCHAR(50),
    description TEXT,
    start_date DATE,
    end_date DATE,
    notes TEXT,
    FOREIGN KEY (doctor_id) REFERENCES Doctors(doctor_id),
    FOREIGN KEY (patient_id) REFERENCES Users(user_id)
);

-- 5. Medication Reminders Table
CREATE TABLE MedicationReminders (
    reminder_id INT PRIMARY KEY IDENTITY(1,1),
    patient_id INT,
    plan_id INT,
    medication_time DATETIME,
    reminder_message VARCHAR(255),
    is_sent BIT DEFAULT 0,
    FOREIGN KEY (patient_id) REFERENCES Users(user_id),
    FOREIGN KEY (plan_id) REFERENCES TreatmentPlans(plan_id)
);

-- 6. Medical Tests Table
CREATE TABLE MedicalTests (
    test_id INT PRIMARY KEY IDENTITY(1,1),
    patient_id INT,
    test_type VARCHAR(50), -- e.g., ARV, CD4, Viral Load
    test_date DATE,
    result TEXT,
    notes TEXT,
    FOREIGN KEY (patient_id) REFERENCES Users(user_id)
);

-- 7. Blog Posts Table
CREATE TABLE BlogPosts (
    post_id INT PRIMARY KEY IDENTITY(1,1),
    title VARCHAR(255),
    content TEXT,
    author_id INT,
    post_date DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (author_id) REFERENCES Users(user_id)
);

-- 8. Documents Table
CREATE TABLE Documents (
    doc_id INT PRIMARY KEY IDENTITY(1,1),
    title VARCHAR(255),
    description TEXT,
    author_id INT,
    file_url VARCHAR(255),
    FOREIGN KEY (author_id) REFERENCES Users(user_id)
);

-- 9. Notifications Table
CREATE TABLE Notifications (
    notification_id INT PRIMARY KEY IDENTITY(1,1),
    user_id INT,
    message TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    is_read BIT DEFAULT 0,
    FOREIGN KEY (user_id) REFERENCES Users(user_id)
);

-- 10. Treatment History Table
CREATE TABLE TreatmentHistory (
    history_id INT PRIMARY KEY IDENTITY(1,1),
    patient_id INT,
    plan_id INT,
    visit_date DATE,
    outcome TEXT,
    notes TEXT,
    FOREIGN KEY (patient_id) REFERENCES Users(user_id),
    FOREIGN KEY (plan_id) REFERENCES TreatmentPlans(plan_id)
);

-- 11. Reports Table
CREATE TABLE Reports (
    report_id INT PRIMARY KEY IDENTITY(1,1),
	doctor_id INT,
    report_type VARCHAR(50),
    value VARCHAR(100),
    generated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (doctor_id) REFERENCES Doctors(doctor_id)
);

