--
-- PostgreSQL database dump
--

\restrict lfGsP0aCcabMBhPuJ9gB5t4lU6rV37DiS3qq72vBKiSAdcY2TGp2p62jRrR1rPU

-- Dumped from database version 16.10
-- Dumped by pg_dump version 16.10

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

--
-- Name: action_status; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.action_status AS ENUM (
    'OPEN',
    'IN_PROGRESS',
    'DONE'
);


ALTER TYPE public.action_status OWNER TO postgres;

--
-- Name: assessment_status; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.assessment_status AS ENUM (
    'DRAFT',
    'SUBMITTED',
    'CLOSED'
);


ALTER TYPE public.assessment_status OWNER TO postgres;

--
-- Name: document_category; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.document_category AS ENUM (
    'SAFETY_PROGRAM',
    'TRAINING',
    'COI',
    'OSHA_LOG',
    'INCIDENT_REPORT',
    'OTHER'
);


ALTER TYPE public.document_category OWNER TO postgres;

--
-- Name: user_role; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.user_role AS ENUM (
    'CARRIER',
    'AGENT',
    'INSURED'
);


ALTER TYPE public.user_role OWNER TO postgres;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: action_items; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.action_items (
    id character varying DEFAULT gen_random_uuid() NOT NULL,
    organization_id character varying NOT NULL,
    assessment_id character varying,
    assigned_to_user_id character varying,
    created_by_user_id character varying NOT NULL,
    priority_rank integer DEFAULT 0 NOT NULL,
    title text NOT NULL,
    description text,
    status public.action_status DEFAULT 'OPEN'::public.action_status NOT NULL,
    due_date timestamp without time zone,
    created_at timestamp without time zone DEFAULT now(),
    closed_at timestamp without time zone
);


ALTER TABLE public.action_items OWNER TO postgres;

--
-- Name: assessments; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.assessments (
    id character varying DEFAULT gen_random_uuid() NOT NULL,
    organization_id character varying NOT NULL,
    created_by_user_id character varying NOT NULL,
    status public.assessment_status DEFAULT 'DRAFT'::public.assessment_status NOT NULL,
    created_at timestamp without time zone DEFAULT now(),
    submitted_at timestamp without time zone,
    notes text DEFAULT ''::text
);


ALTER TABLE public.assessments OWNER TO postgres;

--
-- Name: comments; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.comments (
    id character varying DEFAULT gen_random_uuid() NOT NULL,
    organization_id character varying NOT NULL,
    assessment_id character varying,
    action_item_id character varying,
    author_user_id character varying NOT NULL,
    body text NOT NULL,
    created_at timestamp without time zone DEFAULT now()
);


ALTER TABLE public.comments OWNER TO postgres;

--
-- Name: documents; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.documents (
    id character varying DEFAULT gen_random_uuid() NOT NULL,
    organization_id character varying NOT NULL,
    assessment_id character varying,
    uploaded_by_user_id character varying NOT NULL,
    filename text NOT NULL,
    mime_type text,
    storage_path text NOT NULL,
    category public.document_category DEFAULT 'OTHER'::public.document_category NOT NULL,
    created_at timestamp without time zone DEFAULT now(),
    action_item_id character varying
);


ALTER TABLE public.documents OWNER TO postgres;

--
-- Name: memberships; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.memberships (
    id character varying DEFAULT gen_random_uuid() NOT NULL,
    user_id character varying NOT NULL,
    organization_id character varying NOT NULL,
    role_override public.user_role,
    created_at timestamp without time zone DEFAULT now()
);


ALTER TABLE public.memberships OWNER TO postgres;

--
-- Name: organizations; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.organizations (
    id character varying DEFAULT gen_random_uuid() NOT NULL,
    name text NOT NULL,
    industry text,
    created_at timestamp without time zone DEFAULT now(),
    address text,
    primary_contact text,
    email text,
    phone text,
    operation_description text
);


ALTER TABLE public.organizations OWNER TO postgres;

--
-- Name: questions; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.questions (
    id character varying NOT NULL,
    pillar text NOT NULL,
    topic text NOT NULL,
    text text NOT NULL,
    weight numeric(5,4) NOT NULL,
    scale_notes text,
    constraints text,
    sort_order integer DEFAULT 0 NOT NULL
);


ALTER TABLE public.questions OWNER TO postgres;

--
-- Name: responses; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.responses (
    id character varying DEFAULT gen_random_uuid() NOT NULL,
    assessment_id character varying NOT NULL,
    question_id character varying NOT NULL,
    response_value integer NOT NULL,
    response_scored_value integer NOT NULL,
    question_score numeric(10,6) NOT NULL,
    constraint_applied boolean DEFAULT false NOT NULL,
    constraint_cap_value integer,
    pillar text,
    topic text,
    weight numeric(5,4),
    question_text_original text,
    scale_notes_original text,
    constraints_original text
);


ALTER TABLE public.responses OWNER TO postgres;

--
-- Name: score_snapshots; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.score_snapshots (
    id character varying DEFAULT gen_random_uuid() NOT NULL,
    assessment_id character varying NOT NULL,
    completion_pct numeric(5,2),
    overall_score numeric(6,3),
    overall_rating text,
    safety_score numeric(6,3),
    workers_comp_score numeric(6,3),
    fleet_score numeric(6,3),
    guardrail_triggered boolean DEFAULT false,
    subcontractor_weighted_avg numeric(5,3),
    created_at timestamp without time zone DEFAULT now()
);


ALTER TABLE public.score_snapshots OWNER TO postgres;

--
-- Name: sessions; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.sessions (
    sid character varying NOT NULL,
    sess jsonb NOT NULL,
    expire timestamp without time zone NOT NULL
);


ALTER TABLE public.sessions OWNER TO postgres;

--
-- Name: subcontractor_responses; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.subcontractor_responses (
    id character varying DEFAULT gen_random_uuid() NOT NULL,
    assessment_id character varying NOT NULL,
    safety_training_score integer,
    insurance_verification_score integer,
    coverage_contract_score integer,
    weighted_avg numeric(5,3),
    guardrail_triggered boolean DEFAULT false,
    created_at timestamp without time zone DEFAULT now()
);


ALTER TABLE public.subcontractor_responses OWNER TO postgres;

--
-- Name: user_profiles; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.user_profiles (
    id character varying DEFAULT gen_random_uuid() NOT NULL,
    user_id character varying NOT NULL,
    role public.user_role DEFAULT 'INSURED'::public.user_role NOT NULL,
    created_at timestamp without time zone DEFAULT now()
);


ALTER TABLE public.user_profiles OWNER TO postgres;

--
-- Name: users; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.users (
    id character varying DEFAULT gen_random_uuid() NOT NULL,
    email character varying,
    first_name character varying,
    last_name character varying,
    profile_image_url character varying,
    created_at timestamp without time zone DEFAULT now(),
    updated_at timestamp without time zone DEFAULT now()
);


ALTER TABLE public.users OWNER TO postgres;

--
-- Data for Name: action_items; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.action_items (id, organization_id, assessment_id, assigned_to_user_id, created_by_user_id, priority_rank, title, description, status, due_date, created_at, closed_at) FROM stdin;
44e4a747-d349-4f85-befe-74b02efd31a9	781b0dde-f8ee-4082-8c26-ab056c932314	\N	\N	action-dash-test	1	Install safety barriers	Install barriers around all elevated work areas	OPEN	\N	2026-02-24 01:16:21.583045	\N
3263c787-4684-4c64-a7fb-bc585f1d0bf1	781b0dde-f8ee-4082-8c26-ab056c932314	\N	\N	action-dash-test	3	Review fleet maintenance	Check fleet maintenance logs are up to date	DONE	\N	2026-02-24 01:16:21.70249	2026-02-24 01:16:21.72
93490872-8a76-44c6-8475-f87a29bb70bf	781b0dde-f8ee-4082-8c26-ab056c932314	\N	\N	action-dash-test	2	Update training records	Ensure all employee training docs are current	DONE	\N	2026-02-24 01:16:21.682741	2026-02-24 01:16:52.909
69c47482-4a35-409f-9d3e-c85d434ebd16	8309ccd9-7b17-4a8c-b469-55bc60113ae3	\N	\N	demo-dash-user	1	Install fall protection systems	All elevated work areas over 6 feet need guardrails and safety nets	OPEN	2026-03-15 00:00:00	2026-02-24 01:21:37.594035	\N
6c20b597-1a8f-4f36-9dc2-1ab418e481d8	8309ccd9-7b17-4a8c-b469-55bc60113ae3	\N	\N	demo-dash-user	3	Schedule safety training refresher	All field workers need annual safety training renewal	OPEN	2026-04-01 00:00:00	2026-02-24 01:21:37.686783	\N
dee194ad-8756-4298-b01b-4594db397c40	37f295fc-8b98-4f1e-b38f-727bc9dcdfca	\N	\N	demo-dash-user	1	Calibrate safety sensors	All machine safety sensors need annual calibration	OPEN	2026-03-10 00:00:00	2026-02-24 01:21:49.239349	\N
010d5ac6-3ec1-4b94-8741-1266289c7dd2	8bf653a6-1932-4c2c-becf-5de27458397b	\N	\N	demo-dash-user	5	Review accident response protocol	Update emergency response procedures for fleet incidents	OPEN	2026-04-01 00:00:00	2026-02-24 01:21:57.636168	\N
ff9fb781-8137-4160-b931-a2660f4b9863	8309ccd9-7b17-4a8c-b469-55bc60113ae3	\N	\N	demo-dash-user	2	Update OSHA 300 logs	Current year incident logs need to be reviewed and filed	DONE	2026-03-01 00:00:00	2026-02-24 01:21:37.669554	2026-02-24 01:22:20.659
4e095dd1-97bb-4b4f-aa92-5979fbf14ac6	8309ccd9-7b17-4a8c-b469-55bc60113ae3	\N	\N	demo-dash-user	4	Inspect scaffolding equipment	Annual inspection of all scaffolding and temporary structures	IN_PROGRESS	2026-03-20 00:00:00	2026-02-24 01:21:37.700896	\N
9c62000f-3109-4bcb-b9fb-470eb1c96b13	37f295fc-8b98-4f1e-b38f-727bc9dcdfca	\N	\N	demo-dash-user	2	Replace worn PPE inventory	Order replacement safety glasses, gloves, and hard hats	DONE	2026-02-28 00:00:00	2026-02-24 01:21:49.257981	2026-02-24 01:22:20.707
b22134e0-fb8c-47ba-93f6-a9c539884a13	37f295fc-8b98-4f1e-b38f-727bc9dcdfca	\N	\N	demo-dash-user	3	File workers comp claim report	Q4 incident report needs to be submitted to carrier	DONE	2026-03-05 00:00:00	2026-02-24 01:21:49.274939	2026-02-24 01:22:20.723
affd3e47-a5bb-441c-9150-4dd5685ed4c2	8bf653a6-1932-4c2c-becf-5de27458397b	\N	\N	demo-dash-user	2	Update fleet insurance certificates	Renewed COIs need to be distributed to all clients	DONE	2026-02-28 00:00:00	2026-02-24 01:21:57.588194	2026-02-24 01:22:20.753
3378bbc3-a350-47b1-9fe5-3bffe5250713	8bf653a6-1932-4c2c-becf-5de27458397b	\N	\N	demo-dash-user	1	Complete driver MVR checks	Annual motor vehicle record checks for all CDL drivers	IN_PROGRESS	2026-03-01 00:00:00	2026-02-24 01:21:57.512094	\N
ff99286e-f65c-4d47-a35f-5b9903e70ee1	8bf653a6-1932-4c2c-becf-5de27458397b	\N	\N	demo-dash-user	3	Install GPS tracking on new vehicles	3 new trucks need telematics devices installed	IN_PROGRESS	2026-03-15 00:00:00	2026-02-24 01:21:57.604965	\N
ee26b670-0a49-4fb6-bc79-b87863587cc9	8bf653a6-1932-4c2c-becf-5de27458397b	\N	\N	demo-dash-user	4	Conduct DOT pre-trip inspection training	New hires need training on proper pre-trip inspection procedures	DONE	2026-03-20 00:00:00	2026-02-24 01:21:57.620887	2026-02-24 01:25:04.442
aa2f3c44-af8d-44d7-abfc-927cea7c69c7	98e1c794-ef2f-4997-ac15-6083f655d2be	\N	\N	upload-test-user	1	Submit safety inspection photos	Upload photos from latest safety inspection as proof	OPEN	2026-04-01 00:00:00	2026-02-24 02:02:04.125292	\N
\.


--
-- Data for Name: assessments; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.assessments (id, organization_id, created_by_user_id, status, created_at, submitted_at, notes) FROM stdin;
0798612e-fc36-46e0-9d41-701234ae09cb	7b9cb32c-d38c-4081-8849-3f7d5123f7c8	53745371	SUBMITTED	2026-02-11 03:57:11.530114	2026-02-11 03:58:08.115	
3da8a029-8816-4503-8785-496b14dc579c	7b9cb32c-d38c-4081-8849-3f7d5123f7c8	53745371	SUBMITTED	2026-02-11 04:09:49.143747	2026-02-11 04:10:32.051	
c94f087e-462f-4d49-8c64-9b1ac1e82312	547b5a2b-e0df-430f-985b-3821cfd5e84c	53745371	SUBMITTED	2026-02-11 04:51:09.468019	2026-02-11 04:52:06.039	
9f71eba5-7b07-49c3-9d7f-22ea309d39b4	f987ffe1-9295-4f91-a71a-b9d6564dced4	53745371	SUBMITTED	2026-02-11 04:52:49.281783	2026-02-11 04:53:36.876	
51408d21-c2c9-4cc4-bab7-dd71887bb410	a1be1a27-a7ab-4a27-8ee4-830171d666d3	53745371	SUBMITTED	2026-02-11 05:09:39.151131	2026-02-11 05:17:33.538	
2da7046e-91f4-407f-a86d-62d43bf83e2d	d648ea7a-864d-481c-97f9-6767512ebc9c	notes-test-user	DRAFT	2026-02-13 01:17:15.536574	\N	Updated notes - check worker safety program
d0a4f1c9-0753-409c-b6af-e510a255f834	f46e668e-75be-4e6c-8072-ddb1c7320542	qnotes-test-user	DRAFT	2026-02-13 01:27:46.285562	\N	{"SAF-01":"Check safety manual revision dates","SAF-02":"Review training records"}
84d82111-f42b-42f6-bb00-98ea7c8139b6	cef87642-40ca-430f-9a8f-40d5e939a79a	perq-notes-user	DRAFT	2026-02-13 01:47:59.188418	\N	{"SAF-01":"Need to verify safety policy review date","SAF-02":"Check employee onboarding training schedule"}
e65d349a-bbac-4644-b16f-56a31d3f9e07	c9e0c6f2-d4fa-4b70-8dd5-5b8ed96ecab9	fix-notes-user	DRAFT	2026-02-13 01:54:33.293779	\N	{"SAF-01":"now does the note save after the update"}
9db0c48f-8675-4e4d-ad3c-78832d7d6482	f352b87d-6e86-4af0-a820-94f36cc8f2b8	53745371	DRAFT	2026-02-24 01:07:41.89124	\N	{"SAF-01":"will this note be saved "}
7db2b1de-214b-4d37-a47f-f1b3e0bb3fcf	d7aece49-7385-4de6-afe0-96eef25ce961	notes-debug-user	DRAFT	2026-02-24 01:00:07.938113	\N	{"SAF-01":"Verified note saving works correctly","SAF-02":"Second question note test","SAF-03":"Will my note save "}
\.


--
-- Data for Name: comments; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.comments (id, organization_id, assessment_id, action_item_id, author_user_id, body, created_at) FROM stdin;
\.


--
-- Data for Name: documents; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.documents (id, organization_id, assessment_id, uploaded_by_user_id, filename, mime_type, storage_path, category, created_at, action_item_id) FROM stdin;
1614fe02-56bb-43ce-b8ab-9e49cf5b6022	98e1c794-ef2f-4997-ac15-6083f655d2be	\N	upload-test-user	test-proof.txt	text/plain	/home/runner/workspace/uploads/1771898569188-454619246-test-proof.txt	OTHER	2026-02-24 02:02:49.202583	aa2f3c44-af8d-44d7-abfc-927cea7c69c7
\.


--
-- Data for Name: memberships; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.memberships (id, user_id, organization_id, role_override, created_at) FROM stdin;
148673a1-fae7-4a83-94c8-fc8dc6cade77	test-user-h-M5uY	f987ffe1-9295-4f91-a71a-b9d6564dced4	\N	2026-02-03 20:49:49.23445
6b9fe7d8-9ec4-40a3-ac6a-3c3b0d56e479	dashboard-test-bNklry	547b5a2b-e0df-430f-985b-3821cfd5e84c	\N	2026-02-03 21:12:58.115055
198c8c26-fe06-4fdf-be8d-de287d0c2c6a	scroll-test-KCno6S	7b9cb32c-d38c-4081-8849-3f7d5123f7c8	\N	2026-02-11 03:38:56.607346
4783cb51-f3fd-4e7e-9033-007b59b200e9	delete-test-user	a1be1a27-a7ab-4a27-8ee4-830171d666d3	\N	2026-02-11 05:05:56.794183
cbc8efeb-210a-4bb6-854b-ce5b0678a9f3	notes-test-user	d648ea7a-864d-481c-97f9-6767512ebc9c	\N	2026-02-13 01:17:06.800318
6fcee431-58f6-458c-a52e-9c5adbe83619	qnotes-test-user	f46e668e-75be-4e6c-8072-ddb1c7320542	\N	2026-02-13 01:27:39.229675
b0d0feb4-c458-4aff-8f3b-2d48aed74ce3	perq-notes-user	cef87642-40ca-430f-9a8f-40d5e939a79a	\N	2026-02-13 01:47:51.885969
1f3c0fcf-e10f-423e-8c0b-c45604324c18	fix-notes-user	c9e0c6f2-d4fa-4b70-8dd5-5b8ed96ecab9	\N	2026-02-13 01:54:33.274054
57261b56-036e-4e42-a114-3914d32f9e33	org-form-test-user	18c26a51-3747-4444-a6ea-914ce793cf30	\N	2026-02-13 02:36:07.739427
06af25e0-9f44-416d-845b-4b418b2a6644	detail-view-test	f352b87d-6e86-4af0-a820-94f36cc8f2b8	\N	2026-02-13 02:38:47.41855
b9dfe319-b395-4d46-86bb-7842ca0a429e	notes-debug-user	d7aece49-7385-4de6-afe0-96eef25ce961	\N	2026-02-24 00:59:55.486995
2f21af89-4f95-49df-9600-2a0ce7c8c9e7	action-dash-test	781b0dde-f8ee-4082-8c26-ab056c932314	\N	2026-02-24 01:16:09.081746
99806c29-6a8d-4163-8416-d1990edf9d68	demo-dash-user	8309ccd9-7b17-4a8c-b469-55bc60113ae3	\N	2026-02-24 01:21:22.036907
8912c8da-6c87-4a4e-80d9-f85cf1540f90	demo-dash-user	37f295fc-8b98-4f1e-b38f-727bc9dcdfca	\N	2026-02-24 01:21:22.065921
da4e3a16-19ce-4da5-8912-bf370a13ddff	demo-dash-user	8bf653a6-1932-4c2c-becf-5de27458397b	\N	2026-02-24 01:21:22.166958
c258a643-c5e6-49b3-9244-49619207e675	upload-test-user	98e1c794-ef2f-4997-ac15-6083f655d2be	\N	2026-02-24 02:01:52.64512
\.


