-- Role names must match the confirmed RBAC matrix exactly (was 'Driver',
-- which isn't a real role in the system and broke trip authorization).
INSERT INTO roles(role_name)
VALUES
('Fleet Manager'),
('Dispatcher'),
('Safety Officer'),
('Financial Analyst');

-- Password below is a bcrypt hash (12 rounds) of 'Admin@123' — was previously
-- stored as the raw string 'temp_password', which bcrypt.compare() would
-- never match against, so this account could never actually log in.
INSERT INTO users(name,email,password,role_id)
VALUES
('Admin','admin@transitops.com','$2b$12$bmwpIpeIc3cm4H.2LrR2Ie1v7WguQmShB/WQUZ8.Q2ZVi2v0A7y4q',1);

INSERT INTO vehicles(
registration_number,
vehicle_name,
vehicle_type,
max_capacity,
odometer,
acquisition_cost,
region
)
VALUES
('TN38AB1234','Mahindra Bolero','SUV',500,25000,900000,'Coimbatore'),
('TN38CD5678','Ashok Leyland Dost','Mini Truck',1200,70000,1450000,'Chennai');

INSERT INTO drivers(
name,
license_number,
license_category,
license_expiry,
contact_number
)
VALUES
('Ram','TN123456789','LMV','2028-12-31','1234567891'),
('Ashwin','TN987654321','HMV','2027-08-15','1234567892');
