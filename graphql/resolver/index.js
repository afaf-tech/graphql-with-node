const bcrypt = require('bcryptjs');


const Event = require('../../models/event');
const User = require('../../models/users');


const events = async eventIds => {
    try{
        const events = await Event.find({ _id: { $in: eventIds}})
        return events.map(event => {
            return {
                    ...event._doc,
                    _id: event.id,
                    date: new Date(event._doc.date).toISOString(),
                    creator: user.bind(this, event.creator)
            }
        })
    }catch(err){
        throw err;
    }
}

const user = async userId => {
    try {
        const user = await User.findById(userId)
            return {
                ...user._doc,
                 _id: user.id,
                  createdEvents: events.bind(this, user._doc.createdEvents)
            };
    } catch (error) {
        throw error;
    }
   
}


module.exports = {
    events: async ()=> {
        try {
            const events = await Event.find()
            return events
                .map(event =>{
                    return {
                        ...event._doc, 
                        _id: event.id,
                        date:new Date(event.date).toISOString(),
                        creator: user.bind(this, event._doc.creator),
                    };
                })
        } catch (error) {
            throw error;
        }
    },
    createEvent: async (args)=>{
        try {
            const event = new Event({
                title: args.eventInput.title,
                description: args.eventInput.description,
                price: +args.eventInput.price,
                date: new Date(args.eventInput.date),
                creator:"5eaaf256c092ec5ac55c2e80",
            });
    
            let createdEvent;
            const result = await event.save()
                    createdEvent = {
                        ...result._doc,
                         _id: event.id,
                         date: new Date(event._doc.date).toISOString(),
                         creator: user.bind(this, result._doc.creator)
                        };
            const creator = await User.findById('5eaaf256c092ec5ac55c2e80');
                if(!creator){
                    throw new Error('user Not found.')
                }
            creator.createdEvents.push(event);
            await creator.save();
    
            return createdEvent;
            
        } catch (error) {
            throw error;
        }
    },
    createUser: async (args)=>{
        try {
            // find user with the same email address
            const existingUser = await User.findOne({email:args.userInput.email})
                    if(existingUser){
                        throw new Error(' User exists already.')
                    }
            const hashedPassword = await  bcrypt
                    .hash(args.userInput.password, 12)
                const user = new User({
                    email: args.userInput.email,
                    password: hashedPassword
                });
            const result = await user.save();
            return { ...result._doc,password:null, _id: result.id };
            
        } catch (error) {
            throw error;
        }
    }
}