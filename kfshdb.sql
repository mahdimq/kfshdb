DROP DATABASE IF EXISTS kfsh;
CREATE DATABASE kfsh;

\c kfsh;

DROP TABLE IF EXISTS patients;
DROP TABLE IF EXISTS visits;
DROP TABLE IF EXISTS patients_visits;
DROP TABLE IF EXISTS procedures;
DROP TABLE IF EXISTS users;
DROP TABLE IF EXISTS physicians;
DROP TABLE IF EXISTS departments;
DROP TABLE IF EXISTS locations;

CREATE TABLE "patients" (
  "mrn" int PRIMARY KEY,
  "firstname" varchar,
  "lastname" varchar,
  "dob" date,
  "gender" varchar,
  "age_category" varchar,
  "nationality" varchar
);

CREATE TABLE "visits" (
  "mrn" int PRIMARY KEY,
  "procedure" int,
  "techId" int,
  "physicianId" int,
  "departmentId" int
);

CREATE TABLE "patients_visits" (
  "id" SERIAL PRIMARY KEY,
  "mrn" int,
  "procedureLog" varchar,
  "userId" int,
  "physicianId" int,
  "locationId" int,
  "quantity" int,
  "visitDate" date,
  "status" varchar
);

CREATE TABLE "procedures" (
  "logNum" varchar PRIMARY KEY,
  "pedLogNum" varchar,
  "cpt" varchar,
  "procedureName" varchar,
  "procedureDesc" varchar
);

CREATE TABLE "users" (
  "id" int PRIMARY KEY,
  "password" varchar,
  "firstname" varchar,
  "lastname" varchar
);

CREATE TABLE "physicians" (
  "id" SERIAL PRIMARY KEY,
  "full_name" varchar
);

CREATE TABLE "departments" (
  "id" SERIAL PRIMARY KEY,
  "dept_name" varchar
);

CREATE TABLE "locations" (
  "id" SERIAL PRIMARY KEY,
  "location" varchar
);

ALTER TABLE "visits" ADD FOREIGN KEY ("physicianId") REFERENCES "physicians" ("id");

ALTER TABLE "visits" ADD FOREIGN KEY ("techId") REFERENCES "users" ("id");

ALTER TABLE "visits" ADD FOREIGN KEY ("mrn") REFERENCES "patients" ("mrn");

ALTER TABLE "patients_visits" ADD FOREIGN KEY ("userId") REFERENCES "users" ("id");

ALTER TABLE "patients_visits" ADD FOREIGN KEY ("physicianId") REFERENCES "physicians" ("id");

ALTER TABLE "patients_visits" ADD FOREIGN KEY ("mrn") REFERENCES "patients" ("mrn");

ALTER TABLE "patients_visits" ADD FOREIGN KEY ("locationId") REFERENCES "locations" ("id");

ALTER TABLE "visits" ADD FOREIGN KEY ("departmentId") REFERENCES "departments" ("id");

ALTER TABLE "patients_visits" ADD FOREIGN KEY ("procedureLog") REFERENCES "procedures" ("logNum");

INSERT INTO users (id, password, firstname, lastname) VALUES (1234, 'john', 'John', 'Conner');
INSERT INTO users (id, password, firstname, lastname) VALUES (4567, 'peter', 'Peter', 'Parker');
INSERT INTO users (id, password, firstname, lastname) VALUES (7890, 'clark', 'Clark', 'Kent');

INSERT INTO patients (mrn, firstname, )