const Booking = require('../models/Booking');


module.exports = {
    async store(req, res){
        const {booking_id } = req.params;
    
        const booking = await Booking.findById(booking_id).populate('spot');
        booking.approved = false;
        booking.save();
        // obtém a conexão socket do solicitante da reserva do espaço
        const bookingUserSocket = req.connectedUsers[booking.user];
        if(bookingUserSocket){
            // caso o usuário possua um socket aberto, é emitida uma mensagem
            // contendo as informações do booking
            req.io.to(bookingUserSocket).emit('booking_response', booking);
        }
        return res.json(booking);
    }
}