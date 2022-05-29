-- Database: Icarus-airport

-- DROP DATABASE IF EXISTS "Icarus-airport";

CREATE DATABASE "Icarus-airport"
    WITH
    OWNER = postgres
    ENCODING = 'UTF8'
    TABLESPACE = pg_default
    CONNECTION LIMIT = -1;

-- Table: public.Admin

-- DROP TABLE IF EXISTS public."Admin";

CREATE TABLE IF NOT EXISTS public."Admin"
(
    username character varying(100) COLLATE pg_catalog."default" NOT NULL,
    CONSTRAINT "Admin_pkey" PRIMARY KEY (username)
)

-- Table: public.Airline

-- DROP TABLE IF EXISTS public."Airline";

CREATE TABLE IF NOT EXISTS public."Airline"
(
    "airline_ID" integer NOT NULL DEFAULT nextval('"Airline_airline_ID_seq"'::regclass),
    "name_" VARCHAR(255) NOT NULL,
    "IATA" VARCHAR(3) NOT NULL,
    "ICAO" VARCHAR(4),
    "telephone" integer,
    "email" VARCHAR(255),
    "gate code" integer NOT NULL,
    CONSTRAINT "airline_ID_pkey" PRIMARY KEY ("airline_ID"),
    CONSTRAINT "Airline_gate code_fkey" FOREIGN KEY ("gate code")
        REFERENCES public."Gate" ("gate_ID") MATCH SIMPLE
        ON UPDATE CASCADE
        ON DELETE CASCADE
        NOT VALID
)

-- Table: public.Airport

-- DROP TABLE IF EXISTS public."Airport";

CREATE TABLE IF NOT EXISTS public."Airport"
(
    "airport_ID" integer NOT NULL DEFAULT nextval('"Airport_airport_ID_seq"'::regclass),
    "name_" VARCHAR(255) NOT NULL,
    "IATA" VARCHAR(3) NOT NULL,
    "ICAO" VARCHAR(4),
    "country" VARCHAR(255) NOT NULL,
    "city" VARCHAR(255) NOT NULL,
    CONSTRAINT "Airport_pkey" PRIMARY KEY ("airport_ID")
)

-- Table: public.flies

-- DROP TABLE IF EXISTS public."flies";

CREATE TABLE IF NOT EXISTS public."flies"
(
    "airline_ID" integer NOT NULL,
    "flight_ID" integer NOT NULL,
    "airport_ID" integer NOT NULL,
    CONSTRAINT "flies_pkey" PRIMARY KEY ("airline_ID", "flight_ID", "airport_ID"),
    CONSTRAINT "flies_airline_ID_fkey" FOREIGN KEY ("airline_ID")
        REFERENCES public."Airline" ("airline_ID") MATCH SIMPLE
        ON UPDATE CASCADE
        ON DELETE CASCADE,
    CONSTRAINT "flies_airport_ID_fkey" FOREIGN KEY ("airport_ID")
        REFERENCES public."Airport" ("airport_ID") MATCH SIMPLE
        ON UPDATE CASCADE
        ON DELETE CASCADE,
    CONSTRAINT "flies_flight_ID_fkey" FOREIGN KEY ("flight_ID")
        REFERENCES public."Flight" ("flight_ID") MATCH SIMPLE
        ON UPDATE CASCADE
        ON DELETE CASCADE
)

-- Table: public.Flight

-- DROP TABLE IF EXISTS public."Flight";

CREATE TABLE IF NOT EXISTS public."Flight"
(
    "flight_ID" integer NOT NULL DEFAULT nextval('"Flight_flight_ID_seq"'::regclass),
    "date_" date NOT NULL,
    "scheduled_arrival_time" time without time zone NOT NULL,
    expected_arrival_time time without time zone,
    "from" VARCHAR(255),
    "to" VARCHAR(255),
    "capacity" integer,
    CONSTRAINT "Flight_pkey" PRIMARY KEY ("flight_ID")
)

-- Table: public.Gate

-- DROP TABLE IF EXISTS public."Gate";

CREATE TABLE IF NOT EXISTS public."Gate"
(
    "gate_ID" integer NOT NULL DEFAULT nextval('"Gate_gate_ID_seq"'::regclass),
    gate_name VARCHAR(255) NOT NULL,
    gate_number integer NOT NULL,
    coordinates VARCHAR(255),
    CONSTRAINT "Gate_pkey" PRIMARY KEY ("gate_ID")
)

-- Table: public.General_User

-- DROP TABLE IF EXISTS public."General_User";

CREATE TABLE IF NOT EXISTS public."General_User"
(
    username VARCHAR(255) NOT NULL,
    password_ VARCHAR(255) NOT NULL,
    first_name VARCHAR(255) NOT NULL,
    last_name VARCHAR(255) NOT NULL,
    age integer NOT NULL,
    gender VARCHAR(255) NOT NULL,
    is_admin boolean NOT NULL,
    email VARCHAR(255) NOT NULL,
    country VARCHAR(255) NOT NULL,
    CONSTRAINT "General_User_pkey" PRIMARY KEY (username),
    CONSTRAINT "General_User_email_key" UNIQUE (email)
)

-- Table: public.General_info

-- DROP TABLE IF EXISTS public."General_info";

CREATE TABLE IF NOT EXISTS public."General_info"
(
    "info_ID" integer NOT NULL DEFAULT nextval('"General_info_info_ID_seq"'::regclass),
    title VARCHAR(255),
    description text,
    CONSTRAINT "General_info_pkey" PRIMARY KEY ("info_ID")
)


-- Table: public.User

-- DROP TABLE IF EXISTS public."User";

CREATE TABLE IF NOT EXISTS public."User"
(
    username VARCHAR(255) NOT NULL,
    CONSTRAINT "User_pkey" PRIMARY KEY (username)
)

-- Table: public.modifies

-- DROP TABLE IF EXISTS public.modifies;

CREATE TABLE IF NOT EXISTS public.modifies
(
    username VARCHAR(255) NOT NULL,
    "info_ID" integer NOT NULL,
    modification_date date,
    CONSTRAINT modifies_pkey PRIMARY KEY (username, "info_ID"),
    CONSTRAINT "modifies_info_ID_fkey" FOREIGN KEY ("info_ID")
        REFERENCES public."General_info" ("info_ID") MATCH SIMPLE
        ON UPDATE CASCADE
        ON DELETE CASCADE,
    CONSTRAINT modifies_username_fkey FOREIGN KEY (username)
        REFERENCES public."Admin" (username) MATCH SIMPLE
        ON UPDATE CASCADE
        ON DELETE CASCADE
)


-- Table: public.processing

-- DROP TABLE IF EXISTS public.processing;

CREATE TABLE IF NOT EXISTS public.processing
(
    username VARCHAR(255) NOT NULL,
    "airline_ID" integer NOT NULL,
    processing_date date,
    CONSTRAINT processing_pkey PRIMARY KEY (username, "airline_ID"),
    CONSTRAINT "processing_airline_ID_fkey" FOREIGN KEY ("airline_ID")
        REFERENCES public."Airline" ("airline_ID") MATCH SIMPLE
        ON UPDATE CASCADE
        ON DELETE CASCADE,
    CONSTRAINT processing_username_fkey FOREIGN KEY (username)
        REFERENCES public."Admin" (username) MATCH SIMPLE
        ON UPDATE CASCADE
        ON DELETE CASCADE
)


TABLESPACE pg_default;

ALTER TABLE IF EXISTS public."Airline"
    OWNER to postgres;
