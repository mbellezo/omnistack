const Booking = require('../models/Booking');


module.exports = {
    async store(req, res){
        const {user_id} = req.headers;
        const {spot_id} = req.params;
        const {date } = req.body;

        // Realiza a criação de uma reserva de espaço
        const booking = await Booking.create({
            user: user_id,
            spot: spot_id,
            date,

        })

        // Realiza o preenchimento dos dados dos objetos relacionados ao booking.
        await booking.populate('spot' ).populate('user').execPopulate();

        // obtém a conexão socket proprietário do espaço sendo reservado
        const ownerSocket = req.connectedUsers[booking.spot.user];
        if(ownerSocket){
            // caso o usuário possua um socket aberto, é emitida uma mensagem
            // contendo as informações do booking
            req.io.to(ownerSocket).emit('booking_request', booking);
        }

        return res.json(booking);
    }
}
