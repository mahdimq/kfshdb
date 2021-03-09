--
-- PostgreSQL database dump
--

-- Dumped from database version 12.3
-- Dumped by pg_dump version 12.3

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: departments; Type: TABLE; Schema: public; Owner: muhammad
--

CREATE TABLE public.departments (
    id integer NOT NULL,
    dept_name character varying
);


ALTER TABLE public.departments OWNER TO muhammad;

--
-- Name: departments_id_seq; Type: SEQUENCE; Schema: public; Owner: muhammad
--

CREATE SEQUENCE public.departments_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.departments_id_seq OWNER TO muhammad;

--
-- Name: departments_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: muhammad
--

ALTER SEQUENCE public.departments_id_seq OWNED BY public.departments.id;


--
-- Name: locations; Type: TABLE; Schema: public; Owner: muhammad
--

CREATE TABLE public.locations (
    id integer NOT NULL,
    location character varying
);


ALTER TABLE public.locations OWNER TO muhammad;

--
-- Name: locations_id_seq; Type: SEQUENCE; Schema: public; Owner: muhammad
--

CREATE SEQUENCE public.locations_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.locations_id_seq OWNER TO muhammad;

--
-- Name: locations_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: muhammad
--

ALTER SEQUENCE public.locations_id_seq OWNED BY public.locations.id;


--
-- Name: patients; Type: TABLE; Schema: public; Owner: muhammad
--

CREATE TABLE public.patients (
    mrn integer NOT NULL,
    firstname character varying,
    lastname character varying,
    dob date,
    gender character varying,
    age_category character varying,
    nationality character varying
);


ALTER TABLE public.patients OWNER TO muhammad;

--
-- Name: patients_visits; Type: TABLE; Schema: public; Owner: muhammad
--

CREATE TABLE public.patients_visits (
    id integer NOT NULL,
    mrn integer,
    "procedureLog" character varying,
    "userId" integer,
    "physicianId" integer,
    "locationId" integer,
    quantity integer,
    "visitDate" date,
    status character varying
);


ALTER TABLE public.patients_visits OWNER TO muhammad;

--
-- Name: patients_visits_id_seq; Type: SEQUENCE; Schema: public; Owner: muhammad
--

CREATE SEQUENCE public.patients_visits_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.patients_visits_id_seq OWNER TO muhammad;

--
-- Name: patients_visits_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: muhammad
--

ALTER SEQUENCE public.patients_visits_id_seq OWNED BY public.patients_visits.id;


--
-- Name: physicians; Type: TABLE; Schema: public; Owner: muhammad
--

CREATE TABLE public.physicians (
    id integer NOT NULL,
    full_name character varying
);


ALTER TABLE public.physicians OWNER TO muhammad;

--
-- Name: physicians_id_seq; Type: SEQUENCE; Schema: public; Owner: muhammad
--

CREATE SEQUENCE public.physicians_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.physicians_id_seq OWNER TO muhammad;

--
-- Name: physicians_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: muhammad
--

ALTER SEQUENCE public.physicians_id_seq OWNED BY public.physicians.id;


--
-- Name: procedures; Type: TABLE; Schema: public; Owner: muhammad
--

CREATE TABLE public.procedures (
    "logNum" character varying NOT NULL,
    "pedLogNum" character varying,
    cpt character varying,
    "procedureName" character varying,
    "procedureDesc" character varying
);


ALTER TABLE public.procedures OWNER TO muhammad;

--
-- Name: users; Type: TABLE; Schema: public; Owner: muhammad
--

CREATE TABLE public.users (
    id integer NOT NULL,
    password character varying,
    firstname character varying,
    lastname character varying
);


ALTER TABLE public.users OWNER TO muhammad;

--
-- Name: visits; Type: TABLE; Schema: public; Owner: muhammad
--

CREATE TABLE public.visits (
    mrn integer NOT NULL,
    "procedureLog" integer,
    "techId" integer,
    "physicianId" integer,
    "departmentId" integer
);


ALTER TABLE public.visits OWNER TO muhammad;

--
-- Name: departments id; Type: DEFAULT; Schema: public; Owner: muhammad
--

