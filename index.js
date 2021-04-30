const parse = require('csv-parse');
const fs = require('fs'); 

const habitablePlanets = []

isHabitablePlanet = (planet) => {
    return planet['koi_disposition'] === 'CONFIRMED' 
    && planet['koi_insol'] > 0.36 
    && planet['koi_insol'] < 1.11
    && planet['koi_prad' ] < 1.6;
}

// Event chaining to read our files
fs.createReadStream('./planets/kepler_data.csv')
    // Connecting two sources togethter
    // The pipe function is meant to connect a readable stream source to a writable stream destination. 
    // kepler file = source, parse function = destination for our pipe. 
    // readable.pipe(writable);
    .pipe(parse({
        comment: '#',
        // Returns key value pairs rather than an array of pure values
        columns: true
    }))
    .on('data', (data) => {
        if(isHabitablePlanet(data)){
            habitablePlanets.push(data);
        }
    })
    .on('error', (err) => {
        console.log(err)
    })
    .on('end', () => {
        // .map function takes a callback from an array that for each item in that array, 
        // for that item it processes it somehow and returns a new value
        console.log(habitablePlanets.map((planet) => {
            return planet['kepler_name'];
        }))
        console.log(`${habitablePlanets.length} habitable planets were found!`)
    });

// parse() returns an eventEmitter
 