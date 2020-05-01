const User = require('../../models/users');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

module.exports = {
    createUser: async (args) => {
        try {
            // find user with the same email address
            const existingUser = await User.findOne({ email: args.userInput.email })
            if (existingUser) {
                throw new Error(' User exists already.')
            }
            const hashedPassword = await bcrypt
                .hash(args.userInput.password, 12)
            const user = new User({
                email: args.userInput.email,
                password: hashedPassword
            });
            const result = await user.save();
            return { ...result._doc, password: null, _id: result.id };

        } catch (error) {
            throw error;
        }
    },
    login: async ({email, password}) =>{
        const user = await User.findOne({email: email});
        if(!user) {
            throw new Error("User doesn\'t exist");
        }
        const isEqual = await bcrypt.compare(password, user.password);
        if(!isEqual){
            throw new Error(`Password is incorrect.`);
        }
        const token = await jwt.sign({
                userId: user.id,
                email: user.email
            },
            'somesupersecretkey',
            {
                expiresIn:'1h'
            }
        );

        return {
            userId:user.id, 
            token:token,
             tokenExpiration: 1
        }

    }
}