ALTER TABLE ONLY public.departments ALTER COLUMN id SET DEFAULT nextval('public.departments_id_seq'::regclass);


--
-- Name: locations id; Type: DEFAULT; Schema: public; Owner: muhammad
--

ALTER TABLE ONLY public.locations ALTER COLUMN id SET DEFAULT nextval('public.locations_id_seq'::regclass);


--
-- Name: patients_visits id; Type: DEFAULT; Schema: public; Owner: muhammad
--

ALTER TABLE ONLY public.patients_visits ALTER COLUMN id SET DEFAULT nextval('public.patients_visits_id_seq'::regclass);


--
-- Name: physicians id; Type: DEFAULT; Schema: public; Owner: muhammad
--

ALTER TABLE ONLY public.physicians ALTER COLUMN id SET DEFAULT nextval('public.physicians_id_seq'::regclass);


--
-- Data for Name: departments; Type: TABLE DATA; Schema: public; Owner: muhammad
--

COPY public.departments (id, dept_name) FROM stdin;
1	Neurology
2	Pediatric Neurology
3	Employee Health Clinic
4	Emergency
5	Oncology
\.


--
-- Data for Name: locations; Type: TABLE DATA; Schema: public; Owner: muhammad
--

COPY public.locations (id, location) FROM stdin;
1	A1
2	A2
3	A3
4	EMU
5	B1
6	B5
7	OR
8	AICU
\.


--
-- Data for Name: patients; Type: TABLE DATA; Schema: public; Owner: muhammad
--

COPY public.patients (mrn, firstname, lastname, dob, gender, age_category, nationality) FROM stdin;
667543	Peter	Parker	1990-07-13	male	pediatric	Egyptian
123456	John	Conner	2012-04-23	male	adult	Saudi
\.


--
-- Data for Name: patients_visits; Type: TABLE DATA; Schema: public; Owner: muhammad
--

COPY public.patients_visits (id, mrn, "procedureLog", "userId", "physicianId", "locationId", quantity, "visitDate", status) FROM stdin;
\.


--
-- Data for Name: physicians; Type: TABLE DATA; Schema: public; Owner: muhammad
--

COPY public.physicians (id, full_name) FROM stdin;
1	Adnan Al Sarawi
2	Ali Mir
3	Bachar Harfouch
4	Eman Nassim
5	Reem Al Bunyan
6	Fouad Al Ghamdi
7	Raidah Al Baradie
8	Ziyad Al Thani
9	Roaa Al Khallaf
\.


--
-- Data for Name: procedures; Type: TABLE DATA; Schema: public; Owner: muhammad
--

COPY public.procedures ("logNum", "pedLogNum", cpt, "procedureName", "procedureDesc") FROM stdin;
\.


--
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: muhammad
--

COPY public.users (id, password, firstname, lastname) FROM stdin;
6789	$2b$12$88P8VvGqwV7m9bLBH3RIg.Qo4HWZgPlq0krXKANZC3hl5coIC/3dm	Peter	Parker
1234	$2b$12$IjvjLeT3hnfgIUlasWHSTObOHXC.z5xzewaGwDcT99KLfw3A1YO9G	John	Conner
\.


--
-- Data for Name: visits; Type: TABLE DATA; Schema: public; Owner: muhammad
--

COPY public.visits (mrn, "procedureLog", "techId", "physicianId", "departmentId") FROM stdin;
\.


--
-- Name: departments_id_seq; Type: SEQUENCE SET; Schema: public; Owner: muhammad
--

SELECT pg_catalog.setval('public.departments_id_seq', 5, true);


--
-- Name: locations_id_seq; Type: SEQUENCE SET; Schema: public; Owner: muhammad
--

SELECT pg_catalog.setval('public.locations_id_seq', 8, true);


--
-- Name: patients_visits_id_seq; Type: SEQUENCE SET; Schema: public; Owner: muhammad
--

SELECT pg_catalog.setval('public.patients_visits_id_seq', 1, false);


--
-- Name: physicians_id_seq; Type: SEQUENCE SET; Schema: public; Owner: muhammad
--

SELECT pg_catalog.setval('public.physicians_id_seq', 9, true);


--
-- Name: departments departments_pkey; Type: CONSTRAINT; Schema: public; Owner: muhammad
--

