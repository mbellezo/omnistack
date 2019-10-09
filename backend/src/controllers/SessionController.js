// index -> Listagem de sessões
// show -> Listar uma única sessão,
// store -> Criar uma nova sessão, 
//update -> Alterar uma sessão,
// destroy -> Eliminar uma sessão

// Realiza a composição com o Model User
const User = require('../models/User');

module.exports = {
    async store(req, res){
        // Extrai o valor do email do conteúdo JSON do Body utilizando notação mimificada do JavaScript
        const { email } = req.body;

        // Consulta a existência do usuário na sessão
        let user = await User.findOne({email});
        if (!user){
            // Caso não exista será criado um novo registro
            user = await User.create({email});
        }

        return res.json(user);

    }

};