const Booking = require('../../models/booking');
const Event = require('../../models/event');

const  { transformBooking, transformEvent} = require('./merge');

module.exports = {
    bookings: async (args, req) => {
        if(!req.isAuth){
            throw new Error('Unauthenticated');
        }
        try {
            const bookings = await Booking.find();
            return bookings.map(booking => {
                return transformBooking(booking);
            })

        } catch (error) {
            throw error;
        }
    },
  
    bookEvent: async (args, req) => {
        if(!req.isAuth){
            throw new Error('Unauthenticated');
        }
        try {
            const fetchedEvent = await Event.findOne({ _id: args.eventId })
            const booking = new Booking({
                user: req.userId,
                event: fetchedEvent
            });

            const result = await booking.save();
            return transformBooking(result);
        } catch (error) {
            throw error;
        }
    },
    cancelBooking: async (args,req) => {
        if(!req.isAuth){
            throw new Error('Unauthenticated');
        }
        try {
            const booking = await Booking.findById(args.bookingId).populate('event');
            const event = transformEvent(booking.event);

            await Booking.deleteOne({_id:args.bookingId});
            return event;

        } catch (error) {
            throw error;
        }
    }
}