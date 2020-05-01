const Event = require('../../models/event');
const {transformEvent} = require('./merge');


module.exports = {

    events: async () => {
        try {
            const events = await Event.find()
            return events
                .map(event => {
                    return transformEvent(event);
                })
        } catch (error) {
            throw error;
        }
    },
    createEvent: async (args) => {
        try {
            const event = new Event({
                title: args.eventInput.title,
                description: args.eventInput.description,
                price: +args.eventInput.price,
                date: new Date(args.eventInput.date),
                creator: "5eaaf256c092ec5ac55c2e80",
            });

            let createdEvent;
            const result = await event.save()
            createdEvent = transformEvent(result);
            const creator = await User.findById('5eaaf256c092ec5ac55c2e80');
            if (!creator) {
                throw new Error('user Not found.')
            }
            creator.createdEvents.push(event);
            await creator.save();

            return createdEvent;

        } catch (error) {
            throw error;
        }
    }
}