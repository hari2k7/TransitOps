DROP TABLE IF EXISTS fuel_logs CASCADE;
DROP TABLE IF EXISTS maintenance_logs CASCADE;
DROP TABLE IF EXISTS expenses CASCADE;
DROP TABLE IF EXISTS trips CASCADE;
DROP TABLE IF EXISTS drivers CASCADE;
DROP TABLE IF EXISTS vehicles CASCADE;
DROP TABLE IF EXISTS users CASCADE;
DROP TABLE IF EXISTS roles CASCADE;

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

    FOREIGN KEY(role_id)
    REFERENCES roles(id)
);

CREATE TYPE vehicle_status AS ENUM(
    'Available',
    'On trip',
    'In shop',
    'Retired'
);

CREATE TABLE vehicles(
    id SERIAL PRIMARY KEY,
    registration_number VARCHAR(20) UNIQUE NOT NULL,
    vehicle_name VARCHAR(100) NOT NULL,
    vehicle_type VARCHAR(100) NOT NULL,
    max_capacity DECIMAL(10,2) NOT NULL CHECK(max_capacity > 0),
    odometer DECIMAL(10,2) DEFAULT 0 CHECK(odometer > 0),
    acqisition_cost DECIMAL(12,2) NOT NULL CHECK(acqisition_cost >= 0),
    status vehicle_status NOT NULL DEFAULT 'Available',
    region VARCHAR(50)  NOT NULL,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TYPE driver_status AS ENUM(
    'Available',
    'On Trip',
    'Off Duty',
    'Suspended'
);

CREATE TABLE drivers(
    id SERIAL PRIMARY KEY,

    name VARCHAR(100) NOT NULL,

    license_number VARCHAR(50) UNIQUE NOT NULL,

    license_category VARCHAR(20) NOT NULL,

    license_expiry DATE NOT NULL,

    contact_number VARCHAR(15) NOT NULL,

    safety_score INT DEFAULT 100
        CHECK(safety_score BETWEEN 0 AND 100),

    status driver_status NOT NULL
        DEFAULT 'Available',

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
