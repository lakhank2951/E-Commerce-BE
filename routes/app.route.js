import verifyUser from "../middleware/auth.middleware.js";
import * as User from '../controller/user.controller.js';
import * as Product from '../controller/product.controller.js';
const routes = (app) => {
    /**
     * @openapi
     * /api/healthcheck:
     *  get:
     *     tags:
     *     - Healthcheck
     *     description: Responds if the app is up and running
     *     security:
     *       - bearerAuth: []
     *     responses:
     *       200:
     *         description: App is up and running
     */
    app.get("/api/healthcheck", (req, res) => res.sendStatus(200));

    /**
     * @openapi
     * /api/register:
     *  post:
     *     tags:
     *     - User
     *     description: Register a new user
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             type: object
     *             properties:
     *               firstName:
     *                 type: string
     *                 description: First name of the user
     *               lastName:
     *                 type: string
     *                 description: Last name of the user
     *               email:
     *                 type: string
     *                 description: Email address of the user
     *               password:
     *                 type: string
     *                 description: Password for the user account
     *               mobile:
     *                 type: string
     *                 description: Mobile number of the user
     *               gender:
     *                 type: string
     *                 description: Gender of the user
     *     responses:
     *       200:
     *         description: User registered successfully
     */
    app.post('/api/register', User.register);

    /**
     * @openapi
     * /api/login:
     *  post:
     *     tags:
     *     - User
     *     description: Login a user
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             type: object
     *             properties:
     *               email:
     *                 type: string
     *                 description: Email address of the user
     *               password:
     *                 type: string
     *                 description: Password for the user account
     *     responses:
     *       200:
     *         description: User logged in successfully
     */
    app.post('/api/login', User.login);

    /**
     * @openapi
     * /api/profileDetails:
     *  get:
     *     tags:
     *     - User
     *     description: Get user profile details
     *     security:
     *       - bearerAuth: []
     *     responses:
     *       200:
     *         description: User profile details retrieved successfully
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 message:
     *                   type: string
     *                 statusCode:
     *                   type: integer
     *                 data:
     *                   type: object
     *                   properties:
     *                     _id:
     *                       type: string
     *                     firstName:
     *                       type: string
     *                     lastName:
     *                       type: string
     *                     email:
     *                       type: string
     *                     mobile:
     *                       type: string
     *                     gender:
     *                       type: string
     *       400:
     *         description: Invalid Token or Something Went Wrong
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 message:
     *                   type: string
     *                 statusCode:
     *                   type: integer
     */
    app.get('/api/profileDetails', verifyUser, User.profileDetails);

    /**
     * @openapi
     * /api/logout:
     *  get:
     *     tags:
     *     - User
     *     description: Logout the current logged-in user
     *     security:
     *       - bearerAuth: []
     *     responses:
     *       200:
     *         description: Logout Successful
     *       400:
     *         description: Something Went Wrong, Please Try Again
     */
    app.get('/api/logout', verifyUser, User.logout);

    /**
     * @openapi
     * /api/addProduct:
     *   post:
     *     tags:
     *       - Product
     *     description: Add a new product to the inventory
     *     security:
     *       - bearerAuth: []
     *     requestBody:
     *       required: true
     *       content:
     *         multipart/form-data:
     *           schema:
     *             type: object
     *             properties:
     *               name:
     *                 type: string
     *                 description: Name of the product
     *                 example: "Sample Product"
     *               price:
     *                 type: string
     *                 description: Price of the product in decimal format
     *                 example: "29.99"
     *               description:
     *                 type: string
     *                 description: Brief description of the product
     *                 example: "High-quality product"
     *               file:
     *                 type: string
     *                 format: binary
     *                 description: Image file for the product (PNG or JPEG format)
     *     responses:
     *       201:
     *         description: Product created successfully
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 message:
     *                   type: string
     *                   example: "Product created successfully"
     *                 product:
     *                   type: object
     *                   properties:
     *                     _id:
     *                       type: string
     *                       example: "61b73ab4e45e25b00404a8f9"
     *                     name:
     *                       type: string
     *                       example: "Sample Product"
     *                     price:
     *                       type: string
     *                       example: "29.99"
     *                     description:
     *                       type: string
     *                       example: "High-quality product"
     *                     file:
     *                       type: string
     *                       example: "uploads/sample-product.png"
     *       400:
     *         description: Validation error or missing fields
     *       500:
     *         description: Server error
     */
    app.post('/api/addProduct', verifyUser, Product.addProduct);


    /**
     * @openapi
     * /api/products:
     *   get:
     *     tags:
     *       - Product
     *     description: Retrieve a list of all products from the inventory
     *     security:
     *       - bearerAuth: []
     *     responses:
     *       200:
     *         description: Successfully retrieved the list of products
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 message:
     *                   type: string
     *                   example: "Products retrieved successfully."
     *                 statusCode:
     *                   type: integer
     *                   example: 200
     *                 data:
     *                   type: array
     *                   items:
     *                     type: object
     *                     properties:
     *                       _id:
     *                         type: string
     *                         example: "61b73ab4e45e25b00404a8f9"
     *                       name:
     *                         type: string
     *                         example: "Sample Product"
     *                       price:
     *                         type: string
     *                         example: "29.99"
     *                       description:
     *                         type: string
     *                         example: "High-quality product"
     *                       file:
     *                         type: string
     *                         example: "uploads/sample-product.png"
     *       400:
     *         description: Something went wrong, please try again.
     *       500:
     *         description: Server error
     */
    app.get('/api/products', verifyUser, Product.getAllProducts);

    /**
     * @openapi
     * /api/product/{productId}:
     *   delete:
     *     tags:
     *       - Product
     *     description: Delete a product from the inventory by its ID
     *     security:
     *       - bearerAuth: []
     *     parameters:
     *       - in: path
     *         name: productId
     *         required: true
     *         description: The ID of the product to delete.
     *         schema:
     *           type: string
     *           example: "61b73ab4e45e25b00404a8f9"  # Example product ID
     *     responses:
     *       200:
     *         description: Successfully deleted the product
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 message:
     *                   type: string
     *                   example: "Product deleted successfully."
     *                 statusCode:
     *                   type: integer
     *                   example: 200
     *       400:
     *         description: Invalid product ID or bad request
     *       404:
     *         description: Product with the specified ID not found
     *       500:
     *         description: Internal server error
     */
    app.delete('/api/product/:productId', verifyUser, Product.deleteProduct);

    /**
     * @openapi
     * /api/product/{productId}:
     *   get:
     *     tags:
     *       - Product
     *     description: Retrieve a specific product by its ID
     *     security:
     *       - bearerAuth: []
     *     parameters:
     *       - name: productId
     *         in: path
     *         required: true
     *         description: The ID of the product to retrieve
     *         schema:
     *           type: string
     *           example: "61b73ab4e45e25b00404a8f9"
     *     responses:
     *       200:
     *         description: Successfully retrieved the product details
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 message:
     *                   type: string
     *                   example: "Product retrieved successfully."
     *                 statusCode:
     *                   type: integer
     *                   example: 200
     *                 data:
     *                   type: object
     *                   properties:
     *                     _id:
     *                       type: string
     *                       example: "61b73ab4e45e25b00404a8f9"
     *                     name:
     *                       type: string
     *                       example: "Sample Product"
     *                     price:
     *                       type: string
     *                       example: "29.99"
     *                     description:
     *                       type: string
     *                       example: "High-quality product"
     *                     file:
     *                       type: string
     *                       example: "uploads/sample-product.png"
     *       400:
     *         description: Invalid product ID provided
     *       404:
     *         description: Product not found
     *       500:
     *         description: Server error
     */
    app.get('/api/product/:productId', verifyUser, Product.getProductById);

    /**
     * @openapi
     * /api/product/{productId}:
     *   put:
     *     tags:
     *       - Product
     *     description: Update an existing product by ID
     *     security:
     *       - bearerAuth: []
     *     parameters:
     *       - name: productId
     *         in: path
     *         required: true
     *         description: The ID of the product to update
     *         schema:
     *           type: string
     *           example: "61b73ab4e45e25b00404a8f9"
     *     requestBody:
     *       required: true
     *       content:
     *         multipart/form-data:
     *           schema:
     *             type: object
     *             properties:
     *               name:
     *                 type: string
     *                 description: Name of the product
     *                 example: "Updated Product"
     *               price:
     *                 type: string
     *                 description: Price of the product in decimal format
     *                 example: "39.99"
     *               description:
     *                 type: string
     *                 description: Brief description of the product
     *                 example: "Updated high-quality product"
     *               file:
     *                 type: string
     *                 format: binary
     *                 description: Image file for the product (PNG or JPEG format)
     *                 nullable: true
     *     responses:
     *       200:
     *         description: Product updated successfully
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 message:
     *                   type: string
     *                   example: "Product updated successfully"
     *                 product:
     *                   type: object
     *                   properties:
     *                     _id:
     *                       type: string
     *                       example: "61b73ab4e45e25b00404a8f9"
     *                     name:
     *                       type: string
     *                       example: "Updated Product"
     *                     price:
     *                       type: string
     *                       example: "39.99"
     *                     description:
     *                       type: string
     *                       example: "Updated high-quality product"
     *                     file:
     *                       type: string
     *                       example: "uploads/updated-product.png"
     *       400:
     *         description: Validation error or missing fields
     *       404:
     *         description: Product not found
     *       500:
     *         description: Server error
     */
    app.put('/api/product/:productId', verifyUser, Product.updateProductById);

}

export default routes;