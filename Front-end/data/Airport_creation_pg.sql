CREATE TABLE public."User" (
	"username" varchar(255) NOT NULL,
	CONSTRAINT "User_pk" PRIMARY KEY ("username")
) WITH (
  OIDS=FALSE
);



CREATE TABLE public."General_User" (
	"username" varchar(255) NOT NULL,
	"password" varchar(255) NOT NULL,
	"first_name" varchar(255) NOT NULL,
	"last_name" varchar(255) NOT NULL,
	"email" varchar(255) NOT NULL,
	"telephone" varchar(10) NOT NULL,
	"age" integer NOT NULL,
	"country" varchar(255) NOT NULL,
	"city" varchar(255) NOT NULL,
	"is_admin" BOOLEAN NOT NULL,
	CONSTRAINT "General_User_pk" PRIMARY KEY ("username")
) WITH (
  OIDS=FALSE
);



CREATE TABLE public."Admin" (
	"username" varchar(255) NOT NULL,
	CONSTRAINT "Admin_pk" PRIMARY KEY ("username")
) WITH (
  OIDS=FALSE
);



CREATE TABLE public."Gate" (
	"gate_ID" serial NOT NULL,
	"terminal" integer NOT NULL,
	"gate_name" varchar(255) NOT NULL,
	"gate_number" integer NOT NULL,
	CONSTRAINT "Gate_pk" PRIMARY KEY ("gate_ID")
) WITH (
  OIDS=FALSE
);



CREATE TABLE public."General_info" (
	"info_ID" serial NOT NULL,
	"title" varchar(255) NOT NULL,
	"description" TEXT NOT NULL,
	CONSTRAINT "General_info_pk" PRIMARY KEY ("info_ID")
) WITH (
  OIDS=FALSE
);



CREATE TABLE public."Airline" (
	"airline_ID" serial NOT NULL,
	"airline_name" varchar(255) NOT NULL,
	"IATA" varchar(2) NOT NULL,
	"ICAO" varchar(3),
	"telephone" varchar(10),
	"email" varchar(255),
	"gate_code" integer NOT NULL,
	CONSTRAINT "Airline_pk" PRIMARY KEY ("airline_ID")
) WITH (
  OIDS=FALSE
);



CREATE TABLE public."flies" (
	"flight_ID" serial NOT NULL,
	"airport_ID" integer NOT NULL,
	"airline_ID" integer NOT NULL,
	"flight_date" DATE NOT NULL,
	"expected_time" TIME NOT NULL,
	"capacity" integer NOT NULL,
	"is_destination" BOOLEAN NOT NULL,
	CONSTRAINT "flies_pk" PRIMARY KEY ("flight_ID","airport_ID","airline_ID")
) WITH (
  OIDS=FALSE
);



CREATE TABLE public."Airport" (
	"airport_ID" serial NOT NULL,
	"airport_name" varchar(255) NOT NULL,
	"IATA" varchar(3) NOT NULL,
	"ICAO" varchar(4) NOT NULL,
	"country" varchar(255) NOT NULL,
	"city" varchar(255),
	CONSTRAINT "Airport_pk" PRIMARY KEY ("airport_ID")
) WITH (
  OIDS=FALSE
);



CREATE TABLE public."Announcement" (
	"announcement_ID" serial NOT NULL,
	"username" varchar(255) NOT NULL,
	"theme" varchar(255) NOT NULL,
	"ann_text" TEXT NOT NULL,
	"ann_date" DATE NOT NULL,
	"ann_time" TIME NOT NULL,
	"priority" varchar(255) NOT NULL,
	CONSTRAINT "Announcement_pk" PRIMARY KEY ("announcement_ID","username")
) WITH (
  OIDS=FALSE
);



CREATE TABLE public."modifies" (
	"username" varchar(255) NOT NULL,
	"info_ID" integer NOT NULL,
	"modification_date" timestamp NOT NULL,
	CONSTRAINT "modifies_pk" PRIMARY KEY ("username","info_ID")
) WITH (
  OIDS=FALSE
);



CREATE TABLE public."processing" (
	"username" varchar(255) NOT NULL,
	"airline_ID" integer NOT NULL,
	"processing_date" timestamp NOT NULL,
	CONSTRAINT "processing_pk" PRIMARY KEY ("username","airline_ID")
) WITH (
  OIDS=FALSE
);

ALTER TABLE "User" ADD CONSTRAINT "User_fk0" FOREIGN KEY ("username") REFERENCES "General_User"("username");
ALTER TABLE "Admin" ADD CONSTRAINT "Admin_fk0" FOREIGN KEY ("username") REFERENCES "General_User"("username");
ALTER TABLE "Airline" ADD CONSTRAINT "Airline_fk0" FOREIGN KEY ("gate_code") REFERENCES "Gate"("gate_ID");
ALTER TABLE "flies" ADD CONSTRAINT "flies_fk0" FOREIGN KEY ("airport_ID") REFERENCES "Airport"("airport_ID");
ALTER TABLE "flies" ADD CONSTRAINT "flies_fk1" FOREIGN KEY ("airline_ID") REFERENCES "Airline"("airline_ID");
ALTER TABLE "Announcement" ADD CONSTRAINT "Announcement_fk0" FOREIGN KEY ("username") REFERENCES "Admin"("username");
ALTER TABLE "modifies" ADD CONSTRAINT "modifies_fk0" FOREIGN KEY ("username") REFERENCES "Admin"("username");
ALTER TABLE "modifies" ADD CONSTRAINT "modifies_fk1" FOREIGN KEY ("info_ID") REFERENCES "General_info"("info_ID");
ALTER TABLE "processing" ADD CONSTRAINT "processing_fk0" FOREIGN KEY ("username") REFERENCES "Admin"("username");
ALTER TABLE "processing" ADD CONSTRAINT "processing_fk1" FOREIGN KEY ("airline_ID") REFERENCES "Airline"("airline_ID");
