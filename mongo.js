const mongoose = require('mongoose');
if (process.argv.length!=3 && process.argv.length!=5){
    console.log('give password as argument');
    process.exit(1);
}
const password = process.argv[2];

const url = `mongodb+srv://bmcm:${password}@cluster0.736j9hn.mongodb.net/phonebook?retryWrites=true&w=majority`;

mongoose.set('strictQuery', false);
mongoose.connect(url);

const personSchema = new mongoose.Schema({
    name: String,
    number: String,
    id: Number
});

const Person = mongoose.model('Person', personSchema);

if (process.argv.length==3){
    // display all entries in phonebook and exit
    Person.find({}).then(result => {
        result.forEach(person => {
            console.log(person);
        });
        mongoose.connection.close();
    });
} else if (process.argv.length==5){
    //add new person. argv[3] is name, argv[4] is number. exit
    const name = process.argv[3];
    const number = process.argv[4];
    Person.create({name: name, number: number}).then(result => {
        console.log(`added ${name} number ${number} to phonebook`);
        mongoose.connection.close();
    });
}