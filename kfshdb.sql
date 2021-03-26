DROP DATABASE IF EXISTS kfsh;
CREATE DATABASE kfsh;

\c kfsh;

DROP TABLE IF EXISTS users;
DROP TABLE IF EXISTS physicians;
DROP TABLE IF EXISTS patients;
DROP TABLE IF EXISTS departments;
DROP TABLE IF EXISTS locations;
DROP TABLE IF EXISTS procedures;
DROP TABLE IF EXISTS tests;
DROP TABLE IF EXISTS procedures_tests;
DROP TABLE IF EXISTS visits;

CREATE TABLE "users" (
  "id" int PRIMARY KEY,
  "firstname" varchar,
  "lastname" varchar,
  "password" varchar,
  "is_admin" BOOLEAN NOT NULL default FALSE
);

CREATE TABLE "physicians" (
  "id" SERIAL PRIMARY KEY,
  "firstname" varchar,
  "lastname" varchar,
  "department_id" int
);

CREATE TABLE "patients" (
  "mrn" int PRIMARY KEY,
  "firstname" varchar,
  "middlename" varchar,
  "lastname" varchar,
  "gender" varchar,
  "dob" date,
  "age_group" varchar,
  "nationality" varchar
);

CREATE TABLE "departments" (
  "id" SERIAL PRIMARY KEY,
  "name" varchar
);

CREATE TABLE "locations" (
  "id" SERIAL PRIMARY KEY,
  "name" varchar
);

CREATE TABLE "procedures" (
  "id" SERIAL PRIMARY KEY,
  "log_num" varchar,
  "ped_log_num" varchar,
  "name" varchar,
  "visit_id" int
);

CREATE TABLE "tests" (
  "cpt" varchar PRIMARY KEY,
  "description" varchar
);

CREATE TABLE "procedures_tests" (
  "id" SERIAL PRIMARY KEY,
  "procedure_id" int,
  "test_cpt" varchar,
  "quantity" int
);

CREATE TABLE "visits" (
  "id" SERIAL PRIMARY KEY,
  "patient_mrn" int,
  "physician_id" int,
  "user_id" int,
  "location_id" int,
  "visit_date" date,
  "status" varchar
);


ALTER TABLE "visits" ADD FOREIGN KEY ("user_id") REFERENCES "users" ("id") ON DELETE CASCADE;
ALTER TABLE "visits" ADD FOREIGN KEY ("physician_id") REFERENCES "physicians" ("id") ON DELETE CASCADE;
ALTER TABLE "visits" ADD FOREIGN KEY ("location_id") REFERENCES "locations" ("id") ON DELETE CASCADE;
ALTER TABLE "visits" ADD FOREIGN KEY ("patient_mrn") REFERENCES "patients" ("mrn") ON DELETE CASCADE;
ALTER TABLE "physicians" ADD FOREIGN KEY ("department_id") REFERENCES "departments" ("id") ON DELETE CASCADE;
ALTER TABLE "procedures" ADD FOREIGN KEY ("visit_id") REFERENCES "visits" ("id") ON DELETE CASCADE;
ALTER TABLE "procedures_tests" ADD FOREIGN KEY ("procedure_id") REFERENCES "procedures" ("id") ON DELETE CASCADE;
ALTER TABLE "procedures_tests" ADD FOREIGN KEY ("test_cpt") REFERENCES "tests" ("cpt") ON DELETE CASCADE;

-- SEED DATA FPR SCHEMA --

-- INSERT INTO users (id, firstname, lastname, password, is_admin)
-- VALUES
-- (1234, 'John', 'Conner', 'password', true),
-- (2345, 'Clark', 'Kent', 'password', false),
-- (3456, 'Harry', 'Potter', 'password', true),
-- (4567, 'Muhammad', 'Ali', 'password', false)
-- RETURNING *;

INSERT INTO departments (name)
VALUES
('Adult Neurology'),
('Pediatric Neurology'),
('Neurosurgery'),
('Family Medicine')
RETURNING *;

INSERT INTO physicians (firstname, lastname, department_id)
VALUES
('Ali', 'Mir', 2),
('Raidah', 'AlBaradie', 2),
('Ziyad', 'AlThani', 1),
('Eman', 'Nassim', 1),
('Fouad', 'AlGhamdi', 2),
('Majed', 'AlOtaibi', 1),
('Mahmood', 'Taha', 3),
('Bachar', 'Harfouch', 3),
('Ibrahim', 'Bala', 4),
('Erum', 'Khalid', 4)
RETURNING *;

INSERT INTO locations (name)
VALUES
('AICU'),
('PICU'),
('NPL'),
('ER'),
('OR'),
('B1'),
('B5')
RETURNING *;

INSERT INTO procedures (name)
VALUES
('EEG'),
('NCS'),
('EMG'),
('IOM'),
('LTM'),
('VEP')
RETURNING *;

INSERT INTO tests (cpt, description)
VALUES
(91986, 'Awake & Asleep'),
(98213, 'Long Term Monitoring'),
(23478, 'Upper & Lower SSEP'),
(23876, '3-4 Nerves'),
(13232, '2 Muscle EMG')
RETURNING *;

 INSERT INTO patients (mrn, firstname, middlename, lastname, gender, dob, age_group, nationality)
 VALUES
 (123456, 'Mary', 'Jane', 'Smith', 'female', '1990-04-23', 'adult', 'non-saudi'),
 (183643, 'Michael', 'John', 'Jackson', 'male', '1967-05-15', 'adult', 'non-saudi'),
 (2348, 'Peter', 'Able', 'Pan', 'male', '2010-08-04', 'pediatric', 'saudi'),
 (92837, 'Samuel', 'Lance', 'Brown', 'male' , '2015-10-30', 'pediatric', 'saudi')
 RETURNING *;

INSERT INTO visits (patient_mrn, physician_id, user_id, location_id, visit_date, status)
VALUES
(123456, 1, 1234, 1, '2021-01-13', 'complete'),
(183643, 2, 2345, 4, '2021-03-14', 'rescheduled'),
(183643, 4, 3456, 3, '2021-01-13', 'complete'),
(92837, 3, 1234, 1, '2021-01-13', 'complete'),
(2348, 2, 4567, 2, '2021-01-13', 'complete'),
(2348, 3, 4567, 2, '2021-01-13', 'complete'),
(123456, 1, 1234, 2, '2021-01-13', 'complete')
RETURNING *;
