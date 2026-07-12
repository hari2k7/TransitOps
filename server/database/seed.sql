INSERT INTO roles(role_name)
VALUES
('Fleet Manager'),
('Driver'),
('Safety Officer'),
('Financial Analyst');

INSERT INTO users(name,email,password,role_id)
VALUES
('Admin','admin@transitops.com','temp_password',1);

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
