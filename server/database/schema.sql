-- Drop Tables

DROP TABLE IF EXISTS fuel_logs CASCADE;
DROP TABLE IF EXISTS maintenance_logs CASCADE;
DROP TABLE IF EXISTS expenses CASCADE;
DROP TABLE IF EXISTS trips CASCADE;
DROP TABLE IF EXISTS drivers CASCADE;
DROP TABLE IF EXISTS vehicles CASCADE;
DROP TABLE IF EXISTS users CASCADE;
DROP TABLE IF EXISTS roles CASCADE;

-- Drop Enums

DROP TYPE IF EXISTS expense_type CASCADE;
DROP TYPE IF EXISTS maintenance_status CASCADE;
DROP TYPE IF EXISTS trip_status CASCADE;
DROP TYPE IF EXISTS driver_status CASCADE;
DROP TYPE IF EXISTS vehicle_status CASCADE;

-- Enums

CREATE TYPE vehicle_status AS ENUM(
    'Available',
    'On Trip',
    'In Shop',
    'Retired'
);

CREATE TYPE driver_status AS ENUM(
    'Available',
    'On Trip',
    'Off Duty',
    'Suspended'
);

CREATE TYPE trip_status AS ENUM(
    'Draft',
    'Dispatched',
    'Completed',
    'Cancelled'
);

CREATE TYPE maintenance_status AS ENUM(
    'Active',
    'Completed'
);

CREATE TYPE expense_type AS ENUM(
    'Toll',
    'Parking',
    'Insurance',
    'Repair',
    'Other'
);

-- Tables

CREATE TABLE roles(
    id SERIAL PRIMARY KEY,
    role_name VARCHAR(100) UNIQUE NOT NULL
);

CREATE TABLE users(
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    role_id INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY(role_id) REFERENCES roles(id)
);

CREATE TABLE vehicles(
    id SERIAL PRIMARY KEY,
    registration_number VARCHAR(20) UNIQUE NOT NULL,
    vehicle_name VARCHAR(100) NOT NULL,
    vehicle_type VARCHAR(100) NOT NULL,
    max_capacity DECIMAL(10,2) NOT NULL CHECK(max_capacity > 0),
    odometer DECIMAL(10,2) DEFAULT 0 CHECK(odometer >= 0),
    acquisition_cost DECIMAL(12,2) NOT NULL CHECK(acquisition_cost >= 0),
    status vehicle_status NOT NULL DEFAULT 'Available',
    region VARCHAR(50) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE drivers(
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    license_number VARCHAR(50) UNIQUE NOT NULL,
    license_category VARCHAR(20) NOT NULL,
    license_expiry DATE NOT NULL,
    contact_number VARCHAR(15) NOT NULL,
    safety_score INT DEFAULT 100 CHECK(safety_score BETWEEN 0 AND 100),
    status driver_status NOT NULL DEFAULT 'Available',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE trips(
    id SERIAL PRIMARY KEY,
    vehicle_id INT NOT NULL,
    driver_id INT NOT NULL,
    source VARCHAR(100) NOT NULL,
    destination VARCHAR(100) NOT NULL,
    cargo_weight DECIMAL(10,2) NOT NULL CHECK(cargo_weight > 0),
    planned_distance DECIMAL(10,2) NOT NULL CHECK(planned_distance > 0),
    revenue DECIMAL(12,2) CHECK(revenue >= 0),
    start_time TIMESTAMP,
    end_time TIMESTAMP,
    status trip_status NOT NULL DEFAULT 'Draft',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY(vehicle_id) REFERENCES vehicles(id),
    FOREIGN KEY(driver_id) REFERENCES drivers(id)
);

CREATE TABLE maintenance_logs(
    id SERIAL PRIMARY KEY,
    vehicle_id INT NOT NULL,
    description TEXT NOT NULL,
    cost DECIMAL(12,2) NOT NULL CHECK(cost >= 0),
    start_date DATE NOT NULL,
    end_date DATE CHECK(end_date >= start_date),
    status maintenance_status NOT NULL DEFAULT 'Active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY(vehicle_id) REFERENCES vehicles(id)
);

CREATE TABLE fuel_logs(
    id SERIAL PRIMARY KEY,
    vehicle_id INT NOT NULL,
    trip_id INT NOT NULL,
    liters DECIMAL(10,2) NOT NULL CHECK(liters > 0),
    cost DECIMAL(12,2) NOT NULL CHECK(cost >= 0),
    log_date DATE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY(vehicle_id) REFERENCES vehicles(id),
    FOREIGN KEY(trip_id) REFERENCES trips(id)
);

CREATE TABLE expenses(
    id SERIAL PRIMARY KEY,
    vehicle_id INT NOT NULL,
    expense_type expense_type NOT NULL,
    amount DECIMAL(12,2) NOT NULL CHECK(amount >= 0),
    description TEXT,
    log_date DATE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY(vehicle_id) REFERENCES vehicles(id)
);