import mongoose from 'mongoose';

// Schema for product
const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
        max: 25,
        validate: {
            validator: (v) => /^[a-zA-Z]+$/.test(v),
            message: "Please enter a valid product name"
        }
    },
    price: {
        type: String,
        required: true,
        validate: {
            validator: (v) => /^\d+(\.\d+)?$/.test(v),
            message: "Please enter a valid product price"
        }
    },
    description: {
        type: String,
        required: true,
        trim: true,
        max: 50,
        validate: {
            validator: (v) => /^[a-zA-Z]+$/.test(v),
            message: "Please enter a valid product description"
        }
    },
    file: {
        type: String,
        required: true
    }
}, {
    timestamps: true
});

export default mongoose.model('Product', productSchema);
