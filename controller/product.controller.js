import Product from '../model/product.schema.js';
import multer from 'multer';
import path from 'path';
import fs from 'fs';

// Multer setup
const uploadDirectory = 'uploads';
if (!fs.existsSync(uploadDirectory)) {
    fs.mkdirSync(uploadDirectory);
}

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadDirectory);
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, uniqueSuffix + path.extname(file.originalname));
    }
});

const upload = multer({
    storage: storage,
    fileFilter: (req, file, cb) => {
        const allowedTypes = /jpeg|jpg|png/;
        const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
        const mimetype = allowedTypes.test(file.mimetype);

        if (extname && mimetype) {
            cb(null, true);
        } else {
            cb(new Error('Only JPG, JPEG, and PNG formats are allowed'));
        }
    }
}).single('file'); // Assuming single file upload

export const addProduct = async (req, res) => {
    upload(req, res, async (err) => {
        if (err) {
            return res.status(400).send({
                message: err.message,
                statusCode: 400
            });
        }

        const { name, price, description } = req.body;
        const filePath = req.file ? `uploads/${req.file.filename}` : null;

        if (!filePath) {
            return res.status(400).send({
                message: 'File is required and must be an image',
                statusCode: 400
            });
        }

        try {
            const product = new Product({
                name,
                price,
                description,
                file: filePath
            });

            await product.save();

            return res.status(201).send({
                message: 'Product added successfully.',
                statusCode: 201,
                data: product
            });

        } catch (e) {
            console.error(e);
            return res.status(500).send({
                message: 'Something went wrong, please try again.',
                statusCode: 500
            });
        }
    });
};

export const getAllProducts = async (req, res) => {
    try {
        const products = await Product.find({}, '-__v');

        return res.status(200).send({
            message: 'Products retrieved successfully.',
            statusCode: 200,
            data: products
        });
    } catch (e) {
        return res.status(400).send({
            message: 'Something went wrong, please try again.',
            statusCode: 400
        });
    }
}

export const deleteProduct = async (req, res) => {
    const { productId } = req.params;

    if(!productId) {
        return res.status(400).send({
            message: 'Product ID is required',
            statusCode: 400
        })
    }

    try {
        const product = await Product.findByIdAndDelete(productId);

        if(!product) {
            return res.status(400).send({
                message: 'Product not found',
                statusCode: 404
            })
        }

        return res.status(200).send({
            message: 'Product deleted successfully',
            statusCode: 200
        })

    } catch(err) {
        return res.status(400).send({
            message: 'Something went wrong, please try again.',
            statusCode: 400
        })
    }
}

export const getProductById = async (req, res) => {
    const { productId } = req.params;

    if(!productId) {
        return res.status(400).send({
            message: 'Product ID is required',
            statusCode: 400
        })
    }

    try {
        const product = await Product.findById(productId);

        if(!product) {
            return res.status(400).send({
                message: 'Product not found',
                statusCode: 404
            })
        }

        return res.status(200).send({
            message: 'Product fetched successfully',
            statusCode: 200,
            data: product
        })

    } catch(err) {
        return res.status(400).send({
            message: 'Something went wrong, please try again.',
            statusCode: 400
        })
    }
}

export const updateProductById = async (req, res) => {
    const { productId } = req.params;

    if (!productId) {
        return res.status(400).send({
            message: 'Product ID is required',
            statusCode: 400
        });
    }

    upload(req, res, async (err) => {
        if (err) {
            return res.status(400).send({
                message: err.message,
                statusCode: 400
            });
        }

        const { name, price, description } = req.body;
        let file = req.file ? `uploads/${req.file.filename}` : null;

        try {
            const existingProduct = await Product.findById(productId);

            if (!existingProduct) {
                return res.status(404).send({
                    message: 'Product not found',
                    statusCode: 404
                });
            }

            if (!file) {
                // Use the existing product's file if no new file is uploaded
                file = existingProduct.file;
            }

            const updatedProduct = await Product.findByIdAndUpdate(
                productId,
                { name, price, description, file },
                { new: true }
            );

            return res.status(200).send({
                message: 'Product updated successfully',
                statusCode: 200,
                product: updatedProduct
            });

        } catch (err) {
            return res.status(500).send({
                message: 'Something went wrong, please try again.',
                statusCode: 500
            });
        }
    });
};