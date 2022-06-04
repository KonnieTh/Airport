import pg from "pg";

const pool = new pg.Pool({
  user: 'postgres',
  database: 'airport',
  password: 'abcd123!',
  port: 5432,
  host: 'localhost',
})

await pool.query(`COPY public."Airport"("airport_ID","airport_name","IATA","ICAO","country","city")
FROM 'E:\Airports.csv'
DELIMITER ','
CSV HEADER;`)

await pool.query(`COPY public."General_User"("username","password","first_name","last_name","email","telephone","age","country","city", "is_admin", "sex")
FROM 'E:\Airports.csv'
DELIMITER ','
CSV HEADER;`)

await pool.query(`COPY public."Admin"("username")
FROM 'E:\Airports.csv'
DELIMITER ','
CSV HEADER;`)

await pool.query(`COPY public."User"("username")
FROM 'E:\Airports.csv'
DELIMITER ','
CSV HEADER;`)

await pool.query(`COPY public."Announcement"("announcement_ID","username","theme","ann_text","ann_date","ann_time","priority")
FROM 'E:\Airports.csv'
DELIMITER ','
CSV HEADER;`)

await pool.query(`COPY public."modifies"("username","info_ID","modification_date")
FROM 'E:\Airports.csv'
DELIMITER ','
CSV HEADER;`)

await pool.query(`COPY public."processing"("username","airline_ID","processing_date")
FROM 'E:\Airports.csv'
DELIMITER ','
CSV HEADER;`)

await pool.query(`COPY public."Gate"("gate_ID","terminal","gate_name","gate_number")
FROM 'E:\Gate.csv'
DELIMITER ','
CSV HEADER;`)

await pool.query(`COPY public."Airline"("airline_ID","airline_name","IATA","ICAO","telephone","email","gate_code")
FROM 'E:\Airline.csv'
DELIMITER ','
CSV HEADER;`)

await pool.query(`COPY public."General_info"("info_ID","title","description")
FROM 'E:\GeneralInfo.csv'
DELIMITER ','
CSV HEADER;`)

await pool.query(`COPY public."flies"("flight_ID","airport_ID","airline_ID","flight_date","expected_time","is_destination")
FROM 'E:\Flies_.csv'
DELIMITER ','
CSV HEADER;`)