ALTER TABLE ONLY public.departments
    ADD CONSTRAINT departments_pkey PRIMARY KEY (id);


--
-- Name: locations locations_pkey; Type: CONSTRAINT; Schema: public; Owner: muhammad
--

ALTER TABLE ONLY public.locations
    ADD CONSTRAINT locations_pkey PRIMARY KEY (id);


--
-- Name: patients patients_pkey; Type: CONSTRAINT; Schema: public; Owner: muhammad
--

ALTER TABLE ONLY public.patients
    ADD CONSTRAINT patients_pkey PRIMARY KEY (mrn);


--
-- Name: patients_visits patients_visits_pkey; Type: CONSTRAINT; Schema: public; Owner: muhammad
--

ALTER TABLE ONLY public.patients_visits
    ADD CONSTRAINT patients_visits_pkey PRIMARY KEY (id);


--
-- Name: physicians physicians_pkey; Type: CONSTRAINT; Schema: public; Owner: muhammad
--

ALTER TABLE ONLY public.physicians
    ADD CONSTRAINT physicians_pkey PRIMARY KEY (id);


--
-- Name: procedures procedures_pkey; Type: CONSTRAINT; Schema: public; Owner: muhammad
--

ALTER TABLE ONLY public.procedures
    ADD CONSTRAINT procedures_pkey PRIMARY KEY ("logNum");


--
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: muhammad
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- Name: visits visits_pkey; Type: CONSTRAINT; Schema: public; Owner: muhammad
--

ALTER TABLE ONLY public.visits
    ADD CONSTRAINT visits_pkey PRIMARY KEY (mrn);


--
-- Name: patients_visits patients_visits_locationId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: muhammad
--

ALTER TABLE ONLY public.patients_visits
    ADD CONSTRAINT "patients_visits_locationId_fkey" FOREIGN KEY ("locationId") REFERENCES public.locations(id);


--
-- Name: patients_visits patients_visits_mrn_fkey; Type: FK CONSTRAINT; Schema: public; Owner: muhammad
--

ALTER TABLE ONLY public.patients_visits
    ADD CONSTRAINT patients_visits_mrn_fkey FOREIGN KEY (mrn) REFERENCES public.patients(mrn);


--
-- Name: patients_visits patients_visits_physicianId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: muhammad
--

ALTER TABLE ONLY public.patients_visits
    ADD CONSTRAINT "patients_visits_physicianId_fkey" FOREIGN KEY ("physicianId") REFERENCES public.physicians(id);


--
-- Name: patients_visits patients_visits_procedureLog_fkey; Type: FK CONSTRAINT; Schema: public; Owner: muhammad
--

ALTER TABLE ONLY public.patients_visits
    ADD CONSTRAINT "patients_visits_procedureLog_fkey" FOREIGN KEY ("procedureLog") REFERENCES public.procedures("logNum");


--
-- Name: patients_visits patients_visits_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: muhammad
--

ALTER TABLE ONLY public.patients_visits
    ADD CONSTRAINT "patients_visits_userId_fkey" FOREIGN KEY ("userId") REFERENCES public.users(id);


--
-- Name: visits visits_departmentId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: muhammad
--

ALTER TABLE ONLY public.visits
    ADD CONSTRAINT "visits_departmentId_fkey" FOREIGN KEY ("departmentId") REFERENCES public.departments(id);


--
-- Name: visits visits_mrn_fkey; Type: FK CONSTRAINT; Schema: public; Owner: muhammad
--

ALTER TABLE ONLY public.visits
    ADD CONSTRAINT visits_mrn_fkey FOREIGN KEY (mrn) REFERENCES public.patients(mrn);


--
-- Name: visits visits_physicianId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: muhammad
--

ALTER TABLE ONLY public.visits
    ADD CONSTRAINT "visits_physicianId_fkey" FOREIGN KEY ("physicianId") REFERENCES public.physicians(id);


--
-- Name: visits visits_techId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: muhammad
--

ALTER TABLE ONLY public.visits
    ADD CONSTRAINT "visits_techId_fkey" FOREIGN KEY ("techId") REFERENCES public.users(id);


--
-- PostgreSQL database dump complete
--

