const mongoose = require('mongoose');
require('dotenv').config();
if (process.argv.length!=2 && process.argv.length!=4){
    console.log('check your args:');
    process.exit(1);
}

const url = process.env.MONGODB_URI;

mongoose.set('strictQuery', false);
mongoose.connect(url);

const personSchema = new mongoose.Schema({
    name: String,
    number: String,
    id: Number
});

const Person = mongoose.model('Person', personSchema);

if (process.argv.length==2){
    // display all entries in phonebook and exit
    Person.find({}).then(result => {
        result.forEach(person => {
            console.log(person);
        });
        mongoose.connection.close();
    });
} else if (process.argv.length==4){
    //add new person. argv[2] is name, argv[3] is number. exit
    const name = process.argv[2];
    const number = process.argv[3];
    Person.create({name: name, number: number}).then(result => {
        console.log(`added ${name} number ${number} to phonebook`);
        mongoose.connection.close();
    });
}
