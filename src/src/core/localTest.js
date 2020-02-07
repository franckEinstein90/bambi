const events = require('./events.js').events;
require('./eventRegistrarPrototype');


let ev = new events.Event(), 
    ev2 = new events.Event();

console.log(ev.state);

let reg = new events.Registrar();
reg.register(ev);
reg.register(ev2);
console.log(reg.size);