--
-- Data for Name: organizations; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.organizations (id, name, industry, created_at, address, primary_contact, email, phone, operation_description) FROM stdin;
f987ffe1-9295-4f91-a71a-b9d6564dced4	Test Insurance Corp dB9H	Construction	2026-02-03 20:49:49.23026	\N	\N	\N	\N	\N
547b5a2b-e0df-430f-985b-3821cfd5e84c	Score Test Org Vr-n		2026-02-03 21:12:58.111496	\N	\N	\N	\N	\N
7b9cb32c-d38c-4081-8849-3f7d5123f7c8	Scroll Test Org wD5AQu	Construction	2026-02-11 03:38:56.603911	\N	\N	\N	\N	\N
a1be1a27-a7ab-4a27-8ee4-830171d666d3	Delete Test Org	\N	2026-02-11 05:05:56.772464	\N	\N	\N	\N	\N
d648ea7a-864d-481c-97f9-6767512ebc9c	Notes Test Org	\N	2026-02-13 01:17:06.797165	\N	\N	\N	\N	\N
f46e668e-75be-4e6c-8072-ddb1c7320542	QNotes Test Org	\N	2026-02-13 01:27:39.223948	\N	\N	\N	\N	\N
cef87642-40ca-430f-9a8f-40d5e939a79a	PerQ Notes Org	\N	2026-02-13 01:47:51.883097	\N	\N	\N	\N	\N
c9e0c6f2-d4fa-4b70-8dd5-5b8ed96ecab9	Fix Notes Org	\N	2026-02-13 01:54:33.270207	\N	\N	\N	\N	\N
18c26a51-3747-4444-a6ea-914ce793cf30	Test Construction Co	Construction	2026-02-13 02:36:07.706078	123 Main St, Springfield, IL 62701	John Smith	john@testconstruction.com	(555) 123-4567	
f352b87d-6e86-4af0-a820-94f36cc8f2b8	Acme Industries	Manufacturing	2026-02-13 02:38:47.405299	456 Oak Ave, Suite 200, Chicago, IL 60601	Jane Doe	jane@acmeindustries.com	(312) 555-9876	Full-service manufacturing facility specializing in industrial components
d7aece49-7385-4de6-afe0-96eef25ce961	Notes Debug Org	Construction	2026-02-24 00:59:55.481991	100 Test Ave	Tester	notes@test.com	555-0000	
781b0dde-f8ee-4082-8c26-ab056c932314	ActionDash Test Co	Construction	2026-02-24 01:16:09.008855	500 Action Blvd	Action Manager	action@test.com	555-1111	
8309ccd9-7b17-4a8c-b469-55bc60113ae3	Riverside Construction LLC	Construction	2026-02-24 01:21:21.953772	200 River Rd, Austin TX 78701	Mike Rivera	mike@riversideconstruction.com	(512) 555-2200	Commercial and residential construction
37f295fc-8b98-4f1e-b38f-727bc9dcdfca	Summit Manufacturing Inc	Manufacturing	2026-02-24 01:21:22.062194	88 Industrial Pkwy, Denver CO 80202	Sarah Chen	sarah@summitmfg.com	(720) 555-8800	Steel fabrication and assembly
8bf653a6-1932-4c2c-becf-5de27458397b	Pacific Fleet Services	Transportation	2026-02-24 01:21:22.1648	1500 Harbor Blvd, San Diego CA 92101	Tom Bradley	tom@pacificfleet.com	(619) 555-1500	Regional trucking and logistics
98e1c794-ef2f-4997-ac15-6083f655d2be	Upload Test Corp	Construction	2026-02-24 02:01:52.592321	100 Upload St	Test User	test@uploadcorp.com	(555) 999-1234	\N
\.


--
-- Data for Name: questions; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.questions (id, pillar, topic, text, weight, scale_notes, constraints, sort_order) FROM stdin;
WC-03	WorkersComp	Return-to-Work Execution (Transitional Duty)	How does the organization implement and manage return-to-work or transitional duty to reduce lost time and support recovery?	0.0400	1=No RTW; off work until fully released.\n2=RTW policy exists but avoided; options limited; lost-time common.\n3=Options exist; used reactively; inconsistent by supervisor/location.\n4=Early and consistent RTW; tasks pre-identified; restrictions accommodated.\n5=Embedded RTW; supervisors accountable; outcomes tracked and improved.	Constraint: if transitional duty not identified in advance, cap at 3. If supervisors resist restrictions, cap at 2.	9
SAF-05	Safety	Frontline Hazard Reporting (No Fear + Feedback)	How do frontline employees report hazards and unsafe conditions without fear of reprisal, and how are those reports tracked, addressed, and communicated back?	0.0800	1=Reporting unclear/limited; fear of discipline; little tracking/response.\n2=Mechanism exists but low trust; inconsistent tracking/response; little feedback.\n3=Clear reporting without fear; tracked/addressed; mostly reactive; participation not reinforced.\n4=Actively encouraged; timely response; feedback provided; leadership supports reporting.\n5=Embedded and reinforced; recognition/rewards; trends reviewed; employee input shapes improvements.	Constraint: if reporting leads to blame/discipline, cap at 1. If no feedback loop, cap at 3.	5
WC-01	WorkersComp	Injury Reporting Timeliness & Accountability	How are work-related injuries reported, who is responsible for reporting, and how is timely reporting enforced to preserve medical-only and return-to-work outcomes?	0.0400	1=Expectations unclear; employees self-decide; supervisor role undefined; delays common.\n2=Policy exists but weak communication/enforcement; delays frequent.\n3=Roles defined; most injuries reported timely; monitoring/enforcement inconsistent.\n4=All injuries required; supervisors escalate; timeliness tracked; delays addressed.\n5=Immediate reporting embedded; metrics tracked and improved.	Constraint: delayed reporting that prevents early medical intervention/RTW caps at 2.	7
WC-02	WorkersComp	Medical Direction (Clinics + Nurse Triage + Telemedicine)	How is medical care directed following an injury, including use of nurse triage, telemedicine, and vetted occupational medical providers?	0.0400	1=Uncontrolled entry; no direction/triage; restrictions unmanaged.\n2=Informal/inconsistent direction; triage/telemed optional/rare.\n3=Generally directed to occupational care/triage; limited coordination.\n4=Directed to vetted clinics/triage/telemed as appropriate; coordinated; restrictions managed.\n5=Integrated triage/telemed + vetted clinics; proactive restriction management; multi-state ready.	Constraint: if employees choose initial providers without direction, cap at 2. For remote/multi-state, no triage/telemed caps at 3.	8
WC-04	WorkersComp	Claim Oversight (Ownership to Closure)	Who is responsible for managing workers’ compensation claims from initial report through closure, and how is progress monitored?	0.0300	1=No internal ownership; carrier-only; minimal employee contact.\n2=Informal ownership; inconsistent follow-up/communication.\n3=Defined role exists; periodic oversight; inconsistent escalation.\n4=Clear owner follows claims to closure; regular reviews; barriers addressed.\n5=Proactive owner; early escalation; coordinated with carrier; timely resolution.	Constraint: if no specific internal role follows claims to closure, cap at 2. Renewal-only review caps at 2.	10
SAF-01	Safety	Policy Review & Leadership	Is there a formal safety policy, how often is it reviewed, and how is executive leadership involved in supporting and enforcing safety expectations?	0.0400	1=No formal review; leadership unclear.\n2=Reviewed >24 months ago; limited/unclear leadership.\n3=Reviewed within 12–24 months; some leadership participation.\n4=Reviewed within last 12 months; defined leadership roles involved.\n5=Reviewed within last 12 months; includes executive-level participation.	Constraint: if not reviewed on a defined interval, cap at 3.	1
SAF-06	Safety	Management Review & Action (Decisions + Follow-through)	How does management review safety performance, what decisions are made as a result, and how is follow-through verified?	0.0600	1=Rare/symbolic; reactive; no documented actions/verification.\n2=Periodic but passive; mostly lagging metrics; limited/unresourced actions.\n3=Regular structured reviews include some leading indicators; inconsistent follow-through.\n4=Regular leading+lagging review; owners assigned; resources allocated; completion verified.\n5=Strategic integration; decisions affect staffing/scheduling/capital; leadership accountable; effectiveness verified.	Constraint: if lagging-only review, cap at 2. If actions not resourced, cap at 3.	6
SAF-03	Safety	Incidents & Near-Misses (System Fixes)	How are safety incidents and near-misses investigated, how are deficiencies in safety management systems identified, and how are those deficiencies corrected?	0.0600	1=Reactive; near-misses rarely reported; actions informal; no verification.\n2=Documented but shallow; near-miss inconsistent; actions delayed/closed without verification.\n3=Defined process for incidents+near-misses; owners/due dates; limited effectiveness verification.\n4=Prompt structured investigations; system fixes implemented; follow-up verifies effectiveness.\n5=Root-cause + risk prioritization; leadership reviews trends; effectiveness verified over time.	Constraint: if near-misses not reviewed, cap at 2. If only employee blame, cap at 3.	3
FL-02	Fleet	Driver Qualification + MVR Monitoring (Annual vs Continuous)	How are drivers qualified and authorized, how are motor vehicle records monitored (annually or continuously), and how are changes in driver risk addressed?	0.0800	1=No MVR oversight; no authorization control.\n2=One-time/infrequent; assumes carrier monitors MVRs.\n3=Defined annual/periodic MVR review; response to changes may be slow.\n4=Active monitoring (regular or third-party); triggers actions.\n5=Continuous monitoring with timely intervention; authorization reflects current risk.	Constraint: if assumes carrier monitors MVRs, cap at 2. Hire-only/infrequent caps at 2.	14
WC-05	WorkersComp	Claims Review Intervals (Open Claims + Trends + Action)	At what intervals are workers’ compensation claims reviewed, and how are open claims, trends, and corrective actions tracked?	0.0300	1=No structured review; open claims drift.\n2=Infrequent/renewal-only; little action.\n3=Single cadence (e.g., quarterly); limited tracking of actions.\n4=Multi-interval reviews (e.g., monthly open-claim + quarterly trends); actions assigned/tracked.\n5=Dynamic cadence + triggers; drives closure and prevention; effectiveness monitored.	Constraint: renewal-only caps at 2. If open claims not reviewed regularly to drive closure, cap at 3.	11
FL-08	Fleet	Management Review + Accountability (Fleet)	How does leadership review fleet risk performance, assign accountability, and take action based on fleet risk metrics?	0.0100	1=No management review; accountability unclear.\n2=Infrequent/passive; little action.\n3=Periodic review; limited ownership/follow-through.\n4=Active review; named accountability; decisions change controls.\n5=Embedded executive accountability; resources allocated; outcomes monitored.	Constraint: if no defined cadence, cap at 2. If accountability diffused, cap at 3.	20
FL-03	Fleet	Driver Training (Condition-Based + Verified)	How are drivers trained and coached, how often does training occur, how is it verified, and how is training adapted to the driving conditions and locations drivers encounter?	0.0600	1=Minimal/generic; not adapted to locations/conditions; no verification.\n2=Periodic but non-specific; limited coaching.\n3=Defined hire + periodic; limited adaptation/verification.\n4=Condition-based (e.g., winter/urban); verified via observation/ride-alongs/performance.\n5=Dynamic coaching; adapted to geography/season/routes; driven by trends/telematics.	Constraint: if training not adapted to actual conditions/locations, cap at 2. If not verified, cap at 3.	15
FL-04	Fleet	Journey Management (Routine + High-Frequency Trips)	How are work-related driving journeys—including routine and frequently traveled routes—evaluated for risk, and how are high-risk trips mitigated or avoided?	0.0700	1=No journey evaluation; driver-only judgment.\n2=Selective; routine routes not assessed; responsibility unclear.\n3=Defined but incomplete; routine reassessment inconsistent.\n4=All journeys incl. routine evaluated; periodic reassessment; mitigations applied.\n5=Embedded + dynamic; routine routes reassessed and adjusted; trips avoided/mitigated using data.	Constraint: if routine/frequent routes not periodically reassessed, cap at 2.	16
FL-06	Fleet	Driver Engagement (Reinforcement + Participation)	How are drivers actively engaged in fleet safety, including positive reinforcement, participation initiatives, and safe reporting of concerns?	0.0400	1=No engagement; no reinforcement; reporting minimal.\n2=Passive/occasional engagement; inconsistent reinforcement.\n3=Defined mechanisms but participation inconsistent.\n4=Active reinforcement; constructive use of data; reporting encouraged and responded to.\n5=Embedded and motivating; transparent constructive data use; high participation; no fear reporting.	Constraint: if data used only for discipline/surveillance, cap at 2. No positive reinforcement caps at 3.	18
FL-05	Fleet	Behavior Monitoring + Intervention (Duty to Act)	How is driver behavior monitored, who reviews driving data, and how are coaching or corrective actions taken to address risk?	0.0700	1=No monitoring; learns after incidents.\n2=Data exists but not reviewed/acted; responsibility unclear.\n3=Periodic review; inconsistent coaching/follow-up.\n4=Defined cadence; clear owner; consistent coaching/corrective actions.\n5=Proactive monitoring + triggers; timely coaching; interventions documented.	Constraint: if data collected but not acted upon, cap at 2. Unused data increases legal exposure.	17
FL-07	Fleet	Fleet Incidents + Near-Miss Learning	How are fleet incidents and near-misses reported, investigated, and used to improve training, journey planning, or fleet controls?	0.0200	1=Reactive only; near-misses not reviewed; no systemic change.\n2=Documented but blame-focused; near-miss rare.\n3=Defined but inconsistent corrective actions.\n4=Structured learning applied to training/journeys/controls.\n5=Integrated learning loop; effectiveness reviewed to prevent recurrence.	Constraint: if near-misses not reviewed, cap at 2. Driver-fault-only caps at 3.	19
WC-06	WorkersComp	Employee Trust & Check-In Cadence	Who maintains contact with injured employees, how often do check-ins occur, and how is trust maintained throughout the claim?	0.0200	1=No owner/cadence; reactive contact only.\n2=Informal/irregular check-ins; employees unsure who to contact.\n3=Defined role; periodic check-ins but inconsistent.\n4=Clear owner; defined regular check-ins; employees understand process.\n5=Structured cadence + milestones; proactive, trust-centered engagement.	Constraint: if no specific internal role owns check-ins, cap at 2. If no defined cadence, cap at 3.	12
SAF-02	Safety	Training (Hire + Method + Verification)	At what point do employees receive safety training, how often is it conducted, by what methods, and how is understanding or competency verified?	0.0800	1=Infrequent/ad hoc; employees may work before training; passive; no verification.\n2=Scheduled but employees may work before training; limited verification.\n3=Training at/before time of hire + cadence; mostly classroom/online; limited verification.\n4=Training at/before time of hire + routine cadence; hands-on/field; documented observation/coaching.\n5=Training at/before time of hire + cadence AND triggers; verified via observation/coaching and follow-up.	Constraint: if employees work before training, cap at 2.	2
FL-01	Fleet	Fleet Safety Policy (Review + Executive Support)	Is there a formal fleet safety policy, how often is it reviewed, and how is executive leadership involved in supporting and enforcing fleet safety expectations?	0.0500	1=No formal fleet policy; roles/expectations unclear.\n2=Policy exists but not operationalized; review infrequent; leadership distant.\n3=Policy defined; periodic review; limited leadership involvement.\n4=Reviewed on defined interval; leadership supports and enforces expectations.\n5=Embedded executive ownership; resourced and consistently enforced.	Constraint: if not reviewed on a defined interval OR no visible exec support, cap at 3.	13
SAF-04	Safety	Supervisor Observations & Coaching (System Focus)	How do supervisors conduct safety observations, provide coaching, and address system-level contributors rather than placing blame solely on employees?	0.0800	1=Rare/reactive or punitive; rule-violation focused; no follow-up.\n2=Occasional and documented; mostly behavior-focused; limited escalation/system fixes.\n3=Routine observations; some system issues; follow-up inconsistent.\n4=Routine and system-focused; issues documented/escalated; actions verified.\n5=Embedded practice; trend review; coaching drives system change; effectiveness verified.	Constraint: if observations are primarily punitive/behavior-only, cap at 2.	4
\.


