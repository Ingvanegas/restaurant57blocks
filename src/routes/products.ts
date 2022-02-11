import express from 'express';
import { product } from '../models/product';
import Auth from '../security/auth';
import * as actions  from '../database/actions';
import Util from '../util/util';

const router = express.Router();
const util = new Util();

/**
 * @swagger
 * /products:
 *   get:
 *     tags:
 *      - Products
 *     description: get all products from the system
 *     parameters:
 *       - in: query
 *         name: limit
 *         required: false
 *         description: 
 *         schema:
 *           type: integer
 *       - in: query
 *         name: offset
 *         required: false
 *         description: 
 *         schema:
 *           type: integer
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: all products from the system
 *         content:
 *          application/json:
 *              schema:
 *                  type: array
 *                  items:
 *                  $ref: "#/components/schemas/Products"
 *       400:
 *         description: bad request
 *       401:
 *         description: unauthorized
 *       500:
 *         description: server error
 */
router.get('/products', async (req, res) => {
    let query = 'SELECT id, name, description, price FROM products';
    let obj = {};
    if(req.query.limit && req.query.offset) {
        query += util.pagination(req.query.limit, req.query.offset);
        obj = { limit: parseInt(req.query.limit.toString()), offset: parseInt(req.query.offset.toString()) };
    }
    const result: product[] = await actions.get(query, obj);
    res.json(result);
});

/**
 * @swagger
 * /product:
 *   post:
 *     tags:
 *      - Products
 *     description: create a product
 *     requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            $ref: '#/components/schemas/Products'
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: product created
 *         content:
 *          application/json:
 *              schema:
 *                  type: object
 *                  items:
 *                  $ref: "#/components/schemas/Products"
 *       400:
 *         description: bad request
 *       401:
 *         description: unauthorized
 *       500:
 *         description: server error
 */
router.post('/product', async (req, res)=> {
    const product: product = req.body;
    let result;
    result = await actions.create(`INSERT INTO products (name, description, price) 
    VALUES (:name, :description, :price)`, product);
    if(result.error) {
        res.status(500).json(result.message);
    } else {
        product.id = result[0];
        res.json(product);
    } 
});

/**
 * @swagger
 * /product/{id}:
 *   put:
 *     tags:
 *      - Products
 *     description: edit a product
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Unique indefiquer of product
 *         schema:
 *           type: string
 *     requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            $ref: '#/components/schemas/Products'
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: product updated
 *         content:
 *          application/json:
 *              schema:
 *                  type: object
 *                  items:
 *                  $ref: "#/components/schemas/Products"
 *       400:
 *         description: bad request
 *       401:
 *         description: unauthorized
 *       500:
 *         description: server error
 */
router.put('/product/:id', async (req, res)=> {
    const product: product = { ...req.body, id : req.params.id };
    let result;
    result = await actions.update(`UPDATE SET products name = :name, description = :description, price = :price WHERE id = :id`, product);
    if(result.error) {
        res.status(500).json(result.message);
    } else {
        res.json(result);
    } 
});

/**
 * @swagger
 * /product/{id}:
 *   delete:
 *     tags:
 *      - Products
 *     description: delete a product
 *     parameters:
 *       - in: header
 *         name: token
 *         required: true
 *         description: Unique indefiquer of client
 *         schema:
 *           type: string
 *       - in: path
 *         name: id
 *         required: true
 *         description: Unique indefiquer of product
 *         schema:
 *           type: string
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: id of product deleted
 *         content:
 *          application/json:
 *              schema:
 *                  type: integer
 *       400:
 *         description: bad request
 *       401:
 *         description: unauthorized
 *       500:
 *         description: server error
 */
router.delete('/product/:id', new Auth().auth, async (req, res)=> {
    const product: product = { ...req.body, id : req.params.id };
    let result;
    result = await actions.deleteQuery(`DELETE * FROM products WHERE id = :id`, product);
    if(result.error) {
        res.status(500).json(result.message);
    } else {
        res.json(result);
    } 
});

export default router;

/**
 * @swagger
 * components:
 *   schemas:
 *     Products:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           description: The product's id.
 *           example: 1
 *         name:
 *           type: string
 *           description: The name of the product.
 *           example: product test
 *         description:
 *            type: string
 *            description: The description of the product.
 *            example: a description
 *         price:
 *           type: integer
 *           description: The product price.
 *           example: 100
 */