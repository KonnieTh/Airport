# Airport

Οδηγίες εγκατάστασης:

-Υπάρχει πρόσβαση στο site μέσω του δημόσιου URL που φαίνεται στο Heroku-link.txt.

-Αν κάποιος επιθυμεί να τρέξει τοπικά το project μας, πρέπει να διαθέτει Nodejs, Visual Studio Code, DBeaver 
και Postgres κατεβασμένες στον προσωπικό του υπολογιστή. Έπειτα να κατεβάσει το project από το github μας 
(το link φαίνεται στο Github-link.txt) και να το βάλει σε έναν φάκελο τον, οποίο έπειτα θα ανοίξει με το 
Visual Studio Code. Στη συνέχεια πρέπει να φτιάξει τη βάση στο Postgres, αυτό μπορεί να το κάνει ανοίγοντας 
τo DBeaver και έπειτα να επιλέξει δημιουργία νέας βάσης με όνομα airport. Έπειτα θα επιλέξει να γράψει ένα 
SQL script στη βάση που δημιούργησε και θα κάνει copy-paste τον κώδικα που βρίσκεται στο αρχείο 
/data/Airport_creation_pg.sql στο script και θα το τρέξει. Έτσι θα δημιουργηθούν οι πίνακες στη βάση.

Έπειτα στην Terminal του Visual Studio Code θα τρέξει την εντολή: 
npm install
και αν δημιουργηθεί θέμα με vulnerabilities θα τρέξει στην terminal την εντολή:
npm audit fix --force
Έτσι θα εγκατασταθούν όλα τα dependencies από το package.json

Εν συνεχεία θα αντικαστήσει στο αρχείο /data/fill_database.mjs και στο αρχείο /model/heroku-pg/airport-queries.js το κομμάτι που βρίσκεται στην αρχή
του κώδικα:

const pool = new pg.Pool({
  connectionString: process.env.DATABASE_URL, //μεταβλητή περιβάλλοντος
  ssl: {
    rejectUnauthorized: false
  }
});

Με το παρακάτω:

const pool = new pg.Pool({
  user: 'postgres',
  database: 'airport',
  password: 'ΚΩΔΙΚΟΣ',
  port: 5432,
  host: 'localhost',
})
και στο password: 'ΚΩΔΙΚΟΣ' θα βάλει τον κωδικό του στο Postgres. Έπειτα θα προσαρμόσει το path
που φαίνεται στα queries στη βάση:

await pool.query(`COPY public."Airport"("airport_ID","airport_name","IATA","ICAO","country","city")
FROM 'E:\Airports.csv'
DELIMITER ','
CSV HEADER;`)

στο FROM '...csv' με το path που έχει τα αρχεία των .csv (κατά προτίμηση μην είναι ο C:/ γιατί έχει
θέμα) εναλλακτικά υπάρχει επιλογή στην εφαρμογή της Postgres να κάνει εισαγωγή δεδομένων.
Έπειτα αν επίλεξε να προσθέσει τα .csv μέσω κώδικα θα πρέπει να τρέξει την εξής εντολή στην terminal:
node /data/fill_database.mjs και αν όλα πήγαν καλά θα έχει γεμίσει η βάση με τα δεδομένα.

Έπειτα για να ανοίξει την ιστοσελίδα μας θα γράψει στην Terminal την εντολή:
npm run start 

Και τέλος θα ανοίξει τον browser και θα αναζητήσει το: 
http://localhost:3000/ 
και θα εμφανιστεί η σελίδα μας.