--
-- Data for Name: responses; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.responses (id, assessment_id, question_id, response_value, response_scored_value, question_score, constraint_applied, constraint_cap_value, pillar, topic, weight, question_text_original, scale_notes_original, constraints_original) FROM stdin;
4517f3f0-a55f-4e94-86d1-948a3b09683c	3da8a029-8816-4503-8785-496b14dc579c	SAF-01	5	5	0.200000	f	\N	Safety	Policy Review & Leadership	0.0400	Is there a formal safety policy, how often is it reviewed, and how is executive leadership involved in supporting and enforcing safety expectations?	1=No formal review; leadership unclear.\n2=Reviewed >24 months ago; limited/unclear leadership.\n3=Reviewed within 12–24 months; some leadership participation.\n4=Reviewed within last 12 months; defined leadership roles involved.\n5=Reviewed within last 12 months; includes executive-level participation.	Constraint: if not reviewed on a defined interval, cap at 3.
d64ab9c6-7da8-4d97-ac79-f9449aa6e128	3da8a029-8816-4503-8785-496b14dc579c	SAF-02	5	5	0.400000	f	\N	Safety	Training (Hire + Method + Verification)	0.0800	At what point do employees receive safety training, how often is it conducted, by what methods, and how is understanding or competency verified?	1=Infrequent/ad hoc; employees may work before training; passive; no verification.\n2=Scheduled but employees may work before training; limited verification.\n3=Training at/before time of hire + cadence; mostly classroom/online; limited verification.\n4=Training at/before time of hire + routine cadence; hands-on/field; documented observation/coaching.\n5=Training at/before time of hire + cadence AND triggers; verified via observation/coaching and follow-up.	Constraint: if employees work before training, cap at 2.
97a5ae41-9524-48ea-a568-22cfb8693b7a	3da8a029-8816-4503-8785-496b14dc579c	SAF-03	5	5	0.300000	f	\N	Safety	Incidents & Near-Misses (System Fixes)	0.0600	How are safety incidents and near-misses investigated, how are deficiencies in safety management systems identified, and how are those deficiencies corrected?	1=Reactive; near-misses rarely reported; actions informal; no verification.\n2=Documented but shallow; near-miss inconsistent; actions delayed/closed without verification.\n3=Defined process for incidents+near-misses; owners/due dates; limited effectiveness verification.\n4=Prompt structured investigations; system fixes implemented; follow-up verifies effectiveness.\n5=Root-cause + risk prioritization; leadership reviews trends; effectiveness verified over time.	Constraint: if near-misses not reviewed, cap at 2. If only employee blame, cap at 3.
00367871-151e-49f0-9223-49074a35a85c	3da8a029-8816-4503-8785-496b14dc579c	SAF-04	4	4	0.320000	f	\N	Safety	Supervisor Observations & Coaching (System Focus)	0.0800	How do supervisors conduct safety observations, provide coaching, and address system-level contributors rather than placing blame solely on employees?	1=Rare/reactive or punitive; rule-violation focused; no follow-up.\n2=Occasional and documented; mostly behavior-focused; limited escalation/system fixes.\n3=Routine observations; some system issues; follow-up inconsistent.\n4=Routine and system-focused; issues documented/escalated; actions verified.\n5=Embedded practice; trend review; coaching drives system change; effectiveness verified.	Constraint: if observations are primarily punitive/behavior-only, cap at 2.
6ba0cabc-96d2-4d61-9d66-5e6ee8e570f9	3da8a029-8816-4503-8785-496b14dc579c	SAF-05	4	4	0.320000	f	\N	Safety	Frontline Hazard Reporting (No Fear + Feedback)	0.0800	How do frontline employees report hazards and unsafe conditions without fear of reprisal, and how are those reports tracked, addressed, and communicated back?	1=Reporting unclear/limited; fear of discipline; little tracking/response.\n2=Mechanism exists but low trust; inconsistent tracking/response; little feedback.\n3=Clear reporting without fear; tracked/addressed; mostly reactive; participation not reinforced.\n4=Actively encouraged; timely response; feedback provided; leadership supports reporting.\n5=Embedded and reinforced; recognition/rewards; trends reviewed; employee input shapes improvements.	Constraint: if reporting leads to blame/discipline, cap at 1. If no feedback loop, cap at 3.
a5a0d651-d861-4f25-a6a4-1f09bbf3507c	3da8a029-8816-4503-8785-496b14dc579c	WC-03	5	5	0.200000	f	\N	WorkersComp	Return-to-Work Execution (Transitional Duty)	0.0400	How does the organization implement and manage return-to-work or transitional duty to reduce lost time and support recovery?	1=No RTW; off work until fully released.\n2=RTW policy exists but avoided; options limited; lost-time common.\n3=Options exist; used reactively; inconsistent by supervisor/location.\n4=Early and consistent RTW; tasks pre-identified; restrictions accommodated.\n5=Embedded RTW; supervisors accountable; outcomes tracked and improved.	Constraint: if transitional duty not identified in advance, cap at 3. If supervisors resist restrictions, cap at 2.
690501d1-2cb7-4192-91e1-46c8d066d7df	3da8a029-8816-4503-8785-496b14dc579c	SAF-06	4	4	0.240000	f	\N	Safety	Management Review & Action (Decisions + Follow-through)	0.0600	How does management review safety performance, what decisions are made as a result, and how is follow-through verified?	1=Rare/symbolic; reactive; no documented actions/verification.\n2=Periodic but passive; mostly lagging metrics; limited/unresourced actions.\n3=Regular structured reviews include some leading indicators; inconsistent follow-through.\n4=Regular leading+lagging review; owners assigned; resources allocated; completion verified.\n5=Strategic integration; decisions affect staffing/scheduling/capital; leadership accountable; effectiveness verified.	Constraint: if lagging-only review, cap at 2. If actions not resourced, cap at 3.
5492eaa2-783d-403b-b6fb-c8f193a7881f	3da8a029-8816-4503-8785-496b14dc579c	WC-01	4	4	0.160000	f	\N	WorkersComp	Injury Reporting Timeliness & Accountability	0.0400	How are work-related injuries reported, who is responsible for reporting, and how is timely reporting enforced to preserve medical-only and return-to-work outcomes?	1=Expectations unclear; employees self-decide; supervisor role undefined; delays common.\n2=Policy exists but weak communication/enforcement; delays frequent.\n3=Roles defined; most injuries reported timely; monitoring/enforcement inconsistent.\n4=All injuries required; supervisors escalate; timeliness tracked; delays addressed.\n5=Immediate reporting embedded; metrics tracked and improved.	Constraint: delayed reporting that prevents early medical intervention/RTW caps at 2.
dac95662-77e8-4e79-be1f-2d7156530fe5	3da8a029-8816-4503-8785-496b14dc579c	WC-02	5	5	0.200000	f	\N	WorkersComp	Medical Direction (Clinics + Nurse Triage + Telemedicine)	0.0400	How is medical care directed following an injury, including use of nurse triage, telemedicine, and vetted occupational medical providers?	1=Uncontrolled entry; no direction/triage; restrictions unmanaged.\n2=Informal/inconsistent direction; triage/telemed optional/rare.\n3=Generally directed to occupational care/triage; limited coordination.\n4=Directed to vetted clinics/triage/telemed as appropriate; coordinated; restrictions managed.\n5=Integrated triage/telemed + vetted clinics; proactive restriction management; multi-state ready.	Constraint: if employees choose initial providers without direction, cap at 2. For remote/multi-state, no triage/telemed caps at 3.
a7018346-625b-4c07-bcce-1f9577a05a9c	3da8a029-8816-4503-8785-496b14dc579c	WC-04	5	5	0.150000	f	\N	WorkersComp	Claim Oversight (Ownership to Closure)	0.0300	Who is responsible for managing workers’ compensation claims from initial report through closure, and how is progress monitored?	1=No internal ownership; carrier-only; minimal employee contact.\n2=Informal ownership; inconsistent follow-up/communication.\n3=Defined role exists; periodic oversight; inconsistent escalation.\n4=Clear owner follows claims to closure; regular reviews; barriers addressed.\n5=Proactive owner; early escalation; coordinated with carrier; timely resolution.	Constraint: if no specific internal role follows claims to closure, cap at 2. Renewal-only review caps at 2.
11cf63da-fb3b-41a9-8cd9-5270cfe117b0	3da8a029-8816-4503-8785-496b14dc579c	WC-05	5	5	0.150000	f	\N	WorkersComp	Claims Review Intervals (Open Claims + Trends + Action)	0.0300	At what intervals are workers’ compensation claims reviewed, and how are open claims, trends, and corrective actions tracked?	1=No structured review; open claims drift.\n2=Infrequent/renewal-only; little action.\n3=Single cadence (e.g., quarterly); limited tracking of actions.\n4=Multi-interval reviews (e.g., monthly open-claim + quarterly trends); actions assigned/tracked.\n5=Dynamic cadence + triggers; drives closure and prevention; effectiveness monitored.	Constraint: renewal-only caps at 2. If open claims not reviewed regularly to drive closure, cap at 3.
1ff8aa17-1542-428c-84c7-d1042f2f6251	3da8a029-8816-4503-8785-496b14dc579c	WC-06	5	5	0.100000	f	\N	WorkersComp	Employee Trust & Check-In Cadence	0.0200	Who maintains contact with injured employees, how often do check-ins occur, and how is trust maintained throughout the claim?	1=No owner/cadence; reactive contact only.\n2=Informal/irregular check-ins; employees unsure who to contact.\n3=Defined role; periodic check-ins but inconsistent.\n4=Clear owner; defined regular check-ins; employees understand process.\n5=Structured cadence + milestones; proactive, trust-centered engagement.	Constraint: if no specific internal role owns check-ins, cap at 2. If no defined cadence, cap at 3.
193046f0-c794-4294-945a-a5a0e6e2efda	3da8a029-8816-4503-8785-496b14dc579c	FL-01	5	5	0.250000	f	\N	Fleet	Fleet Safety Policy (Review + Executive Support)	0.0500	Is there a formal fleet safety policy, how often is it reviewed, and how is executive leadership involved in supporting and enforcing fleet safety expectations?	1=No formal fleet policy; roles/expectations unclear.\n2=Policy exists but not operationalized; review infrequent; leadership distant.\n3=Policy defined; periodic review; limited leadership involvement.\n4=Reviewed on defined interval; leadership supports and enforces expectations.\n5=Embedded executive ownership; resourced and consistently enforced.	Constraint: if not reviewed on a defined interval OR no visible exec support, cap at 3.
a6a7fbef-d7f7-4708-8d19-67ee14046f22	3da8a029-8816-4503-8785-496b14dc579c	FL-02	5	5	0.400000	f	\N	Fleet	Driver Qualification + MVR Monitoring (Annual vs Continuous)	0.0800	How are drivers qualified and authorized, how are motor vehicle records monitored (annually or continuously), and how are changes in driver risk addressed?	1=No MVR oversight; no authorization control.\n2=One-time/infrequent; assumes carrier monitors MVRs.\n3=Defined annual/periodic MVR review; response to changes may be slow.\n4=Active monitoring (regular or third-party); triggers actions.\n5=Continuous monitoring with timely intervention; authorization reflects current risk.	Constraint: if assumes carrier monitors MVRs, cap at 2. Hire-only/infrequent caps at 2.
7dade676-0802-4626-a14f-862b94a05f84	3da8a029-8816-4503-8785-496b14dc579c	FL-03	5	5	0.300000	f	\N	Fleet	Driver Training (Condition-Based + Verified)	0.0600	How are drivers trained and coached, how often does training occur, how is it verified, and how is training adapted to the driving conditions and locations drivers encounter?	1=Minimal/generic; not adapted to locations/conditions; no verification.\n2=Periodic but non-specific; limited coaching.\n3=Defined hire + periodic; limited adaptation/verification.\n4=Condition-based (e.g., winter/urban); verified via observation/ride-alongs/performance.\n5=Dynamic coaching; adapted to geography/season/routes; driven by trends/telematics.	Constraint: if training not adapted to actual conditions/locations, cap at 2. If not verified, cap at 3.
7ccd3022-7eae-415a-a5a7-d74a030904ee	3da8a029-8816-4503-8785-496b14dc579c	FL-04	5	5	0.350000	f	\N	Fleet	Journey Management (Routine + High-Frequency Trips)	0.0700	How are work-related driving journeys—including routine and frequently traveled routes—evaluated for risk, and how are high-risk trips mitigated or avoided?	1=No journey evaluation; driver-only judgment.\n2=Selective; routine routes not assessed; responsibility unclear.\n3=Defined but incomplete; routine reassessment inconsistent.\n4=All journeys incl. routine evaluated; periodic reassessment; mitigations applied.\n5=Embedded + dynamic; routine routes reassessed and adjusted; trips avoided/mitigated using data.	Constraint: if routine/frequent routes not periodically reassessed, cap at 2.
b3a36fc7-2444-4f34-b9a8-3c93672589b4	3da8a029-8816-4503-8785-496b14dc579c	FL-05	5	5	0.350000	f	\N	Fleet	Behavior Monitoring + Intervention (Duty to Act)	0.0700	How is driver behavior monitored, who reviews driving data, and how are coaching or corrective actions taken to address risk?	1=No monitoring; learns after incidents.\n2=Data exists but not reviewed/acted; responsibility unclear.\n3=Periodic review; inconsistent coaching/follow-up.\n4=Defined cadence; clear owner; consistent coaching/corrective actions.\n5=Proactive monitoring + triggers; timely coaching; interventions documented.	Constraint: if data collected but not acted upon, cap at 2. Unused data increases legal exposure.
5e369a32-c788-448d-a092-bbb6afb895d8	3da8a029-8816-4503-8785-496b14dc579c	FL-06	5	5	0.200000	f	\N	Fleet	Driver Engagement (Reinforcement + Participation)	0.0400	How are drivers actively engaged in fleet safety, including positive reinforcement, participation initiatives, and safe reporting of concerns?	1=No engagement; no reinforcement; reporting minimal.\n2=Passive/occasional engagement; inconsistent reinforcement.\n3=Defined mechanisms but participation inconsistent.\n4=Active reinforcement; constructive use of data; reporting encouraged and responded to.\n5=Embedded and motivating; transparent constructive data use; high participation; no fear reporting.	Constraint: if data used only for discipline/surveillance, cap at 2. No positive reinforcement caps at 3.
9706032c-518d-4d20-9706-3915b2913067	3da8a029-8816-4503-8785-496b14dc579c	FL-07	5	5	0.100000	f	\N	Fleet	Fleet Incidents + Near-Miss Learning	0.0200	How are fleet incidents and near-misses reported, investigated, and used to improve training, journey planning, or fleet controls?	1=Reactive only; near-misses not reviewed; no systemic change.\n2=Documented but blame-focused; near-miss rare.\n3=Defined but inconsistent corrective actions.\n4=Structured learning applied to training/journeys/controls.\n5=Integrated learning loop; effectiveness reviewed to prevent recurrence.	Constraint: if near-misses not reviewed, cap at 2. Driver-fault-only caps at 3.
99a51d6a-c0fd-46f5-91ca-09ef85a790d0	3da8a029-8816-4503-8785-496b14dc579c	FL-08	4	4	0.040000	f	\N	Fleet	Management Review + Accountability (Fleet)	0.0100	How does leadership review fleet risk performance, assign accountability, and take action based on fleet risk metrics?	1=No management review; accountability unclear.\n2=Infrequent/passive; little action.\n3=Periodic review; limited ownership/follow-through.\n4=Active review; named accountability; decisions change controls.\n5=Embedded executive accountability; resources allocated; outcomes monitored.	Constraint: if no defined cadence, cap at 2. If accountability diffused, cap at 3.
6029d53e-5ff9-4c37-b00d-9bf8fa0c3bdf	0798612e-fc36-46e0-9d41-701234ae09cb	SAF-04	1	1	0.080000	f	\N	Safety	Supervisor Observations & Coaching (System Focus)	0.0800	How do supervisors conduct safety observations, provide coaching, and address system-level contributors rather than placing blame solely on employees?	1=Rare/reactive or punitive; rule-violation focused; no follow-up.\n2=Occasional and documented; mostly behavior-focused; limited escalation/system fixes.\n3=Routine observations; some system issues; follow-up inconsistent.\n4=Routine and system-focused; issues documented/escalated; actions verified.\n5=Embedded practice; trend review; coaching drives system change; effectiveness verified.	Constraint: if observations are primarily punitive/behavior-only, cap at 2.
c61c59ab-42d4-481c-860c-796b0659cb97	0798612e-fc36-46e0-9d41-701234ae09cb	SAF-05	3	3	0.240000	f	\N	Safety	Frontline Hazard Reporting (No Fear + Feedback)	0.0800	How do frontline employees report hazards and unsafe conditions without fear of reprisal, and how are those reports tracked, addressed, and communicated back?	1=Reporting unclear/limited; fear of discipline; little tracking/response.\n2=Mechanism exists but low trust; inconsistent tracking/response; little feedback.\n3=Clear reporting without fear; tracked/addressed; mostly reactive; participation not reinforced.\n4=Actively encouraged; timely response; feedback provided; leadership supports reporting.\n5=Embedded and reinforced; recognition/rewards; trends reviewed; employee input shapes improvements.	Constraint: if reporting leads to blame/discipline, cap at 1. If no feedback loop, cap at 3.
6414e42c-b261-4bee-93e9-15d15e2b4b13	0798612e-fc36-46e0-9d41-701234ae09cb	SAF-06	4	4	0.240000	f	\N	Safety	Management Review & Action (Decisions + Follow-through)	0.0600	How does management review safety performance, what decisions are made as a result, and how is follow-through verified?	1=Rare/symbolic; reactive; no documented actions/verification.\n2=Periodic but passive; mostly lagging metrics; limited/unresourced actions.\n3=Regular structured reviews include some leading indicators; inconsistent follow-through.\n4=Regular leading+lagging review; owners assigned; resources allocated; completion verified.\n5=Strategic integration; decisions affect staffing/scheduling/capital; leadership accountable; effectiveness verified.	Constraint: if lagging-only review, cap at 2. If actions not resourced, cap at 3.
587b9c55-a757-4efb-bf6b-3a46f8359896	0798612e-fc36-46e0-9d41-701234ae09cb	WC-01	2	2	0.080000	f	\N	WorkersComp	Injury Reporting Timeliness & Accountability	0.0400	How are work-related injuries reported, who is responsible for reporting, and how is timely reporting enforced to preserve medical-only and return-to-work outcomes?	1=Expectations unclear; employees self-decide; supervisor role undefined; delays common.\n2=Policy exists but weak communication/enforcement; delays frequent.\n3=Roles defined; most injuries reported timely; monitoring/enforcement inconsistent.\n4=All injuries required; supervisors escalate; timeliness tracked; delays addressed.\n5=Immediate reporting embedded; metrics tracked and improved.	Constraint: delayed reporting that prevents early medical intervention/RTW caps at 2.
58b46803-cc59-408f-bf4b-4213e07cfa26	0798612e-fc36-46e0-9d41-701234ae09cb	WC-02	3	3	0.120000	f	\N	WorkersComp	Medical Direction (Clinics + Nurse Triage + Telemedicine)	0.0400	How is medical care directed following an injury, including use of nurse triage, telemedicine, and vetted occupational medical providers?	1=Uncontrolled entry; no direction/triage; restrictions unmanaged.\n2=Informal/inconsistent direction; triage/telemed optional/rare.\n3=Generally directed to occupational care/triage; limited coordination.\n4=Directed to vetted clinics/triage/telemed as appropriate; coordinated; restrictions managed.\n5=Integrated triage/telemed + vetted clinics; proactive restriction management; multi-state ready.	Constraint: if employees choose initial providers without direction, cap at 2. For remote/multi-state, no triage/telemed caps at 3.
dfa1a9f5-a751-4995-96a1-7edd8dde7af8	0798612e-fc36-46e0-9d41-701234ae09cb	SAF-01	2	2	0.080000	f	\N	Safety	Policy Review & Leadership	0.0400	Is there a formal safety policy, how often is it reviewed, and how is executive leadership involved in supporting and enforcing safety expectations?	1=No formal review; leadership unclear.\n2=Reviewed >24 months ago; limited/unclear leadership.\n3=Reviewed within 12–24 months; some leadership participation.\n4=Reviewed within last 12 months; defined leadership roles involved.\n5=Reviewed within last 12 months; includes executive-level participation.	Constraint: if not reviewed on a defined interval, cap at 3.
bba58be4-1f2a-4273-a240-615fc6b79dc7	0798612e-fc36-46e0-9d41-701234ae09cb	SAF-02	3	3	0.240000	f	\N	Safety	Training (Hire + Method + Verification)	0.0800	At what point do employees receive safety training, how often is it conducted, by what methods, and how is understanding or competency verified?	1=Infrequent/ad hoc; employees may work before training; passive; no verification.\n2=Scheduled but employees may work before training; limited verification.\n3=Training at/before time of hire + cadence; mostly classroom/online; limited verification.\n4=Training at/before time of hire + routine cadence; hands-on/field; documented observation/coaching.\n5=Training at/before time of hire + cadence AND triggers; verified via observation/coaching and follow-up.	Constraint: if employees work before training, cap at 2.
90259620-f4cc-4acf-927e-46c8e740a968	0798612e-fc36-46e0-9d41-701234ae09cb	SAF-03	5	5	0.300000	f	\N	Safety	Incidents & Near-Misses (System Fixes)	0.0600	How are safety incidents and near-misses investigated, how are deficiencies in safety management systems identified, and how are those deficiencies corrected?	1=Reactive; near-misses rarely reported; actions informal; no verification.\n2=Documented but shallow; near-miss inconsistent; actions delayed/closed without verification.\n3=Defined process for incidents+near-misses; owners/due dates; limited effectiveness verification.\n4=Prompt structured investigations; system fixes implemented; follow-up verifies effectiveness.\n5=Root-cause + risk prioritization; leadership reviews trends; effectiveness verified over time.	Constraint: if near-misses not reviewed, cap at 2. If only employee blame, cap at 3.
522aa699-78ea-49d2-bd1d-a4254817c49c	0798612e-fc36-46e0-9d41-701234ae09cb	WC-03	4	4	0.160000	f	\N	WorkersComp	Return-to-Work Execution (Transitional Duty)	0.0400	How does the organization implement and manage return-to-work or transitional duty to reduce lost time and support recovery?	1=No RTW; off work until fully released.\n2=RTW policy exists but avoided; options limited; lost-time common.\n3=Options exist; used reactively; inconsistent by supervisor/location.\n4=Early and consistent RTW; tasks pre-identified; restrictions accommodated.\n5=Embedded RTW; supervisors accountable; outcomes tracked and improved.	Constraint: if transitional duty not identified in advance, cap at 3. If supervisors resist restrictions, cap at 2.
2a229f0d-9107-4632-8201-e44b536445c1	0798612e-fc36-46e0-9d41-701234ae09cb	WC-04	5	5	0.150000	f	\N	WorkersComp	Claim Oversight (Ownership to Closure)	0.0300	Who is responsible for managing workers’ compensation claims from initial report through closure, and how is progress monitored?	1=No internal ownership; carrier-only; minimal employee contact.\n2=Informal ownership; inconsistent follow-up/communication.\n3=Defined role exists; periodic oversight; inconsistent escalation.\n4=Clear owner follows claims to closure; regular reviews; barriers addressed.\n5=Proactive owner; early escalation; coordinated with carrier; timely resolution.	Constraint: if no specific internal role follows claims to closure, cap at 2. Renewal-only review caps at 2.
6cf04529-d604-47b0-a81e-ed08ab6ee122	0798612e-fc36-46e0-9d41-701234ae09cb	WC-05	5	5	0.150000	f	\N	WorkersComp	Claims Review Intervals (Open Claims + Trends + Action)	0.0300	At what intervals are workers’ compensation claims reviewed, and how are open claims, trends, and corrective actions tracked?	1=No structured review; open claims drift.\n2=Infrequent/renewal-only; little action.\n3=Single cadence (e.g., quarterly); limited tracking of actions.\n4=Multi-interval reviews (e.g., monthly open-claim + quarterly trends); actions assigned/tracked.\n5=Dynamic cadence + triggers; drives closure and prevention; effectiveness monitored.	Constraint: renewal-only caps at 2. If open claims not reviewed regularly to drive closure, cap at 3.
07420207-9d6b-4240-b169-802bae2d019c	0798612e-fc36-46e0-9d41-701234ae09cb	WC-06	3	3	0.060000	f	\N	WorkersComp	Employee Trust & Check-In Cadence	0.0200	Who maintains contact with injured employees, how often do check-ins occur, and how is trust maintained throughout the claim?	1=No owner/cadence; reactive contact only.\n2=Informal/irregular check-ins; employees unsure who to contact.\n3=Defined role; periodic check-ins but inconsistent.\n4=Clear owner; defined regular check-ins; employees understand process.\n5=Structured cadence + milestones; proactive, trust-centered engagement.	Constraint: if no specific internal role owns check-ins, cap at 2. If no defined cadence, cap at 3.
9fa02857-79c7-4a12-b59d-8555d5f0ab52	0798612e-fc36-46e0-9d41-701234ae09cb	FL-01	1	1	0.050000	f	\N	Fleet	Fleet Safety Policy (Review + Executive Support)	0.0500	Is there a formal fleet safety policy, how often is it reviewed, and how is executive leadership involved in supporting and enforcing fleet safety expectations?	1=No formal fleet policy; roles/expectations unclear.\n2=Policy exists but not operationalized; review infrequent; leadership distant.\n3=Policy defined; periodic review; limited leadership involvement.\n4=Reviewed on defined interval; leadership supports and enforces expectations.\n5=Embedded executive ownership; resourced and consistently enforced.	Constraint: if not reviewed on a defined interval OR no visible exec support, cap at 3.
0dc0803b-424a-4130-8478-a1c77c24a288	0798612e-fc36-46e0-9d41-701234ae09cb	FL-02	4	4	0.320000	f	\N	Fleet	Driver Qualification + MVR Monitoring (Annual vs Continuous)	0.0800	How are drivers qualified and authorized, how are motor vehicle records monitored (annually or continuously), and how are changes in driver risk addressed?	1=No MVR oversight; no authorization control.\n2=One-time/infrequent; assumes carrier monitors MVRs.\n3=Defined annual/periodic MVR review; response to changes may be slow.\n4=Active monitoring (regular or third-party); triggers actions.\n5=Continuous monitoring with timely intervention; authorization reflects current risk.	Constraint: if assumes carrier monitors MVRs, cap at 2. Hire-only/infrequent caps at 2.
77bd69f5-11be-4417-958e-ee0635cf13ac	0798612e-fc36-46e0-9d41-701234ae09cb	FL-03	4	4	0.240000	f	\N	Fleet	Driver Training (Condition-Based + Verified)	0.0600	How are drivers trained and coached, how often does training occur, how is it verified, and how is training adapted to the driving conditions and locations drivers encounter?	1=Minimal/generic; not adapted to locations/conditions; no verification.\n2=Periodic but non-specific; limited coaching.\n3=Defined hire + periodic; limited adaptation/verification.\n4=Condition-based (e.g., winter/urban); verified via observation/ride-alongs/performance.\n5=Dynamic coaching; adapted to geography/season/routes; driven by trends/telematics.	Constraint: if training not adapted to actual conditions/locations, cap at 2. If not verified, cap at 3.
e079f236-015b-492c-9c3f-1c759114e8ca	0798612e-fc36-46e0-9d41-701234ae09cb	FL-04	3	3	0.210000	f	\N	Fleet	Journey Management (Routine + High-Frequency Trips)	0.0700	How are work-related driving journeys—including routine and frequently traveled routes—evaluated for risk, and how are high-risk trips mitigated or avoided?	1=No journey evaluation; driver-only judgment.\n2=Selective; routine routes not assessed; responsibility unclear.\n3=Defined but incomplete; routine reassessment inconsistent.\n4=All journeys incl. routine evaluated; periodic reassessment; mitigations applied.\n5=Embedded + dynamic; routine routes reassessed and adjusted; trips avoided/mitigated using data.	Constraint: if routine/frequent routes not periodically reassessed, cap at 2.
da38c918-09a0-4cd4-9ba4-aa1425ddad9a	0798612e-fc36-46e0-9d41-701234ae09cb	FL-05	5	5	0.350000	f	\N	Fleet	Behavior Monitoring + Intervention (Duty to Act)	0.0700	How is driver behavior monitored, who reviews driving data, and how are coaching or corrective actions taken to address risk?	1=No monitoring; learns after incidents.\n2=Data exists but not reviewed/acted; responsibility unclear.\n3=Periodic review; inconsistent coaching/follow-up.\n4=Defined cadence; clear owner; consistent coaching/corrective actions.\n5=Proactive monitoring + triggers; timely coaching; interventions documented.	Constraint: if data collected but not acted upon, cap at 2. Unused data increases legal exposure.
8ca935ab-306d-4a4f-9a5b-da5a2672cae6	0798612e-fc36-46e0-9d41-701234ae09cb	FL-06	2	2	0.080000	f	\N	Fleet	Driver Engagement (Reinforcement + Participation)	0.0400	How are drivers actively engaged in fleet safety, including positive reinforcement, participation initiatives, and safe reporting of concerns?	1=No engagement; no reinforcement; reporting minimal.\n2=Passive/occasional engagement; inconsistent reinforcement.\n3=Defined mechanisms but participation inconsistent.\n4=Active reinforcement; constructive use of data; reporting encouraged and responded to.\n5=Embedded and motivating; transparent constructive data use; high participation; no fear reporting.	Constraint: if data used only for discipline/surveillance, cap at 2. No positive reinforcement caps at 3.
c6e038fe-f15b-47ed-8db5-8fded0918ebf	0798612e-fc36-46e0-9d41-701234ae09cb	FL-07	4	4	0.080000	f	\N	Fleet	Fleet Incidents + Near-Miss Learning	0.0200	How are fleet incidents and near-misses reported, investigated, and used to improve training, journey planning, or fleet controls?	1=Reactive only; near-misses not reviewed; no systemic change.\n2=Documented but blame-focused; near-miss rare.\n3=Defined but inconsistent corrective actions.\n4=Structured learning applied to training/journeys/controls.\n5=Integrated learning loop; effectiveness reviewed to prevent recurrence.	Constraint: if near-misses not reviewed, cap at 2. Driver-fault-only caps at 3.
153d29c0-a93f-4f60-a793-0eb09fdd6177	0798612e-fc36-46e0-9d41-701234ae09cb	FL-08	4	4	0.040000	f	\N	Fleet	Management Review + Accountability (Fleet)	0.0100	How does leadership review fleet risk performance, assign accountability, and take action based on fleet risk metrics?	1=No management review; accountability unclear.\n2=Infrequent/passive; little action.\n3=Periodic review; limited ownership/follow-through.\n4=Active review; named accountability; decisions change controls.\n5=Embedded executive accountability; resources allocated; outcomes monitored.	Constraint: if no defined cadence, cap at 2. If accountability diffused, cap at 3.
1a07c495-be7c-4120-a32b-c50893ffe6a2	c94f087e-462f-4d49-8c64-9b1ac1e82312	SAF-01	3	3	0.120000	f	\N	Safety	Policy Review & Leadership	0.0400	Is there a formal safety policy, how often is it reviewed, and how is executive leadership involved in supporting and enforcing safety expectations?	1=No formal review; leadership unclear.\n2=Reviewed >24 months ago; limited/unclear leadership.\n3=Reviewed within 12–24 months; some leadership participation.\n4=Reviewed within last 12 months; defined leadership roles involved.\n5=Reviewed within last 12 months; includes executive-level participation.	Constraint: if not reviewed on a defined interval, cap at 3.
a8978d00-cf0d-423c-bf2d-9b43ed70eb21	c94f087e-462f-4d49-8c64-9b1ac1e82312	SAF-02	3	3	0.240000	f	\N	Safety	Training (Hire + Method + Verification)	0.0800	At what point do employees receive safety training, how often is it conducted, by what methods, and how is understanding or competency verified?	1=Infrequent/ad hoc; employees may work before training; passive; no verification.\n2=Scheduled but employees may work before training; limited verification.\n3=Training at/before time of hire + cadence; mostly classroom/online; limited verification.\n4=Training at/before time of hire + routine cadence; hands-on/field; documented observation/coaching.\n5=Training at/before time of hire + cadence AND triggers; verified via observation/coaching and follow-up.	Constraint: if employees work before training, cap at 2.
d01c9fff-722e-44d2-b3cf-36e5649fe27d	c94f087e-462f-4d49-8c64-9b1ac1e82312	SAF-03	3	3	0.180000	f	\N	Safety	Incidents & Near-Misses (System Fixes)	0.0600	How are safety incidents and near-misses investigated, how are deficiencies in safety management systems identified, and how are those deficiencies corrected?	1=Reactive; near-misses rarely reported; actions informal; no verification.\n2=Documented but shallow; near-miss inconsistent; actions delayed/closed without verification.\n3=Defined process for incidents+near-misses; owners/due dates; limited effectiveness verification.\n4=Prompt structured investigations; system fixes implemented; follow-up verifies effectiveness.\n5=Root-cause + risk prioritization; leadership reviews trends; effectiveness verified over time.	Constraint: if near-misses not reviewed, cap at 2. If only employee blame, cap at 3.
bcc96518-83e8-4aea-b0f0-1837528ce0a2	c94f087e-462f-4d49-8c64-9b1ac1e82312	SAF-04	2	2	0.160000	f	\N	Safety	Supervisor Observations & Coaching (System Focus)	0.0800	How do supervisors conduct safety observations, provide coaching, and address system-level contributors rather than placing blame solely on employees?	1=Rare/reactive or punitive; rule-violation focused; no follow-up.\n2=Occasional and documented; mostly behavior-focused; limited escalation/system fixes.\n3=Routine observations; some system issues; follow-up inconsistent.\n4=Routine and system-focused; issues documented/escalated; actions verified.\n5=Embedded practice; trend review; coaching drives system change; effectiveness verified.	Constraint: if observations are primarily punitive/behavior-only, cap at 2.
9d4d55b5-717c-4458-a29b-86d838a1d122	c94f087e-462f-4d49-8c64-9b1ac1e82312	SAF-05	4	4	0.320000	f	\N	Safety	Frontline Hazard Reporting (No Fear + Feedback)	0.0800	How do frontline employees report hazards and unsafe conditions without fear of reprisal, and how are those reports tracked, addressed, and communicated back?	1=Reporting unclear/limited; fear of discipline; little tracking/response.\n2=Mechanism exists but low trust; inconsistent tracking/response; little feedback.\n3=Clear reporting without fear; tracked/addressed; mostly reactive; participation not reinforced.\n4=Actively encouraged; timely response; feedback provided; leadership supports reporting.\n5=Embedded and reinforced; recognition/rewards; trends reviewed; employee input shapes improvements.	Constraint: if reporting leads to blame/discipline, cap at 1. If no feedback loop, cap at 3.
7ac833c8-39da-48fa-b5ce-c49b3c8c0fc1	c94f087e-462f-4d49-8c64-9b1ac1e82312	SAF-06	3	3	0.180000	f	\N	Safety	Management Review & Action (Decisions + Follow-through)	0.0600	How does management review safety performance, what decisions are made as a result, and how is follow-through verified?	1=Rare/symbolic; reactive; no documented actions/verification.\n2=Periodic but passive; mostly lagging metrics; limited/unresourced actions.\n3=Regular structured reviews include some leading indicators; inconsistent follow-through.\n4=Regular leading+lagging review; owners assigned; resources allocated; completion verified.\n5=Strategic integration; decisions affect staffing/scheduling/capital; leadership accountable; effectiveness verified.	Constraint: if lagging-only review, cap at 2. If actions not resourced, cap at 3.
4acdc5d4-50e9-47c4-a5fd-ad77fc88a8ef	c94f087e-462f-4d49-8c64-9b1ac1e82312	WC-01	3	3	0.120000	f	\N	WorkersComp	Injury Reporting Timeliness & Accountability	0.0400	How are work-related injuries reported, who is responsible for reporting, and how is timely reporting enforced to preserve medical-only and return-to-work outcomes?	1=Expectations unclear; employees self-decide; supervisor role undefined; delays common.\n2=Policy exists but weak communication/enforcement; delays frequent.\n3=Roles defined; most injuries reported timely; monitoring/enforcement inconsistent.\n4=All injuries required; supervisors escalate; timeliness tracked; delays addressed.\n5=Immediate reporting embedded; metrics tracked and improved.	Constraint: delayed reporting that prevents early medical intervention/RTW caps at 2.
374ec9f8-7730-4904-911e-979c5c6f9151	c94f087e-462f-4d49-8c64-9b1ac1e82312	WC-02	4	4	0.160000	f	\N	WorkersComp	Medical Direction (Clinics + Nurse Triage + Telemedicine)	0.0400	How is medical care directed following an injury, including use of nurse triage, telemedicine, and vetted occupational medical providers?	1=Uncontrolled entry; no direction/triage; restrictions unmanaged.\n2=Informal/inconsistent direction; triage/telemed optional/rare.\n3=Generally directed to occupational care/triage; limited coordination.\n4=Directed to vetted clinics/triage/telemed as appropriate; coordinated; restrictions managed.\n5=Integrated triage/telemed + vetted clinics; proactive restriction management; multi-state ready.	Constraint: if employees choose initial providers without direction, cap at 2. For remote/multi-state, no triage/telemed caps at 3.
b9a215c4-3f9d-4662-928c-261702ffd4dc	c94f087e-462f-4d49-8c64-9b1ac1e82312	WC-03	2	2	0.080000	f	\N	WorkersComp	Return-to-Work Execution (Transitional Duty)	0.0400	How does the organization implement and manage return-to-work or transitional duty to reduce lost time and support recovery?	1=No RTW; off work until fully released.\n2=RTW policy exists but avoided; options limited; lost-time common.\n3=Options exist; used reactively; inconsistent by supervisor/location.\n4=Early and consistent RTW; tasks pre-identified; restrictions accommodated.\n5=Embedded RTW; supervisors accountable; outcomes tracked and improved.	Constraint: if transitional duty not identified in advance, cap at 3. If supervisors resist restrictions, cap at 2.
15dccaed-03d4-440e-b28c-b5e906cc8fd8	c94f087e-462f-4d49-8c64-9b1ac1e82312	WC-04	3	3	0.090000	f	\N	WorkersComp	Claim Oversight (Ownership to Closure)	0.0300	Who is responsible for managing workers’ compensation claims from initial report through closure, and how is progress monitored?	1=No internal ownership; carrier-only; minimal employee contact.\n2=Informal ownership; inconsistent follow-up/communication.\n3=Defined role exists; periodic oversight; inconsistent escalation.\n4=Clear owner follows claims to closure; regular reviews; barriers addressed.\n5=Proactive owner; early escalation; coordinated with carrier; timely resolution.	Constraint: if no specific internal role follows claims to closure, cap at 2. Renewal-only review caps at 2.
bc7ddf7f-5cc5-4ebf-849c-7eed3368c0a6	c94f087e-462f-4d49-8c64-9b1ac1e82312	WC-05	3	3	0.090000	f	\N	WorkersComp	Claims Review Intervals (Open Claims + Trends + Action)	0.0300	At what intervals are workers’ compensation claims reviewed, and how are open claims, trends, and corrective actions tracked?	1=No structured review; open claims drift.\n2=Infrequent/renewal-only; little action.\n3=Single cadence (e.g., quarterly); limited tracking of actions.\n4=Multi-interval reviews (e.g., monthly open-claim + quarterly trends); actions assigned/tracked.\n5=Dynamic cadence + triggers; drives closure and prevention; effectiveness monitored.	Constraint: renewal-only caps at 2. If open claims not reviewed regularly to drive closure, cap at 3.
fee237e1-bc90-47f6-8668-83f62e23f052	c94f087e-462f-4d49-8c64-9b1ac1e82312	WC-06	3	3	0.060000	f	\N	WorkersComp	Employee Trust & Check-In Cadence	0.0200	Who maintains contact with injured employees, how often do check-ins occur, and how is trust maintained throughout the claim?	1=No owner/cadence; reactive contact only.\n2=Informal/irregular check-ins; employees unsure who to contact.\n3=Defined role; periodic check-ins but inconsistent.\n4=Clear owner; defined regular check-ins; employees understand process.\n5=Structured cadence + milestones; proactive, trust-centered engagement.	Constraint: if no specific internal role owns check-ins, cap at 2. If no defined cadence, cap at 3.
154d588c-16b1-4451-b503-f72d5c0a3b1a	c94f087e-462f-4d49-8c64-9b1ac1e82312	FL-01	2	2	0.100000	f	\N	Fleet	Fleet Safety Policy (Review + Executive Support)	0.0500	Is there a formal fleet safety policy, how often is it reviewed, and how is executive leadership involved in supporting and enforcing fleet safety expectations?	1=No formal fleet policy; roles/expectations unclear.\n2=Policy exists but not operationalized; review infrequent; leadership distant.\n3=Policy defined; periodic review; limited leadership involvement.\n4=Reviewed on defined interval; leadership supports and enforces expectations.\n5=Embedded executive ownership; resourced and consistently enforced.	Constraint: if not reviewed on a defined interval OR no visible exec support, cap at 3.
8b00fd07-677f-409f-b62f-3b313e713ebd	c94f087e-462f-4d49-8c64-9b1ac1e82312	FL-02	4	4	0.320000	f	\N	Fleet	Driver Qualification + MVR Monitoring (Annual vs Continuous)	0.0800	How are drivers qualified and authorized, how are motor vehicle records monitored (annually or continuously), and how are changes in driver risk addressed?	1=No MVR oversight; no authorization control.\n2=One-time/infrequent; assumes carrier monitors MVRs.\n3=Defined annual/periodic MVR review; response to changes may be slow.\n4=Active monitoring (regular or third-party); triggers actions.\n5=Continuous monitoring with timely intervention; authorization reflects current risk.	Constraint: if assumes carrier monitors MVRs, cap at 2. Hire-only/infrequent caps at 2.
18320edf-5717-4456-aed7-e994ac25f050	c94f087e-462f-4d49-8c64-9b1ac1e82312	FL-03	3	3	0.180000	f	\N	Fleet	Driver Training (Condition-Based + Verified)	0.0600	How are drivers trained and coached, how often does training occur, how is it verified, and how is training adapted to the driving conditions and locations drivers encounter?	1=Minimal/generic; not adapted to locations/conditions; no verification.\n2=Periodic but non-specific; limited coaching.\n3=Defined hire + periodic; limited adaptation/verification.\n4=Condition-based (e.g., winter/urban); verified via observation/ride-alongs/performance.\n5=Dynamic coaching; adapted to geography/season/routes; driven by trends/telematics.	Constraint: if training not adapted to actual conditions/locations, cap at 2. If not verified, cap at 3.
e9e65378-af82-40ad-8438-f5644f8b931a	c94f087e-462f-4d49-8c64-9b1ac1e82312	FL-04	3	3	0.210000	f	\N	Fleet	Journey Management (Routine + High-Frequency Trips)	0.0700	How are work-related driving journeys—including routine and frequently traveled routes—evaluated for risk, and how are high-risk trips mitigated or avoided?	1=No journey evaluation; driver-only judgment.\n2=Selective; routine routes not assessed; responsibility unclear.\n3=Defined but incomplete; routine reassessment inconsistent.\n4=All journeys incl. routine evaluated; periodic reassessment; mitigations applied.\n5=Embedded + dynamic; routine routes reassessed and adjusted; trips avoided/mitigated using data.	Constraint: if routine/frequent routes not periodically reassessed, cap at 2.
89aaf25c-9a5c-4289-ae5b-abe1466a1241	c94f087e-462f-4d49-8c64-9b1ac1e82312	FL-05	3	3	0.210000	f	\N	Fleet	Behavior Monitoring + Intervention (Duty to Act)	0.0700	How is driver behavior monitored, who reviews driving data, and how are coaching or corrective actions taken to address risk?	1=No monitoring; learns after incidents.\n2=Data exists but not reviewed/acted; responsibility unclear.\n3=Periodic review; inconsistent coaching/follow-up.\n4=Defined cadence; clear owner; consistent coaching/corrective actions.\n5=Proactive monitoring + triggers; timely coaching; interventions documented.	Constraint: if data collected but not acted upon, cap at 2. Unused data increases legal exposure.
81a6eb1e-adad-4186-8de1-67fd8f48f0ad	c94f087e-462f-4d49-8c64-9b1ac1e82312	FL-06	2	2	0.080000	f	\N	Fleet	Driver Engagement (Reinforcement + Participation)	0.0400	How are drivers actively engaged in fleet safety, including positive reinforcement, participation initiatives, and safe reporting of concerns?	1=No engagement; no reinforcement; reporting minimal.\n2=Passive/occasional engagement; inconsistent reinforcement.\n3=Defined mechanisms but participation inconsistent.\n4=Active reinforcement; constructive use of data; reporting encouraged and responded to.\n5=Embedded and motivating; transparent constructive data use; high participation; no fear reporting.	Constraint: if data used only for discipline/surveillance, cap at 2. No positive reinforcement caps at 3.
d59d6b66-f368-4d06-8445-e8c0490e7572	c94f087e-462f-4d49-8c64-9b1ac1e82312	FL-07	4	4	0.080000	f	\N	Fleet	Fleet Incidents + Near-Miss Learning	0.0200	How are fleet incidents and near-misses reported, investigated, and used to improve training, journey planning, or fleet controls?	1=Reactive only; near-misses not reviewed; no systemic change.\n2=Documented but blame-focused; near-miss rare.\n3=Defined but inconsistent corrective actions.\n4=Structured learning applied to training/journeys/controls.\n5=Integrated learning loop; effectiveness reviewed to prevent recurrence.	Constraint: if near-misses not reviewed, cap at 2. Driver-fault-only caps at 3.
48588270-1454-4260-9647-9db53067f08c	c94f087e-462f-4d49-8c64-9b1ac1e82312	FL-08	3	3	0.030000	f	\N	Fleet	Management Review + Accountability (Fleet)	0.0100	How does leadership review fleet risk performance, assign accountability, and take action based on fleet risk metrics?	1=No management review; accountability unclear.\n2=Infrequent/passive; little action.\n3=Periodic review; limited ownership/follow-through.\n4=Active review; named accountability; decisions change controls.\n5=Embedded executive accountability; resources allocated; outcomes monitored.	Constraint: if no defined cadence, cap at 2. If accountability diffused, cap at 3.
c14258d8-4636-4863-861f-e65a90996a1a	9f71eba5-7b07-49c3-9d7f-22ea309d39b4	SAF-01	4	4	0.160000	f	\N	Safety	Policy Review & Leadership	0.0400	Is there a formal safety policy, how often is it reviewed, and how is executive leadership involved in supporting and enforcing safety expectations?	1=No formal review; leadership unclear.\n2=Reviewed >24 months ago; limited/unclear leadership.\n3=Reviewed within 12–24 months; some leadership participation.\n4=Reviewed within last 12 months; defined leadership roles involved.\n5=Reviewed within last 12 months; includes executive-level participation.	Constraint: if not reviewed on a defined interval, cap at 3.
4d06e879-c208-4c78-b7e3-6fbf8242bd8d	9f71eba5-7b07-49c3-9d7f-22ea309d39b4	SAF-02	5	5	0.400000	f	\N	Safety	Training (Hire + Method + Verification)	0.0800	At what point do employees receive safety training, how often is it conducted, by what methods, and how is understanding or competency verified?	1=Infrequent/ad hoc; employees may work before training; passive; no verification.\n2=Scheduled but employees may work before training; limited verification.\n3=Training at/before time of hire + cadence; mostly classroom/online; limited verification.\n4=Training at/before time of hire + routine cadence; hands-on/field; documented observation/coaching.\n5=Training at/before time of hire + cadence AND triggers; verified via observation/coaching and follow-up.	Constraint: if employees work before training, cap at 2.
f360a8f2-4e54-4660-9c8d-df97409a7f74	9f71eba5-7b07-49c3-9d7f-22ea309d39b4	SAF-03	5	5	0.300000	f	\N	Safety	Incidents & Near-Misses (System Fixes)	0.0600	How are safety incidents and near-misses investigated, how are deficiencies in safety management systems identified, and how are those deficiencies corrected?	1=Reactive; near-misses rarely reported; actions informal; no verification.\n2=Documented but shallow; near-miss inconsistent; actions delayed/closed without verification.\n3=Defined process for incidents+near-misses; owners/due dates; limited effectiveness verification.\n4=Prompt structured investigations; system fixes implemented; follow-up verifies effectiveness.\n5=Root-cause + risk prioritization; leadership reviews trends; effectiveness verified over time.	Constraint: if near-misses not reviewed, cap at 2. If only employee blame, cap at 3.
d450b1e6-45f0-4492-95ec-fd06c290e44f	9f71eba5-7b07-49c3-9d7f-22ea309d39b4	SAF-04	5	5	0.400000	f	\N	Safety	Supervisor Observations & Coaching (System Focus)	0.0800	How do supervisors conduct safety observations, provide coaching, and address system-level contributors rather than placing blame solely on employees?	1=Rare/reactive or punitive; rule-violation focused; no follow-up.\n2=Occasional and documented; mostly behavior-focused; limited escalation/system fixes.\n3=Routine observations; some system issues; follow-up inconsistent.\n4=Routine and system-focused; issues documented/escalated; actions verified.\n5=Embedded practice; trend review; coaching drives system change; effectiveness verified.	Constraint: if observations are primarily punitive/behavior-only, cap at 2.
883004de-f88f-4677-9d1b-fcfb47465b48	9f71eba5-7b07-49c3-9d7f-22ea309d39b4	SAF-05	5	5	0.400000	f	\N	Safety	Frontline Hazard Reporting (No Fear + Feedback)	0.0800	How do frontline employees report hazards and unsafe conditions without fear of reprisal, and how are those reports tracked, addressed, and communicated back?	1=Reporting unclear/limited; fear of discipline; little tracking/response.\n2=Mechanism exists but low trust; inconsistent tracking/response; little feedback.\n3=Clear reporting without fear; tracked/addressed; mostly reactive; participation not reinforced.\n4=Actively encouraged; timely response; feedback provided; leadership supports reporting.\n5=Embedded and reinforced; recognition/rewards; trends reviewed; employee input shapes improvements.	Constraint: if reporting leads to blame/discipline, cap at 1. If no feedback loop, cap at 3.
ec16eb34-f157-438c-ad1b-afcbbd371dca	9f71eba5-7b07-49c3-9d7f-22ea309d39b4	SAF-06	3	3	0.180000	f	\N	Safety	Management Review & Action (Decisions + Follow-through)	0.0600	How does management review safety performance, what decisions are made as a result, and how is follow-through verified?	1=Rare/symbolic; reactive; no documented actions/verification.\n2=Periodic but passive; mostly lagging metrics; limited/unresourced actions.\n3=Regular structured reviews include some leading indicators; inconsistent follow-through.\n4=Regular leading+lagging review; owners assigned; resources allocated; completion verified.\n5=Strategic integration; decisions affect staffing/scheduling/capital; leadership accountable; effectiveness verified.	Constraint: if lagging-only review, cap at 2. If actions not resourced, cap at 3.
913bbc25-228a-4087-9634-f49b2f4f7b0f	9f71eba5-7b07-49c3-9d7f-22ea309d39b4	WC-01	2	2	0.080000	f	\N	WorkersComp	Injury Reporting Timeliness & Accountability	0.0400	How are work-related injuries reported, who is responsible for reporting, and how is timely reporting enforced to preserve medical-only and return-to-work outcomes?	1=Expectations unclear; employees self-decide; supervisor role undefined; delays common.\n2=Policy exists but weak communication/enforcement; delays frequent.\n3=Roles defined; most injuries reported timely; monitoring/enforcement inconsistent.\n4=All injuries required; supervisors escalate; timeliness tracked; delays addressed.\n5=Immediate reporting embedded; metrics tracked and improved.	Constraint: delayed reporting that prevents early medical intervention/RTW caps at 2.
79dcbdc6-3129-4c8a-8b32-2c111e45e9cc	9f71eba5-7b07-49c3-9d7f-22ea309d39b4	WC-02	5	5	0.200000	f	\N	WorkersComp	Medical Direction (Clinics + Nurse Triage + Telemedicine)	0.0400	How is medical care directed following an injury, including use of nurse triage, telemedicine, and vetted occupational medical providers?	1=Uncontrolled entry; no direction/triage; restrictions unmanaged.\n2=Informal/inconsistent direction; triage/telemed optional/rare.\n3=Generally directed to occupational care/triage; limited coordination.\n4=Directed to vetted clinics/triage/telemed as appropriate; coordinated; restrictions managed.\n5=Integrated triage/telemed + vetted clinics; proactive restriction management; multi-state ready.	Constraint: if employees choose initial providers without direction, cap at 2. For remote/multi-state, no triage/telemed caps at 3.
d155e5d7-719c-44e0-8808-f72943d3f12f	9f71eba5-7b07-49c3-9d7f-22ea309d39b4	WC-03	5	5	0.200000	f	\N	WorkersComp	Return-to-Work Execution (Transitional Duty)	0.0400	How does the organization implement and manage return-to-work or transitional duty to reduce lost time and support recovery?	1=No RTW; off work until fully released.\n2=RTW policy exists but avoided; options limited; lost-time common.\n3=Options exist; used reactively; inconsistent by supervisor/location.\n4=Early and consistent RTW; tasks pre-identified; restrictions accommodated.\n5=Embedded RTW; supervisors accountable; outcomes tracked and improved.	Constraint: if transitional duty not identified in advance, cap at 3. If supervisors resist restrictions, cap at 2.
d71491e3-a67a-4a62-8fbf-4418f0639136	9f71eba5-7b07-49c3-9d7f-22ea309d39b4	WC-04	4	4	0.120000	f	\N	WorkersComp	Claim Oversight (Ownership to Closure)	0.0300	Who is responsible for managing workers’ compensation claims from initial report through closure, and how is progress monitored?	1=No internal ownership; carrier-only; minimal employee contact.\n2=Informal ownership; inconsistent follow-up/communication.\n3=Defined role exists; periodic oversight; inconsistent escalation.\n4=Clear owner follows claims to closure; regular reviews; barriers addressed.\n5=Proactive owner; early escalation; coordinated with carrier; timely resolution.	Constraint: if no specific internal role follows claims to closure, cap at 2. Renewal-only review caps at 2.
a7459e00-fd45-42db-8cfc-fc6554b8e106	9f71eba5-7b07-49c3-9d7f-22ea309d39b4	WC-05	5	5	0.150000	f	\N	WorkersComp	Claims Review Intervals (Open Claims + Trends + Action)	0.0300	At what intervals are workers’ compensation claims reviewed, and how are open claims, trends, and corrective actions tracked?	1=No structured review; open claims drift.\n2=Infrequent/renewal-only; little action.\n3=Single cadence (e.g., quarterly); limited tracking of actions.\n4=Multi-interval reviews (e.g., monthly open-claim + quarterly trends); actions assigned/tracked.\n5=Dynamic cadence + triggers; drives closure and prevention; effectiveness monitored.	Constraint: renewal-only caps at 2. If open claims not reviewed regularly to drive closure, cap at 3.
1ed58b33-a7e1-44b2-ad6b-a91ac68c469a	9f71eba5-7b07-49c3-9d7f-22ea309d39b4	WC-06	3	3	0.060000	f	\N	WorkersComp	Employee Trust & Check-In Cadence	0.0200	Who maintains contact with injured employees, how often do check-ins occur, and how is trust maintained throughout the claim?	1=No owner/cadence; reactive contact only.\n2=Informal/irregular check-ins; employees unsure who to contact.\n3=Defined role; periodic check-ins but inconsistent.\n4=Clear owner; defined regular check-ins; employees understand process.\n5=Structured cadence + milestones; proactive, trust-centered engagement.	Constraint: if no specific internal role owns check-ins, cap at 2. If no defined cadence, cap at 3.
6ad27e1b-d212-4070-914e-44e76a1b0ab4	9f71eba5-7b07-49c3-9d7f-22ea309d39b4	FL-01	3	3	0.150000	f	\N	Fleet	Fleet Safety Policy (Review + Executive Support)	0.0500	Is there a formal fleet safety policy, how often is it reviewed, and how is executive leadership involved in supporting and enforcing fleet safety expectations?	1=No formal fleet policy; roles/expectations unclear.\n2=Policy exists but not operationalized; review infrequent; leadership distant.\n3=Policy defined; periodic review; limited leadership involvement.\n4=Reviewed on defined interval; leadership supports and enforces expectations.\n5=Embedded executive ownership; resourced and consistently enforced.	Constraint: if not reviewed on a defined interval OR no visible exec support, cap at 3.
fef41331-1581-4613-8c0f-523ed2737175	9f71eba5-7b07-49c3-9d7f-22ea309d39b4	FL-02	4	4	0.320000	f	\N	Fleet	Driver Qualification + MVR Monitoring (Annual vs Continuous)	0.0800	How are drivers qualified and authorized, how are motor vehicle records monitored (annually or continuously), and how are changes in driver risk addressed?	1=No MVR oversight; no authorization control.\n2=One-time/infrequent; assumes carrier monitors MVRs.\n3=Defined annual/periodic MVR review; response to changes may be slow.\n4=Active monitoring (regular or third-party); triggers actions.\n5=Continuous monitoring with timely intervention; authorization reflects current risk.	Constraint: if assumes carrier monitors MVRs, cap at 2. Hire-only/infrequent caps at 2.
ed353e42-6961-486b-a139-b6c2c7be97a2	9f71eba5-7b07-49c3-9d7f-22ea309d39b4	FL-03	5	5	0.300000	f	\N	Fleet	Driver Training (Condition-Based + Verified)	0.0600	How are drivers trained and coached, how often does training occur, how is it verified, and how is training adapted to the driving conditions and locations drivers encounter?	1=Minimal/generic; not adapted to locations/conditions; no verification.\n2=Periodic but non-specific; limited coaching.\n3=Defined hire + periodic; limited adaptation/verification.\n4=Condition-based (e.g., winter/urban); verified via observation/ride-alongs/performance.\n5=Dynamic coaching; adapted to geography/season/routes; driven by trends/telematics.	Constraint: if training not adapted to actual conditions/locations, cap at 2. If not verified, cap at 3.
53283c0a-7843-4a04-9552-280467702810	9f71eba5-7b07-49c3-9d7f-22ea309d39b4	FL-04	4	4	0.280000	f	\N	Fleet	Journey Management (Routine + High-Frequency Trips)	0.0700	How are work-related driving journeys—including routine and frequently traveled routes—evaluated for risk, and how are high-risk trips mitigated or avoided?	1=No journey evaluation; driver-only judgment.\n2=Selective; routine routes not assessed; responsibility unclear.\n3=Defined but incomplete; routine reassessment inconsistent.\n4=All journeys incl. routine evaluated; periodic reassessment; mitigations applied.\n5=Embedded + dynamic; routine routes reassessed and adjusted; trips avoided/mitigated using data.	Constraint: if routine/frequent routes not periodically reassessed, cap at 2.
9f35f41c-eb90-4875-916e-7c1629148297	9f71eba5-7b07-49c3-9d7f-22ea309d39b4	FL-05	5	5	0.350000	f	\N	Fleet	Behavior Monitoring + Intervention (Duty to Act)	0.0700	How is driver behavior monitored, who reviews driving data, and how are coaching or corrective actions taken to address risk?	1=No monitoring; learns after incidents.\n2=Data exists but not reviewed/acted; responsibility unclear.\n3=Periodic review; inconsistent coaching/follow-up.\n4=Defined cadence; clear owner; consistent coaching/corrective actions.\n5=Proactive monitoring + triggers; timely coaching; interventions documented.	Constraint: if data collected but not acted upon, cap at 2. Unused data increases legal exposure.
c1af6db4-d332-4ac0-85af-e9f2da2fc94c	9f71eba5-7b07-49c3-9d7f-22ea309d39b4	FL-06	5	5	0.200000	f	\N	Fleet	Driver Engagement (Reinforcement + Participation)	0.0400	How are drivers actively engaged in fleet safety, including positive reinforcement, participation initiatives, and safe reporting of concerns?	1=No engagement; no reinforcement; reporting minimal.\n2=Passive/occasional engagement; inconsistent reinforcement.\n3=Defined mechanisms but participation inconsistent.\n4=Active reinforcement; constructive use of data; reporting encouraged and responded to.\n5=Embedded and motivating; transparent constructive data use; high participation; no fear reporting.	Constraint: if data used only for discipline/surveillance, cap at 2. No positive reinforcement caps at 3.
d85cab2b-0cba-484d-96cc-15a4fbfeb08a	9f71eba5-7b07-49c3-9d7f-22ea309d39b4	FL-07	5	5	0.100000	f	\N	Fleet	Fleet Incidents + Near-Miss Learning	0.0200	How are fleet incidents and near-misses reported, investigated, and used to improve training, journey planning, or fleet controls?	1=Reactive only; near-misses not reviewed; no systemic change.\n2=Documented but blame-focused; near-miss rare.\n3=Defined but inconsistent corrective actions.\n4=Structured learning applied to training/journeys/controls.\n5=Integrated learning loop; effectiveness reviewed to prevent recurrence.	Constraint: if near-misses not reviewed, cap at 2. Driver-fault-only caps at 3.
9f4886b9-08cf-4946-8fec-b736196be712	9f71eba5-7b07-49c3-9d7f-22ea309d39b4	FL-08	5	5	0.050000	f	\N	Fleet	Management Review + Accountability (Fleet)	0.0100	How does leadership review fleet risk performance, assign accountability, and take action based on fleet risk metrics?	1=No management review; accountability unclear.\n2=Infrequent/passive; little action.\n3=Periodic review; limited ownership/follow-through.\n4=Active review; named accountability; decisions change controls.\n5=Embedded executive accountability; resources allocated; outcomes monitored.	Constraint: if no defined cadence, cap at 2. If accountability diffused, cap at 3.
023c9f2d-1dee-4218-b949-4898215b1ee5	51408d21-c2c9-4cc4-bab7-dd71887bb410	SAF-03	1	1	0.060000	f	\N	Safety	Incidents & Near-Misses (System Fixes)	0.0600	How are safety incidents and near-misses investigated, how are deficiencies in safety management systems identified, and how are those deficiencies corrected?	1=Reactive; near-misses rarely reported; actions informal; no verification.\n2=Documented but shallow; near-miss inconsistent; actions delayed/closed without verification.\n3=Defined process for incidents+near-misses; owners/due dates; limited effectiveness verification.\n4=Prompt structured investigations; system fixes implemented; follow-up verifies effectiveness.\n5=Root-cause + risk prioritization; leadership reviews trends; effectiveness verified over time.	Constraint: if near-misses not reviewed, cap at 2. If only employee blame, cap at 3.
a887a499-0f55-4944-8139-40768f6d5829	51408d21-c2c9-4cc4-bab7-dd71887bb410	SAF-04	2	2	0.160000	f	\N	Safety	Supervisor Observations & Coaching (System Focus)	0.0800	How do supervisors conduct safety observations, provide coaching, and address system-level contributors rather than placing blame solely on employees?	1=Rare/reactive or punitive; rule-violation focused; no follow-up.\n2=Occasional and documented; mostly behavior-focused; limited escalation/system fixes.\n3=Routine observations; some system issues; follow-up inconsistent.\n4=Routine and system-focused; issues documented/escalated; actions verified.\n5=Embedded practice; trend review; coaching drives system change; effectiveness verified.	Constraint: if observations are primarily punitive/behavior-only, cap at 2.
35ea1542-ba58-4d5b-9e5e-434f3660c7db	51408d21-c2c9-4cc4-bab7-dd71887bb410	SAF-06	3	3	0.180000	f	\N	Safety	Management Review & Action (Decisions + Follow-through)	0.0600	How does management review safety performance, what decisions are made as a result, and how is follow-through verified?	1=Rare/symbolic; reactive; no documented actions/verification.\n2=Periodic but passive; mostly lagging metrics; limited/unresourced actions.\n3=Regular structured reviews include some leading indicators; inconsistent follow-through.\n4=Regular leading+lagging review; owners assigned; resources allocated; completion verified.\n5=Strategic integration; decisions affect staffing/scheduling/capital; leadership accountable; effectiveness verified.	Constraint: if lagging-only review, cap at 2. If actions not resourced, cap at 3.
9e5d6571-6336-433f-8aba-12bd6b4f51ef	51408d21-c2c9-4cc4-bab7-dd71887bb410	WC-01	2	2	0.080000	f	\N	WorkersComp	Injury Reporting Timeliness & Accountability	0.0400	How are work-related injuries reported, who is responsible for reporting, and how is timely reporting enforced to preserve medical-only and return-to-work outcomes?	1=Expectations unclear; employees self-decide; supervisor role undefined; delays common.\n2=Policy exists but weak communication/enforcement; delays frequent.\n3=Roles defined; most injuries reported timely; monitoring/enforcement inconsistent.\n4=All injuries required; supervisors escalate; timeliness tracked; delays addressed.\n5=Immediate reporting embedded; metrics tracked and improved.	Constraint: delayed reporting that prevents early medical intervention/RTW caps at 2.
a4f02af9-95a8-4079-9552-aa64400b144a	51408d21-c2c9-4cc4-bab7-dd71887bb410	WC-03	1	1	0.040000	f	\N	WorkersComp	Return-to-Work Execution (Transitional Duty)	0.0400	How does the organization implement and manage return-to-work or transitional duty to reduce lost time and support recovery?	1=No RTW; off work until fully released.\n2=RTW policy exists but avoided; options limited; lost-time common.\n3=Options exist; used reactively; inconsistent by supervisor/location.\n4=Early and consistent RTW; tasks pre-identified; restrictions accommodated.\n5=Embedded RTW; supervisors accountable; outcomes tracked and improved.	Constraint: if transitional duty not identified in advance, cap at 3. If supervisors resist restrictions, cap at 2.
c825f7d5-28c5-496c-ab05-fc22577e0c94	51408d21-c2c9-4cc4-bab7-dd71887bb410	WC-04	1	1	0.030000	f	\N	WorkersComp	Claim Oversight (Ownership to Closure)	0.0300	Who is responsible for managing workers’ compensation claims from initial report through closure, and how is progress monitored?	1=No internal ownership; carrier-only; minimal employee contact.\n2=Informal ownership; inconsistent follow-up/communication.\n3=Defined role exists; periodic oversight; inconsistent escalation.\n4=Clear owner follows claims to closure; regular reviews; barriers addressed.\n5=Proactive owner; early escalation; coordinated with carrier; timely resolution.	Constraint: if no specific internal role follows claims to closure, cap at 2. Renewal-only review caps at 2.
e1dfe194-eeff-4fc6-b353-906d4dea3194	51408d21-c2c9-4cc4-bab7-dd71887bb410	WC-05	2	2	0.060000	f	\N	WorkersComp	Claims Review Intervals (Open Claims + Trends + Action)	0.0300	At what intervals are workers’ compensation claims reviewed, and how are open claims, trends, and corrective actions tracked?	1=No structured review; open claims drift.\n2=Infrequent/renewal-only; little action.\n3=Single cadence (e.g., quarterly); limited tracking of actions.\n4=Multi-interval reviews (e.g., monthly open-claim + quarterly trends); actions assigned/tracked.\n5=Dynamic cadence + triggers; drives closure and prevention; effectiveness monitored.	Constraint: renewal-only caps at 2. If open claims not reviewed regularly to drive closure, cap at 3.
9076d0ce-7a84-48de-877a-4d6651e363f4	51408d21-c2c9-4cc4-bab7-dd71887bb410	WC-06	2	2	0.040000	f	\N	WorkersComp	Employee Trust & Check-In Cadence	0.0200	Who maintains contact with injured employees, how often do check-ins occur, and how is trust maintained throughout the claim?	1=No owner/cadence; reactive contact only.\n2=Informal/irregular check-ins; employees unsure who to contact.\n3=Defined role; periodic check-ins but inconsistent.\n4=Clear owner; defined regular check-ins; employees understand process.\n5=Structured cadence + milestones; proactive, trust-centered engagement.	Constraint: if no specific internal role owns check-ins, cap at 2. If no defined cadence, cap at 3.
3ac11ed5-b994-4ec0-a157-578647855612	51408d21-c2c9-4cc4-bab7-dd71887bb410	FL-01	1	1	0.050000	f	\N	Fleet	Fleet Safety Policy (Review + Executive Support)	0.0500	Is there a formal fleet safety policy, how often is it reviewed, and how is executive leadership involved in supporting and enforcing fleet safety expectations?	1=No formal fleet policy; roles/expectations unclear.\n2=Policy exists but not operationalized; review infrequent; leadership distant.\n3=Policy defined; periodic review; limited leadership involvement.\n4=Reviewed on defined interval; leadership supports and enforces expectations.\n5=Embedded executive ownership; resourced and consistently enforced.	Constraint: if not reviewed on a defined interval OR no visible exec support, cap at 3.
0dae3b54-9b6a-4e59-96eb-afbd7e27e41d	51408d21-c2c9-4cc4-bab7-dd71887bb410	FL-02	2	2	0.160000	f	\N	Fleet	Driver Qualification + MVR Monitoring (Annual vs Continuous)	0.0800	How are drivers qualified and authorized, how are motor vehicle records monitored (annually or continuously), and how are changes in driver risk addressed?	1=No MVR oversight; no authorization control.\n2=One-time/infrequent; assumes carrier monitors MVRs.\n3=Defined annual/periodic MVR review; response to changes may be slow.\n4=Active monitoring (regular or third-party); triggers actions.\n5=Continuous monitoring with timely intervention; authorization reflects current risk.	Constraint: if assumes carrier monitors MVRs, cap at 2. Hire-only/infrequent caps at 2.
64a32925-1bee-45c3-b90b-1022c003fc5a	51408d21-c2c9-4cc4-bab7-dd71887bb410	FL-03	2	2	0.120000	f	\N	Fleet	Driver Training (Condition-Based + Verified)	0.0600	How are drivers trained and coached, how often does training occur, how is it verified, and how is training adapted to the driving conditions and locations drivers encounter?	1=Minimal/generic; not adapted to locations/conditions; no verification.\n2=Periodic but non-specific; limited coaching.\n3=Defined hire + periodic; limited adaptation/verification.\n4=Condition-based (e.g., winter/urban); verified via observation/ride-alongs/performance.\n5=Dynamic coaching; adapted to geography/season/routes; driven by trends/telematics.	Constraint: if training not adapted to actual conditions/locations, cap at 2. If not verified, cap at 3.
bf10c835-0da4-4350-bb96-33391613e9de	51408d21-c2c9-4cc4-bab7-dd71887bb410	FL-04	1	1	0.070000	f	\N	Fleet	Journey Management (Routine + High-Frequency Trips)	0.0700	How are work-related driving journeys—including routine and frequently traveled routes—evaluated for risk, and how are high-risk trips mitigated or avoided?	1=No journey evaluation; driver-only judgment.\n2=Selective; routine routes not assessed; responsibility unclear.\n3=Defined but incomplete; routine reassessment inconsistent.\n4=All journeys incl. routine evaluated; periodic reassessment; mitigations applied.\n5=Embedded + dynamic; routine routes reassessed and adjusted; trips avoided/mitigated using data.	Constraint: if routine/frequent routes not periodically reassessed, cap at 2.
4675abc9-e87c-4ee3-90c2-b117680d3fd6	51408d21-c2c9-4cc4-bab7-dd71887bb410	FL-05	1	1	0.070000	f	\N	Fleet	Behavior Monitoring + Intervention (Duty to Act)	0.0700	How is driver behavior monitored, who reviews driving data, and how are coaching or corrective actions taken to address risk?	1=No monitoring; learns after incidents.\n2=Data exists but not reviewed/acted; responsibility unclear.\n3=Periodic review; inconsistent coaching/follow-up.\n4=Defined cadence; clear owner; consistent coaching/corrective actions.\n5=Proactive monitoring + triggers; timely coaching; interventions documented.	Constraint: if data collected but not acted upon, cap at 2. Unused data increases legal exposure.
e302f8f9-fe95-44ae-b648-94af62b9b6bc	51408d21-c2c9-4cc4-bab7-dd71887bb410	SAF-01	1	1	0.040000	f	\N	Safety	Policy Review & Leadership	0.0400	Is there a formal safety policy, how often is it reviewed, and how is executive leadership involved in supporting and enforcing safety expectations?	1=No formal review; leadership unclear.\n2=Reviewed >24 months ago; limited/unclear leadership.\n3=Reviewed within 12–24 months; some leadership participation.\n4=Reviewed within last 12 months; defined leadership roles involved.\n5=Reviewed within last 12 months; includes executive-level participation.	Constraint: if not reviewed on a defined interval, cap at 3.
51fa646e-3a55-4be0-91fc-aa8bdab44857	51408d21-c2c9-4cc4-bab7-dd71887bb410	SAF-02	1	1	0.080000	f	\N	Safety	Training (Hire + Method + Verification)	0.0800	At what point do employees receive safety training, how often is it conducted, by what methods, and how is understanding or competency verified?	1=Infrequent/ad hoc; employees may work before training; passive; no verification.\n2=Scheduled but employees may work before training; limited verification.\n3=Training at/before time of hire + cadence; mostly classroom/online; limited verification.\n4=Training at/before time of hire + routine cadence; hands-on/field; documented observation/coaching.\n5=Training at/before time of hire + cadence AND triggers; verified via observation/coaching and follow-up.	Constraint: if employees work before training, cap at 2.
1af4e902-0723-4bb9-be1c-615e0368b796	51408d21-c2c9-4cc4-bab7-dd71887bb410	SAF-05	1	1	0.080000	f	\N	Safety	Frontline Hazard Reporting (No Fear + Feedback)	0.0800	How do frontline employees report hazards and unsafe conditions without fear of reprisal, and how are those reports tracked, addressed, and communicated back?	1=Reporting unclear/limited; fear of discipline; little tracking/response.\n2=Mechanism exists but low trust; inconsistent tracking/response; little feedback.\n3=Clear reporting without fear; tracked/addressed; mostly reactive; participation not reinforced.\n4=Actively encouraged; timely response; feedback provided; leadership supports reporting.\n5=Embedded and reinforced; recognition/rewards; trends reviewed; employee input shapes improvements.	Constraint: if reporting leads to blame/discipline, cap at 1. If no feedback loop, cap at 3.
e16930df-7f60-48cf-882b-7046939c7d62	51408d21-c2c9-4cc4-bab7-dd71887bb410	WC-02	1	1	0.040000	f	\N	WorkersComp	Medical Direction (Clinics + Nurse Triage + Telemedicine)	0.0400	How is medical care directed following an injury, including use of nurse triage, telemedicine, and vetted occupational medical providers?	1=Uncontrolled entry; no direction/triage; restrictions unmanaged.\n2=Informal/inconsistent direction; triage/telemed optional/rare.\n3=Generally directed to occupational care/triage; limited coordination.\n4=Directed to vetted clinics/triage/telemed as appropriate; coordinated; restrictions managed.\n5=Integrated triage/telemed + vetted clinics; proactive restriction management; multi-state ready.	Constraint: if employees choose initial providers without direction, cap at 2. For remote/multi-state, no triage/telemed caps at 3.
012146ea-6af7-4392-8c47-65443facfe11	51408d21-c2c9-4cc4-bab7-dd71887bb410	FL-06	1	1	0.040000	f	\N	Fleet	Driver Engagement (Reinforcement + Participation)	0.0400	How are drivers actively engaged in fleet safety, including positive reinforcement, participation initiatives, and safe reporting of concerns?	1=No engagement; no reinforcement; reporting minimal.\n2=Passive/occasional engagement; inconsistent reinforcement.\n3=Defined mechanisms but participation inconsistent.\n4=Active reinforcement; constructive use of data; reporting encouraged and responded to.\n5=Embedded and motivating; transparent constructive data use; high participation; no fear reporting.	Constraint: if data used only for discipline/surveillance, cap at 2. No positive reinforcement caps at 3.
b2106724-0185-45db-bfcb-abc513bb3395	51408d21-c2c9-4cc4-bab7-dd71887bb410	FL-07	2	2	0.040000	f	\N	Fleet	Fleet Incidents + Near-Miss Learning	0.0200	How are fleet incidents and near-misses reported, investigated, and used to improve training, journey planning, or fleet controls?	1=Reactive only; near-misses not reviewed; no systemic change.\n2=Documented but blame-focused; near-miss rare.\n3=Defined but inconsistent corrective actions.\n4=Structured learning applied to training/journeys/controls.\n5=Integrated learning loop; effectiveness reviewed to prevent recurrence.	Constraint: if near-misses not reviewed, cap at 2. Driver-fault-only caps at 3.
4be5b5c0-8c6d-4bb7-adb8-cb29ec26a138	51408d21-c2c9-4cc4-bab7-dd71887bb410	FL-08	1	1	0.010000	f	\N	Fleet	Management Review + Accountability (Fleet)	0.0100	How does leadership review fleet risk performance, assign accountability, and take action based on fleet risk metrics?	1=No management review; accountability unclear.\n2=Infrequent/passive; little action.\n3=Periodic review; limited ownership/follow-through.\n4=Active review; named accountability; decisions change controls.\n5=Embedded executive accountability; resources allocated; outcomes monitored.	Constraint: if no defined cadence, cap at 2. If accountability diffused, cap at 3.
\.


