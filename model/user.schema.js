import mongoose from 'mongoose';

// Schema for user
const userSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true,
        trim: true,
        max: 25,
        validate: {
            validator: (v) => /^[a-zA-Z]+$/.test(v),
            message: "Please enter a valid first name"
        }
    },
    lastName: {
        type: String,
        required: true,
        trim: true,
        max: 25,
        validate: {
            validator: (v) => /^[a-zA-Z]+$/.test(v),
            message: "Please enter a valid last name"
        }
    },
    email: {
        type: String,
        required: true,
        unique: true,
        validate: {
            validator: (v) => /^[a-zA-Z0-9+_.-]+@[a-zA-Z0-9.-]+$/.test(v),
            message: "Please enter a valid email"
        }
    },
    password: {
        type: String,
        required: true,
        validate: {
            validator: (v) => /^(?=.{8,})(?=.*[a-z])(?=.*[A-Z])(?=.*[@#$%^&+=]).*$/.test(v),
            message: "Please enter a valid password"
        }
    },
    mobile: {
        type: String,
        required: true,
        validate: {
            validator: (v) => /[6789][0-9]{9}/.test(v),
            message: "Please enter a valid mobile number"
        }
    },
    gender: {
        type: String,
        required: true,
        enum: ["Male", "Female", "Other"]
    },
    token: {
        type: String
    }
}, {
    timestamps: true
});

export default mongoose.model('User', userSchema);
