import dotenv from 'dotenv'

if (process.env.NODE_ENV !== 'production') {
    dotenv.config();
}

import { Airport } from './app.mjs';

const port = process.env.PORT || '3000';

const server = Airport.listen(port, () => { console.log("Listening to port " + port) });

process.on('SIGTERM', () => {
    console.info('SIGTERM signal received.');
    console.log('Closing http server.');
    server.close(() => {
        console.log('Http server closed.');
    });
});