--
-- Data for Name: score_snapshots; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.score_snapshots (id, assessment_id, completion_pct, overall_score, overall_rating, safety_score, workers_comp_score, fleet_score, guardrail_triggered, subcontractor_weighted_avg, created_at) FROM stdin;
975ec3e5-85a3-4664-be2b-0713d175a21f	0798612e-fc36-46e0-9d41-701234ae09cb	100.00	56.800	Elevated Risk	48.800	65.000	60.600	f	\N	2026-02-11 03:57:15.57208
8e5d2b50-92b1-491d-8e31-7ddea0843460	0798612e-fc36-46e0-9d41-701234ae09cb	100.00	56.800	Elevated Risk	48.800	65.000	60.600	f	\N	2026-02-11 03:57:17.354709
e18099e6-581f-4111-b970-593dd6baa662	0798612e-fc36-46e0-9d41-701234ae09cb	100.00	56.800	Elevated Risk	48.800	65.000	60.600	f	\N	2026-02-11 03:57:19.713417
3f93b3a6-4f9d-49a2-9571-1b1f012383d4	0798612e-fc36-46e0-9d41-701234ae09cb	100.00	56.800	Elevated Risk	48.800	65.000	60.600	f	\N	2026-02-11 03:57:21.405037
1801ba08-cecb-442f-9087-3c993506f05a	0798612e-fc36-46e0-9d41-701234ae09cb	100.00	56.800	Elevated Risk	48.800	65.000	60.600	f	\N	2026-02-11 03:57:23.070711
04948d08-cdf6-4128-a881-8a3320b62680	0798612e-fc36-46e0-9d41-701234ae09cb	100.00	56.800	Elevated Risk	48.800	65.000	60.600	f	\N	2026-02-11 03:57:24.570186
c85c0891-bf4b-4a04-bc8f-b6cb05094347	0798612e-fc36-46e0-9d41-701234ae09cb	100.00	56.800	Elevated Risk	48.800	65.000	60.600	f	\N	2026-02-11 03:57:26.989723
fa67fbb5-32d6-449a-96df-41e595d67c67	0798612e-fc36-46e0-9d41-701234ae09cb	100.00	56.800	Elevated Risk	48.800	65.000	60.600	f	\N	2026-02-11 03:57:28.761908
8e62949e-a840-4334-bf91-8ed26b77fea2	3da8a029-8816-4503-8785-496b14dc579c	100.00	93.300	Strong / Low Risk	86.300	95.000	99.400	f	\N	2026-02-11 04:10:14.575954
7d93c088-7b7b-46b8-990f-a30767a92143	3da8a029-8816-4503-8785-496b14dc579c	100.00	93.300	Strong / Low Risk	86.300	95.000	99.400	f	\N	2026-02-11 04:10:15.909528
0ba41e0b-641c-4af4-afe0-10fbfe06b78d	3da8a029-8816-4503-8785-496b14dc579c	100.00	93.300	Strong / Low Risk	86.300	95.000	99.400	f	\N	2026-02-11 04:10:16.817855
0bc769b8-11e9-48c2-b824-d2127f57c025	9f71eba5-7b07-49c3-9d7f-22ea309d39b4	95.00	\N	\N	\N	\N	\N	f	\N	2026-02-11 04:53:27.249878
b60ac26b-97f1-46be-8efd-ebeae5d4a71c	9f71eba5-7b07-49c3-9d7f-22ea309d39b4	100.00	85.000	Moderate Risk	90.000	76.300	84.400	f	\N	2026-02-11 04:53:31.12843
0c5a47eb-e4f6-4dd6-a04a-4c8ff3c317a5	9f71eba5-7b07-49c3-9d7f-22ea309d39b4	100.00	85.000	Moderate Risk	90.000	76.300	84.400	f	\N	2026-02-11 04:53:36.882134
3b8c13c9-fee3-4eec-ba17-ec81ac2ee61f	51408d21-c2c9-4cc4-bab7-dd71887bb410	65.00	\N	\N	\N	\N	\N	f	\N	2026-02-11 05:10:12.688982
c1c40ad5-8632-424b-a07f-0f0cc60c9666	51408d21-c2c9-4cc4-bab7-dd71887bb410	70.00	\N	\N	\N	\N	\N	f	\N	2026-02-11 05:10:14.623682
fcb457fd-4221-4659-ade7-240cf6c69f82	51408d21-c2c9-4cc4-bab7-dd71887bb410	75.00	\N	\N	\N	\N	\N	f	\N	2026-02-11 05:10:16.65778
67191b98-10d6-4ced-9ef0-5c3fcb4d24fc	51408d21-c2c9-4cc4-bab7-dd71887bb410	80.00	\N	\N	\N	\N	\N	f	\N	2026-02-11 05:10:18.265345
ddba13f3-6367-4e57-97d2-de0931057d4b	51408d21-c2c9-4cc4-bab7-dd71887bb410	85.00	\N	\N	\N	\N	\N	f	\N	2026-02-11 05:10:21.27345
423fb39b-afd3-4b38-b5a9-a33354e0556b	51408d21-c2c9-4cc4-bab7-dd71887bb410	90.00	\N	\N	\N	\N	\N	f	\N	2026-02-11 05:10:23.038006
52d5f702-6e08-4d43-937e-fc7e99106767	51408d21-c2c9-4cc4-bab7-dd71887bb410	95.00	\N	\N	\N	\N	\N	f	\N	2026-02-11 05:10:24.704006
8414af65-4d26-47a0-926f-2658e0955c94	51408d21-c2c9-4cc4-bab7-dd71887bb410	100.00	13.000	High Risk	12.500	7.500	16.200	f	\N	2026-02-11 05:10:26.509137
2b0d3fe8-d6bc-4aac-9916-b58d10b2834c	51408d21-c2c9-4cc4-bab7-dd71887bb410	100.00	13.000	High Risk	12.500	7.500	16.200	f	\N	2026-02-11 05:11:08.703256
e53a6f4a-9941-409d-bbf4-a117bba38346	51408d21-c2c9-4cc4-bab7-dd71887bb410	100.00	13.000	High Risk	12.500	7.500	16.200	f	\N	2026-02-11 05:11:13.668781
652c4f26-452a-417b-b495-7087fef4acd6	51408d21-c2c9-4cc4-bab7-dd71887bb410	100.00	13.000	High Risk	12.500	7.500	16.200	f	\N	2026-02-11 05:11:14.945327
0312430d-54a0-4872-85b6-b683ef16e75a	51408d21-c2c9-4cc4-bab7-dd71887bb410	100.00	13.000	High Risk	12.500	7.500	16.200	f	\N	2026-02-11 05:11:16.426996
9b36ccc9-c8c1-47cb-999b-e3919d3de693	51408d21-c2c9-4cc4-bab7-dd71887bb410	100.00	13.000	High Risk	12.500	7.500	16.200	f	\N	2026-02-11 05:11:18.42608
e2bb79cb-18c4-4929-88b6-1afa64a286fc	51408d21-c2c9-4cc4-bab7-dd71887bb410	100.00	13.000	High Risk	12.500	7.500	16.200	f	\N	2026-02-11 05:11:20.167221
aa8685a2-1a15-4721-b264-330651086f68	51408d21-c2c9-4cc4-bab7-dd71887bb410	100.00	14.000	High Risk	12.500	12.500	16.200	f	\N	2026-02-11 05:11:21.710167
0ec8cbeb-cdb1-4f65-befd-18442871b5ab	51408d21-c2c9-4cc4-bab7-dd71887bb410	100.00	14.000	High Risk	12.500	12.500	16.200	f	\N	2026-02-11 05:11:23.378021
69696b70-a656-451d-92c2-b1507eca2737	51408d21-c2c9-4cc4-bab7-dd71887bb410	100.00	14.000	High Risk	12.500	12.500	16.200	f	\N	2026-02-11 05:11:25.918688
88ab39a1-e634-40d9-9dc2-f82efe9b93c1	51408d21-c2c9-4cc4-bab7-dd71887bb410	100.00	13.300	High Risk	12.500	8.800	16.200	f	\N	2026-02-11 05:11:27.048871
f6ac1ba0-37f4-413e-8b69-179d36fa8821	51408d21-c2c9-4cc4-bab7-dd71887bb410	100.00	13.300	High Risk	12.500	8.800	16.200	f	\N	2026-02-11 05:11:28.542852
28ff9985-7aef-421d-a5e2-048a065c21bc	51408d21-c2c9-4cc4-bab7-dd71887bb410	100.00	13.800	High Risk	12.500	11.200	16.200	f	\N	2026-02-11 05:11:29.640726
c5ed8c66-4982-47fc-b243-d78ad346738f	51408d21-c2c9-4cc4-bab7-dd71887bb410	100.00	12.500	High Risk	12.500	11.200	13.100	f	\N	2026-02-11 05:11:32.530531
e6c6512a-efc8-43e9-843d-625ebe7323cc	0798612e-fc36-46e0-9d41-701234ae09cb	100.00	56.800	Elevated Risk	48.800	65.000	60.600	f	\N	2026-02-11 03:57:30.328911
4c9525ce-d41b-4985-a000-36f4ccfa0482	0798612e-fc36-46e0-9d41-701234ae09cb	100.00	56.800	Elevated Risk	48.800	65.000	60.600	f	\N	2026-02-11 03:57:31.279617
64deb602-05a8-44a4-b79b-5fdf8e7d785f	0798612e-fc36-46e0-9d41-701234ae09cb	100.00	56.800	Elevated Risk	48.800	65.000	60.600	f	\N	2026-02-11 03:57:32.756773
0269108f-cf7b-47b9-9352-816d1b0a7d42	0798612e-fc36-46e0-9d41-701234ae09cb	100.00	56.800	Elevated Risk	48.800	65.000	60.600	f	\N	2026-02-11 03:57:35.44079
97e43a14-de5c-444a-8d9c-521b4693f7a9	0798612e-fc36-46e0-9d41-701234ae09cb	100.00	56.800	Elevated Risk	48.800	65.000	60.600	f	\N	2026-02-11 03:57:53.75576
f4e9583b-135c-49e6-8321-e9934264e68b	0798612e-fc36-46e0-9d41-701234ae09cb	100.00	56.800	Elevated Risk	48.800	65.000	60.600	f	\N	2026-02-11 03:57:55.448165
905a02fe-b995-4402-ae33-fced0736d898	0798612e-fc36-46e0-9d41-701234ae09cb	100.00	56.800	Elevated Risk	48.800	65.000	60.600	f	\N	2026-02-11 03:57:56.534748
d72f5166-b985-4e12-bef4-5163b10b2e6d	0798612e-fc36-46e0-9d41-701234ae09cb	100.00	56.800	Elevated Risk	48.800	65.000	60.600	f	\N	2026-02-11 03:57:58.265442
6b45fb97-7dd5-4ed1-8059-ab61106179cd	0798612e-fc36-46e0-9d41-701234ae09cb	100.00	56.800	Elevated Risk	48.800	65.000	60.600	f	\N	2026-02-11 03:57:59.892086
2ef0b1a5-e72f-4b5b-82f8-115cfb7a1669	0798612e-fc36-46e0-9d41-701234ae09cb	100.00	56.800	Elevated Risk	48.800	65.000	60.600	f	\N	2026-02-11 03:58:00.881982
446b8448-9fc3-4f7b-b174-326af95f0c02	0798612e-fc36-46e0-9d41-701234ae09cb	100.00	56.800	Elevated Risk	48.800	65.000	60.600	f	\N	2026-02-11 03:58:03.032143
caadfcc9-41f3-455d-a963-46be3f398c74	0798612e-fc36-46e0-9d41-701234ae09cb	100.00	56.800	Elevated Risk	48.800	65.000	60.600	f	\N	2026-02-11 03:58:04.610004
cb2af660-1dee-4b84-90d9-c315b19557a8	0798612e-fc36-46e0-9d41-701234ae09cb	100.00	56.800	Elevated Risk	48.800	65.000	60.600	f	\N	2026-02-11 03:58:08.163545
f2177c96-bbf2-4233-8d5e-964f87e69d59	3da8a029-8816-4503-8785-496b14dc579c	100.00	93.300	Strong / Low Risk	86.300	95.000	99.400	f	\N	2026-02-11 04:09:57.710797
d88d3ef3-69bd-422d-a38c-2a0b188bd9df	3da8a029-8816-4503-8785-496b14dc579c	100.00	93.300	Strong / Low Risk	86.300	95.000	99.400	f	\N	2026-02-11 04:09:58.851668
14088fe5-67e2-4266-82e6-9f87d7221488	3da8a029-8816-4503-8785-496b14dc579c	100.00	93.300	Strong / Low Risk	86.300	95.000	99.400	f	\N	2026-02-11 04:10:00.191946
72b2acfd-1e94-43a0-83cc-e5c432d3e21e	3da8a029-8816-4503-8785-496b14dc579c	100.00	93.300	Strong / Low Risk	86.300	95.000	99.400	f	\N	2026-02-11 04:10:01.566934
f329614d-9705-445a-bb83-ff0c7120b41a	3da8a029-8816-4503-8785-496b14dc579c	100.00	93.300	Strong / Low Risk	86.300	95.000	99.400	f	\N	2026-02-11 04:10:07.337147
b9d341f5-bd1f-4240-afc8-fd5b40d584db	3da8a029-8816-4503-8785-496b14dc579c	100.00	93.300	Strong / Low Risk	86.300	95.000	99.400	f	\N	2026-02-11 04:10:08.779471
2d171a9b-7191-450d-b83a-de18bac8dcb7	3da8a029-8816-4503-8785-496b14dc579c	100.00	93.300	Strong / Low Risk	86.300	95.000	99.400	f	\N	2026-02-11 04:10:10.276611
eb337f2c-2254-4ca4-ab43-0d4207ce6851	3da8a029-8816-4503-8785-496b14dc579c	100.00	93.300	Strong / Low Risk	86.300	95.000	99.400	f	\N	2026-02-11 04:10:11.848774
61add24d-fc21-4224-a1ef-4bfa6ee61592	3da8a029-8816-4503-8785-496b14dc579c	100.00	93.300	Strong / Low Risk	86.300	95.000	99.400	f	\N	2026-02-11 04:10:13.183658
279b1bcc-d44e-4ae2-8442-73a287224d56	c94f087e-462f-4d49-8c64-9b1ac1e82312	5.00	\N	\N	\N	\N	\N	f	\N	2026-02-11 04:51:17.994585
0283729b-6ac1-4f41-8449-dd9fa4d841b7	c94f087e-462f-4d49-8c64-9b1ac1e82312	10.00	\N	\N	\N	\N	\N	f	\N	2026-02-11 04:51:20.070441
0967b963-1573-49f0-a5a9-a2b925633c9d	c94f087e-462f-4d49-8c64-9b1ac1e82312	15.00	\N	\N	\N	\N	\N	f	\N	2026-02-11 04:51:21.904185
b25f32f5-0d54-45e5-ae5a-fa22aab3d438	c94f087e-462f-4d49-8c64-9b1ac1e82312	20.00	\N	\N	\N	\N	\N	f	\N	2026-02-11 04:51:24.379869
a04acbb2-1aa0-438e-b720-00b0af3d3793	c94f087e-462f-4d49-8c64-9b1ac1e82312	25.00	\N	\N	\N	\N	\N	f	\N	2026-02-11 04:51:26.182377
4e273f87-40e0-4f55-8939-66209d52063c	c94f087e-462f-4d49-8c64-9b1ac1e82312	30.00	\N	\N	\N	\N	\N	f	\N	2026-02-11 04:51:28.447087
f119c442-1371-4608-91dc-4fa7c5dad671	c94f087e-462f-4d49-8c64-9b1ac1e82312	35.00	\N	\N	\N	\N	\N	f	\N	2026-02-11 04:51:31.182742
267769c7-e017-4167-a401-49208973ef91	c94f087e-462f-4d49-8c64-9b1ac1e82312	40.00	\N	\N	\N	\N	\N	f	\N	2026-02-11 04:51:33.924919
ec5f566f-9a38-4fd8-9deb-6c24c6c0ccb4	c94f087e-462f-4d49-8c64-9b1ac1e82312	45.00	\N	\N	\N	\N	\N	f	\N	2026-02-11 04:51:35.777599
b0c926e7-9df0-43cb-887f-3877f94cba35	c94f087e-462f-4d49-8c64-9b1ac1e82312	50.00	\N	\N	\N	\N	\N	f	\N	2026-02-11 04:51:39.503341
18dbee0d-cf69-407c-8c01-437a0f08e7d3	c94f087e-462f-4d49-8c64-9b1ac1e82312	55.00	\N	\N	\N	\N	\N	f	\N	2026-02-11 04:51:41.237164
5d93a7f9-30e4-4123-9568-5354b635aa94	c94f087e-462f-4d49-8c64-9b1ac1e82312	60.00	\N	\N	\N	\N	\N	f	\N	2026-02-11 04:51:43.23797
82b71edb-2e8d-4667-b0de-bacce93140df	c94f087e-462f-4d49-8c64-9b1ac1e82312	65.00	\N	\N	\N	\N	\N	f	\N	2026-02-11 04:51:45.853507
b7789469-759f-44a5-bb9e-bd089e9236cd	c94f087e-462f-4d49-8c64-9b1ac1e82312	70.00	\N	\N	\N	\N	\N	f	\N	2026-02-11 04:51:48.004297
946e4072-dd43-4233-952f-43d4fae9d796	c94f087e-462f-4d49-8c64-9b1ac1e82312	75.00	\N	\N	\N	\N	\N	f	\N	2026-02-11 04:51:50.055061
d16026e5-dd3c-49df-a69e-230af687290f	c94f087e-462f-4d49-8c64-9b1ac1e82312	80.00	\N	\N	\N	\N	\N	f	\N	2026-02-11 04:51:51.831466
32b382fc-896e-4e2c-9732-7783a948a174	c94f087e-462f-4d49-8c64-9b1ac1e82312	85.00	\N	\N	\N	\N	\N	f	\N	2026-02-11 04:51:54.938484
4e633efa-9a45-4312-97c5-a1a6bcb748a4	c94f087e-462f-4d49-8c64-9b1ac1e82312	90.00	\N	\N	\N	\N	\N	f	\N	2026-02-11 04:51:58.044185
4e98d042-5135-4b03-9e37-16428f35c3a2	c94f087e-462f-4d49-8c64-9b1ac1e82312	95.00	\N	\N	\N	\N	\N	f	\N	2026-02-11 04:51:59.601483
c4a2fdbf-7389-477f-b85b-eb3aa3e74da8	c94f087e-462f-4d49-8c64-9b1ac1e82312	100.00	50.300	High Risk	50.000	50.000	50.600	f	\N	2026-02-11 04:52:01.170277
d0a8328a-b573-466e-9f79-08f31717fa35	c94f087e-462f-4d49-8c64-9b1ac1e82312	100.00	50.300	High Risk	50.000	50.000	50.600	f	\N	2026-02-11 04:52:06.0459
5ccc492b-ab83-4788-b22e-e60e4fd72740	51408d21-c2c9-4cc4-bab7-dd71887bb410	5.00	\N	\N	\N	\N	\N	f	\N	2026-02-11 05:09:48.946295
74208baa-7705-475f-b708-3e5a35206ca6	51408d21-c2c9-4cc4-bab7-dd71887bb410	5.00	\N	\N	\N	\N	\N	f	\N	2026-02-11 05:09:51.263175
60963114-67ec-48a7-8e3b-3978864fa258	51408d21-c2c9-4cc4-bab7-dd71887bb410	10.00	\N	\N	\N	\N	\N	f	\N	2026-02-11 05:09:52.321944
edae9a69-b190-4103-aa3a-446a4452f3f3	51408d21-c2c9-4cc4-bab7-dd71887bb410	15.00	\N	\N	\N	\N	\N	f	\N	2026-02-11 05:09:53.930298
de87e81f-b381-4445-bfb2-262a8539598f	51408d21-c2c9-4cc4-bab7-dd71887bb410	20.00	\N	\N	\N	\N	\N	f	\N	2026-02-11 05:09:56.513248
647d8f2b-0634-4077-8d7e-4caee4d8a6e5	51408d21-c2c9-4cc4-bab7-dd71887bb410	25.00	\N	\N	\N	\N	\N	f	\N	2026-02-11 05:09:58.352553
e90b9b46-7b0d-4e45-a058-bc57c71532ad	51408d21-c2c9-4cc4-bab7-dd71887bb410	30.00	\N	\N	\N	\N	\N	f	\N	2026-02-11 05:10:00.173886
c3e5f9fc-4777-48dc-a2fc-69c9321dcbb3	51408d21-c2c9-4cc4-bab7-dd71887bb410	35.00	\N	\N	\N	\N	\N	f	\N	2026-02-11 05:10:01.822342
0073bcb1-66fb-40b0-ad37-cfe26fa9c971	51408d21-c2c9-4cc4-bab7-dd71887bb410	40.00	\N	\N	\N	\N	\N	f	\N	2026-02-11 05:10:03.424369
9ddc50be-c000-4f74-84a5-f479d4fb9660	51408d21-c2c9-4cc4-bab7-dd71887bb410	45.00	\N	\N	\N	\N	\N	f	\N	2026-02-11 05:10:04.800404
f3143fa7-b505-4bcb-bb1c-57a9c376d85b	51408d21-c2c9-4cc4-bab7-dd71887bb410	50.00	\N	\N	\N	\N	\N	f	\N	2026-02-11 05:10:07.257974
b0cd2a3b-e75d-4b5b-810b-147404418a6f	51408d21-c2c9-4cc4-bab7-dd71887bb410	55.00	\N	\N	\N	\N	\N	f	\N	2026-02-11 05:10:09.121098
20dfa910-6f9b-4897-a3df-0ce5973b5151	51408d21-c2c9-4cc4-bab7-dd71887bb410	60.00	\N	\N	\N	\N	\N	f	\N	2026-02-11 05:10:10.600445
fd33bb1e-97ac-4bd1-b99e-af29067f54e4	9f71eba5-7b07-49c3-9d7f-22ea309d39b4	5.00	\N	\N	\N	\N	\N	f	\N	2026-02-11 04:52:53.967961
2b19e80a-7fa3-4c48-a91f-6c5e3bb64d67	9f71eba5-7b07-49c3-9d7f-22ea309d39b4	10.00	\N	\N	\N	\N	\N	f	\N	2026-02-11 04:52:55.019871
0969dfef-dcfe-4a3b-912c-5a70e534d682	9f71eba5-7b07-49c3-9d7f-22ea309d39b4	15.00	\N	\N	\N	\N	\N	f	\N	2026-02-11 04:52:56.357014
86a76523-e678-4a1b-b686-bd62cb7cc0f6	9f71eba5-7b07-49c3-9d7f-22ea309d39b4	20.00	\N	\N	\N	\N	\N	f	\N	2026-02-11 04:52:57.574036
dda6476c-acbf-476b-a6bd-8dc124508df7	9f71eba5-7b07-49c3-9d7f-22ea309d39b4	25.00	\N	\N	\N	\N	\N	f	\N	2026-02-11 04:52:59.01096
b6dd4e11-a790-40cb-a869-078d367b758d	9f71eba5-7b07-49c3-9d7f-22ea309d39b4	30.00	\N	\N	\N	\N	\N	f	\N	2026-02-11 04:53:01.235523
46b6d33b-fc8b-44a4-b699-ad442d717cac	9f71eba5-7b07-49c3-9d7f-22ea309d39b4	35.00	\N	\N	\N	\N	\N	f	\N	2026-02-11 04:53:03.610232
42025883-3261-4558-9a73-a0e98368b8c3	9f71eba5-7b07-49c3-9d7f-22ea309d39b4	40.00	\N	\N	\N	\N	\N	f	\N	2026-02-11 04:53:05.490278
d0379504-d157-4366-a7c6-d991ec6c36fe	3da8a029-8816-4503-8785-496b14dc579c	100.00	93.300	Strong / Low Risk	86.300	95.000	99.400	f	\N	2026-02-11 04:10:18.49238
274957f5-26c9-4d4b-8ab2-6330b4ffd5cf	3da8a029-8816-4503-8785-496b14dc579c	100.00	93.300	Strong / Low Risk	86.300	95.000	99.400	f	\N	2026-02-11 04:10:19.50029
2f5e04e0-7544-4373-a73d-3b4d10a861a4	3da8a029-8816-4503-8785-496b14dc579c	100.00	93.300	Strong / Low Risk	86.300	95.000	99.400	f	\N	2026-02-11 04:10:21.17558
7fd6d633-f62f-4370-80cb-9519838f744f	3da8a029-8816-4503-8785-496b14dc579c	100.00	93.300	Strong / Low Risk	86.300	95.000	99.400	f	\N	2026-02-11 04:10:22.423661
753ecb82-9be1-4fd7-b4c7-0620130930ae	3da8a029-8816-4503-8785-496b14dc579c	100.00	93.300	Strong / Low Risk	86.300	95.000	99.400	f	\N	2026-02-11 04:10:24.002668
7e3bf4ba-6a98-41e7-9c1b-385a3dae1a99	3da8a029-8816-4503-8785-496b14dc579c	100.00	93.300	Strong / Low Risk	86.300	95.000	99.400	f	\N	2026-02-11 04:10:26.066001
bac23dc2-a7c1-40a3-a56b-b2fecc53a9fd	3da8a029-8816-4503-8785-496b14dc579c	100.00	93.300	Strong / Low Risk	86.300	95.000	99.400	f	\N	2026-02-11 04:10:27.438464
411c7ffd-6aca-4c50-bf7d-6c26f276c9f0	3da8a029-8816-4503-8785-496b14dc579c	100.00	93.300	Strong / Low Risk	86.300	95.000	99.400	f	\N	2026-02-11 04:10:28.875606
92c760ff-c1b2-4ef7-9ba9-3142df81926d	3da8a029-8816-4503-8785-496b14dc579c	100.00	93.300	Strong / Low Risk	86.300	95.000	99.400	f	\N	2026-02-11 04:10:32.06184
6cacaadf-61d9-437b-8312-2836b759fb6e	9f71eba5-7b07-49c3-9d7f-22ea309d39b4	45.00	\N	\N	\N	\N	\N	f	\N	2026-02-11 04:53:06.85373
d85d5abf-f59d-4c07-9196-2592b6a117d5	9f71eba5-7b07-49c3-9d7f-22ea309d39b4	50.00	\N	\N	\N	\N	\N	f	\N	2026-02-11 04:53:08.330829
06db037b-3ae1-48f6-b5c8-40f4c967c182	9f71eba5-7b07-49c3-9d7f-22ea309d39b4	55.00	\N	\N	\N	\N	\N	f	\N	2026-02-11 04:53:09.2555
6d1a13ca-fac7-4be6-bcdb-5b3784fb5551	9f71eba5-7b07-49c3-9d7f-22ea309d39b4	60.00	\N	\N	\N	\N	\N	f	\N	2026-02-11 04:53:13.374659
2d7b64a4-d62e-4d45-bfd6-168b901bbbf2	9f71eba5-7b07-49c3-9d7f-22ea309d39b4	65.00	\N	\N	\N	\N	\N	f	\N	2026-02-11 04:53:14.721584
9fd461b6-979f-44c6-ae2b-62caaf01a534	9f71eba5-7b07-49c3-9d7f-22ea309d39b4	70.00	\N	\N	\N	\N	\N	f	\N	2026-02-11 04:53:17.130614
27debd34-f1c2-4812-8ebb-b81c0eab454d	9f71eba5-7b07-49c3-9d7f-22ea309d39b4	75.00	\N	\N	\N	\N	\N	f	\N	2026-02-11 04:53:19.202282
c701f288-3188-41b1-ad9c-0e289fcb777e	9f71eba5-7b07-49c3-9d7f-22ea309d39b4	80.00	\N	\N	\N	\N	\N	f	\N	2026-02-11 04:53:20.506997
4beaca2a-f110-405b-b19a-83174393491f	9f71eba5-7b07-49c3-9d7f-22ea309d39b4	85.00	\N	\N	\N	\N	\N	f	\N	2026-02-11 04:53:21.973522
ae14ad30-d2e1-42f0-a0e3-e2f11cdf4b09	9f71eba5-7b07-49c3-9d7f-22ea309d39b4	90.00	\N	\N	\N	\N	\N	f	\N	2026-02-11 04:53:23.465001
a3ac1c90-077e-42df-8a2a-9049ba5fc334	51408d21-c2c9-4cc4-bab7-dd71887bb410	100.00	14.500	High Risk	12.500	11.200	18.100	f	\N	2026-02-11 05:11:34.62187
c65bfd31-530f-40ed-9857-e5e549f566a2	51408d21-c2c9-4cc4-bab7-dd71887bb410	100.00	16.000	High Risk	12.500	11.200	21.900	f	\N	2026-02-11 05:11:36.351962
68881c0c-c9f0-4f73-a5bc-8c5a9f08ddcf	51408d21-c2c9-4cc4-bab7-dd71887bb410	100.00	14.300	High Risk	12.500	11.200	17.500	f	\N	2026-02-11 05:11:38.702667
17775d95-9954-463a-ae5d-c61bef76f6b8	51408d21-c2c9-4cc4-bab7-dd71887bb410	100.00	10.800	High Risk	12.500	11.200	8.800	f	\N	2026-02-11 05:11:40.720685
b8bdd77e-cfb1-431b-9cb9-c06148c63c19	51408d21-c2c9-4cc4-bab7-dd71887bb410	100.00	10.800	High Risk	12.500	11.200	8.800	f	\N	2026-02-11 05:11:42.281137
e593d2fa-efe9-42cc-a059-428116583359	51408d21-c2c9-4cc4-bab7-dd71887bb410	100.00	11.300	High Risk	12.500	11.200	10.000	f	\N	2026-02-11 05:11:44.542663
620224dc-7dcb-4f8e-8434-f2e901c776b4	51408d21-c2c9-4cc4-bab7-dd71887bb410	100.00	11.300	High Risk	12.500	11.200	10.000	f	\N	2026-02-11 05:11:46.404058
c377582d-37e6-41fc-a2ac-e75158c855d4	51408d21-c2c9-4cc4-bab7-dd71887bb410	100.00	11.300	High Risk	12.500	11.200	10.000	f	\N	2026-02-11 05:17:33.55318
\.


