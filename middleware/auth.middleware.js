import jwt from 'jsonwebtoken'; // Importing web token
import User from '../model/user.schema.js'; // Importing userSchema

// Function: verifyUser authentication middleware
const verifyUser = async (req, res, next) => {
    const token = req.header("Authorization")?.replace("Bearer ", "");
    
    if (!token) {
        return res.status(401).send({
            message: 'Unauthorized, please login',
            statusCode: 401
        });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        const user = await User.findOne({ _id: decoded._id });

        if (!user) {
            return res.status(400).send({
                message: 'Invalid token, please login',
                statusCode: 400
            });
        }

        req.token = token;
        req.user = user;

        next();

    } catch (e) {
        return res.status(400).send({
            message: 'Something went wrong, please try again.',
            statusCode: 400
        });
    }
};

export default verifyUser;
