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
DROP TABLE IF EXISTS test_codes;
DROP TABLE IF EXISTS visits_tests;
DROP TABLE IF EXISTS visits;

CREATE TABLE "users" (
  "id" int PRIMARY KEY,
  "firstname" varchar,
  "lastname" varchar,
  "password" varchar,
  "is_admin" BOOLEAN NOT NULL default FALSE
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

CREATE TABLE "visits" (
  "log_num" varchar PRIMARY KEY,
  "ped_log_num" varchar,
  "patient_mrn" int,
  "physician_id" int,
  "user_id" int,
  "procedure_id" int,
  "location_id" int,
  "visit_date" date
);

CREATE TABLE "physicians" (
  "id" SERIAL PRIMARY KEY,
  "firstname" varchar,
  "lastname" varchar,
  "department_id" int
);

-- CREATE TABLE "visits_tests" (
--   "id" SERIAL PRIMARY KEY,
--   "visit_id" varchar,
--   "test_id" int
-- );


CREATE TABLE "visits_tests" (
  "id" SERIAL PRIMARY KEY,
  "visit_id" varchar,
  "test_id" varchar,
  "quantity" int
);

CREATE TABLE "procedures" (
  "id" SERIAL PRIMARY KEY,
  "procedure_name" varchar
);


CREATE TABLE "tests" (
  "cpt" varchar PRIMARY KEY,
  "description" varchar
);

-- CREATE TABLE "tests" (
--   "id" SERIAL PRIMARY KEY,
--   "cpt_id" varchar,
--   "quantity" int
-- );

-- CREATE TABLE "test_codes" (
--   "cpt" varchar PRIMARY KEY,
--   "description" varchar
-- );

CREATE TABLE "locations" (
  "id" SERIAL PRIMARY KEY,
  "location_name" varchar
);

CREATE TABLE "departments" (
  "id" SERIAL PRIMARY KEY,
  "department_name" varchar
);

ALTER TABLE "visits" ADD FOREIGN KEY ("patient_mrn") REFERENCES "patients" ("mrn") ON DELETE CASCADE;
ALTER TABLE "visits" ADD FOREIGN KEY ("physician_id") REFERENCES "physicians" ("id") ON DELETE CASCADE;
ALTER TABLE "physicians" ADD FOREIGN KEY ("department_id") REFERENCES "departments" ("id") ON DELETE CASCADE;
ALTER TABLE "visits" ADD FOREIGN KEY ("user_id") REFERENCES "users" ("id") ON DELETE CASCADE;
ALTER TABLE "visits" ADD FOREIGN KEY ("location_id") REFERENCES "locations" ("id") ON DELETE CASCADE;
ALTER TABLE "visits_tests" ADD FOREIGN KEY ("visit_id") REFERENCES "visits" ("log_num") ON DELETE CASCADE;
ALTER TABLE "visits" ADD FOREIGN KEY ("procedure_id") REFERENCES "procedures" ("id") ON DELETE CASCADE;
-- ALTER TABLE "tests" ADD FOREIGN KEY ("cpt_id") REFERENCES "test_codes" ("cpt") ON DELETE CASCADE;
-- ALTER TABLE "visits_tests" ADD FOREIGN KEY ("test_id") REFERENCES "tests" ("id") ON DELETE CASCADE;
ALTER TABLE "visits_tests" ADD FOREIGN KEY ("test_id") REFERENCES "tests" ("cpt") ON DELETE CASCADE;;

-- SEED DATA FPR SCHEMA --

-- INSERT INTO users (id, firstname, lastname, password, is_admin)
-- VALUES
-- (1234, 'John', 'Conner', 'password', true),
-- (2345, 'Clark', 'Kent', 'password', false),
-- (3456, 'Harry', 'Potter', 'password', true),
-- (4567, 'Muhammad', 'Ali', 'password', false)
-- RETURNING *;

INSERT INTO departments (department_name)
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

INSERT INTO locations (location_name)
VALUES
('AICU'),
('PICU'),
('NPL'),
('ER'),
('OR'),
('B1'),
('B5')
RETURNING *;

INSERT INTO procedures (procedure_name)
VALUES
('EEG'),
('NCS'),
('EMG'),
('IOM'),
('LTM'),
('VEP'),
('BAEP'),
('SSEP')
RETURNING *;

INSERT INTO tests (cpt, description)
VALUES
(91986, 'Awake & Asleep'),
(98213, 'Long Term Monitoring'),
(23478, 'Upper & Lower SSEP'),
(23876, '3-4 Nerves'),
(13232, '2 Muscle EMG')
RETURNING *;

-- INSERT INTO tests (cpt_id, quantity)
-- VALUES
-- (91986, 1),
-- (98213, 1),
-- (23478, 2),
-- (23876, 3),
-- (13232, 4)
-- RETURNING *;

INSERT INTO visits_tests (visit_id, test_id, quantity)
VALUES
('21-240', 91986, 1),
('21-240', 91213, 3),
('21-240', 91478, 1),
('21-237', 98213, 2),
('21-237', 91478, 2),
('21-237', 23876, 2),
('21-239', 91986, 1),
('21-242', 23876, 3),
('21-242', 13232, 2),
('21-241', 91986, 1),
('21-241', 23478, 2),
('21-235', 91986, 1)
RETURNING *;

-- INSERT INTO tests (cpt_id, quantity)
-- VALUES
-- (91986, 1),
-- (98213, 1),
-- (23478, 2),
-- (23876, 3),
-- (13232, 4)
-- RETURNING *;

-- INSERT INTO visits_tests (visit_id, test_id)
-- VALUES
-- ('21-240', 1),
-- ('21-237', 2),
-- ('21-239', 2),
-- ('21-240', 3),
-- ('21-241', 4),
-- ('21-235', 1)
-- RETURNING *;

 INSERT INTO patients (mrn, firstname, middlename, lastname, gender, dob, age_group, nationality)
 VALUES
 (123456, 'Mary', 'Jane', 'Smith', 'female', '1990-04-23', 'adult', 'non-saudi'),
 (183643, 'Michael', 'John', 'Jackson', 'male', '1967-05-15', 'adult', 'non-saudi'),
 (2348, 'Peter', 'Able', 'Pan', 'male', '2010-08-04', 'pediatric', 'saudi'),
 (92837, 'Samuel', 'Lance', 'Brown', 'male' , '2015-10-30', 'pediatric', 'saudi')
 RETURNING *;

INSERT INTO visits (log_num, ped_log_num, patient_mrn, physician_id, user_id, procedure_id, location_id, visit_date)
VALUES
('21-234', null, 123456, 1, 1111, 1, 1, '2021-01-13'),
('21-235', 'P-21-103', 183643, 5, 3333, 2, 3, '2021-03-14'),
('21-237', 'P-21-104', 183643, 5, 3333, 3, 3, '2021-01-13'),
('21-238', null, 92837, 3, 2222, 4, 1, '2021-01-13'),
('21-239', null, 2348, 3, 4444, 6, 2, '2021-01-13'),
('21-240', null, 2348, 3, 4444, 7, 2, '2021-01-13'),
('21-241', 'P-21-105', 123456, 8, 5555, 4, 5, '2021-01-13')
RETURNING *;