--
-- Data for Name: sessions; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.sessions (sid, sess, expire) FROM stdin;
_LMHFnxf-XRvGqa7FPmz47S0tW30rsU0	{"cookie": {"path": "/", "secure": true, "expires": "2026-05-12T17:53:02.128Z", "httpOnly": true, "originalMaxAge": 604800000}, "passport": {"user": {"claims": {"aud": "edda0cf7-5def-42e3-8039-e3b87011700a", "exp": 1778007182, "iat": 1778003582, "iss": "https://replit.com/oidc", "sub": "58564656", "email": "stanislavyem@outlook.com", "at_hash": "0460LyX4MlMFYg8gDScbxg", "username": "stanislavyem", "auth_time": 1777785155, "last_name": "Yem", "first_name": "Stanislav", "email_verified": true}, "expires_at": 1778007182, "access_token": "WrrO6YO_yOdOShklLNEVMoeRWDIoPhA5zAEbjGWvo_B", "refresh_token": "NXO_Ql_-VAZZM-sEtR_AZuKGi7N85w2I3mJziihuwAC"}}}	2026-05-12 18:10:53
\.


--
-- Data for Name: subcontractor_responses; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.subcontractor_responses (id, assessment_id, safety_training_score, insurance_verification_score, coverage_contract_score, weighted_avg, guardrail_triggered, created_at) FROM stdin;
\.


--
-- Data for Name: user_profiles; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.user_profiles (id, user_id, role, created_at) FROM stdin;
\.


--
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.users (id, email, first_name, last_name, profile_image_url, created_at, updated_at) FROM stdin;
test-user-Z122FK	testuserjY5Ycy@example.com	Test	User	\N	2026-02-03 20:46:06.012195	2026-02-03 20:46:06.012195
test-user-h-M5uY	testuser0Idjsb@example.com	Test	User	\N	2026-02-03 20:48:34.550384	2026-02-03 20:48:34.550384
dashboard-test-bNklry	dashtest-2BBru@example.com	Dashboard	Tester	\N	2026-02-03 21:12:33.342403	2026-02-03 21:12:33.342403
delete-test-tC7xfY	deltestXr03aY@example.com	Delete	Tester	\N	2026-02-11 02:47:26.996239	2026-02-11 02:47:26.996239
test-assess-WPLI0_	assesstest@example.com	Test	Assessor	\N	2026-02-11 03:23:06.781952	2026-02-11 03:23:06.781952
scroll-test-KCno6S	scrolltest@example.com	Scroll	Tester	\N	2026-02-11 03:38:37.478135	2026-02-11 03:38:37.478135
YvMNfw	YvMNfw@example.com	John	Doe	\N	2026-02-11 04:20:44.5035	2026-02-11 04:20:44.5035
test-scoring-user	scoring-test@example.com	Score	Tester	\N	2026-02-11 04:34:45.313383	2026-02-11 04:34:45.313383
dashboard-fix-test	dashtest@example.com	Dash	Tester	\N	2026-02-11 05:00:58.728856	2026-02-11 05:00:58.728856
delete-test-user	deletetest@example.com	Delete	Tester	\N	2026-02-11 05:05:48.307451	2026-02-11 05:05:48.307451
save-test-user-1	savetest1@example.com	Save	Tester	\N	2026-02-11 05:14:56.022128	2026-02-11 05:14:56.022128
notes-test-user	notestest@example.com	Notes	Tester	\N	2026-02-13 01:16:59.362069	2026-02-13 01:16:59.362069
qnotes-test-user	qnotestest@example.com	QNotes	Tester	\N	2026-02-13 01:27:33.027356	2026-02-13 01:27:33.027356
perq-notes-user	perqnotes@example.com	PerQ	Notes	\N	2026-02-13 01:47:45.892169	2026-02-13 01:47:45.892169
fix-notes-user	fixnotes@example.com	Fix	Notes	\N	2026-02-13 01:54:24.193891	2026-02-13 01:54:24.193891
other-user-999	other999@example.com	Other	User	\N	2026-02-13 01:54:41.951568	2026-02-13 01:54:41.951568
fresh-user-start	freshstart@example.com	Fresh	Start	\N	2026-02-13 02:09:40.226232	2026-02-13 02:09:40.226232
54701217	demarcus.strange@icloud.com	\N	\N	\N	2026-02-13 02:17:20.914123	2026-02-13 02:17:20.914123
org-form-test-user	orgformtest@example.com	Org	Tester	\N	2026-02-13 02:34:58.310565	2026-02-13 02:34:58.310565
detail-view-test	detailtest@example.com	Detail	Viewer	\N	2026-02-13 02:38:01.299916	2026-02-13 02:38:01.299916
notes-debug-user	notesdebug@example.com	Notes	Debugger	\N	2026-02-24 00:59:28.357143	2026-02-24 00:59:28.357143
notes-fix-verify	notesfixverify@example.com	Notes	FixVerify	\N	2026-02-24 01:03:17.890559	2026-02-24 01:03:17.890559
action-dash-test	actiondash@example.com	Action	Tester	\N	2026-02-24 01:15:38.815449	2026-02-24 01:15:38.815449
demo-dash-user	demodash@example.com	Demo	User	\N	2026-02-24 01:21:14.659917	2026-02-24 01:21:14.659917
upload-test-user	uploadtest@example.com	Upload	Tester	\N	2026-02-24 02:01:36.350665	2026-02-24 02:01:36.350665
53745371	strademd903@gmail.com	DeMarcus	Strange	https://lh3.googleusercontent.com/a/ACg8ocI8Bmn5nSyB4wDGS2xrydZ5qfkCFNYAeCSsMN76msAKD6trbLVd=s96-c	2026-02-03 20:45:17.679818	2026-04-26 20:23:58.092
58564656	stanislavyem@outlook.com	Stanislav	Yem	\N	2026-05-03 05:12:35.541833	2026-05-03 05:12:35.541833
\.


--
-- Name: action_items action_items_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.action_items
    ADD CONSTRAINT action_items_pkey PRIMARY KEY (id);


--
-- Name: assessments assessments_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.assessments
    ADD CONSTRAINT assessments_pkey PRIMARY KEY (id);


--
-- Name: comments comments_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.comments
    ADD CONSTRAINT comments_pkey PRIMARY KEY (id);


--
-- Name: documents documents_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.documents
    ADD CONSTRAINT documents_pkey PRIMARY KEY (id);


--
-- Name: memberships memberships_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.memberships
    ADD CONSTRAINT memberships_pkey PRIMARY KEY (id);


--
-- Name: organizations organizations_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.organizations
    ADD CONSTRAINT organizations_pkey PRIMARY KEY (id);


--
-- Name: questions questions_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.questions
    ADD CONSTRAINT questions_pkey PRIMARY KEY (id);


--
-- Name: responses responses_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.responses
    ADD CONSTRAINT responses_pkey PRIMARY KEY (id);


--
-- Name: score_snapshots score_snapshots_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.score_snapshots
    ADD CONSTRAINT score_snapshots_pkey PRIMARY KEY (id);


--
-- Name: sessions sessions_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.sessions
    ADD CONSTRAINT sessions_pkey PRIMARY KEY (sid);


--
-- Name: subcontractor_responses subcontractor_responses_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.subcontractor_responses
    ADD CONSTRAINT subcontractor_responses_pkey PRIMARY KEY (id);


--
-- Name: user_profiles user_profiles_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.user_profiles
    ADD CONSTRAINT user_profiles_pkey PRIMARY KEY (id);


--
-- Name: users users_email_unique; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_unique UNIQUE (email);


--
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- Name: IDX_session_expire; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_session_expire" ON public.sessions USING btree (expire);


--
-- PostgreSQL database dump complete
--

\unrestrict lfGsP0aCcabMBhPuJ9gB5t4lU6rV37DiS3qq72vBKiSAdcY2TGp2p62jRrR1rPU

