import express from 'express';
import { order } from '../models/order';
import Auth from '../security/auth';
import * as actions  from '../database/actions';
import Util from '../util/util';

const router = express.Router();
const util = new Util();

/**
 * @swagger
 * /orders:
 *   get:
 *     tags:
 *      - Orders
 *     description: get all orders from the system
 *     parameters:
 *       - in: header
 *         name: token
 *         required: true
 *         description: Unique indefiquer of client
 *         schema:
 *           type: string
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: all orders from the system
 *         content:
 *          application/json:
 *              schema:
 *                  type: array
 *                  items:
 *                  $ref: "#/components/schemas/Orders"
 *       400:
 *         description: bad request
 *       401:
 *         description: unauthorized
 *       500:
 *         description: server error
 */
router.get('/orders', new Auth().auth, async (req: any, res) => {
    let query = `SELECT o.id as idOrder, o.date, o.idUser 
    FROM orders as o 
    INNER JOIN users as u ON o.idUser = u.id 
    WHERE u.email = :email`;
    let obj = {};
    if(req.query.limit && req.query.offset) {
        query += util.pagination(req.query.limit, req.query.offset);
        obj = { limit: parseInt(req.query.limit.toString()), offset: parseInt(req.query.offset.toString()) };
    }

    obj = { ...obj, email : req.user };
    const result: order[] = await actions.get(query, obj);
    res.json(result);
});

/**
 * @swagger
 * /order:
 *   post:
 *     tags:
 *      - Orders
 *     description: create a order
 *     parameters:
 *       - in: header
 *         name: token
 *         required: true
 *         description: Unique indefiquer of client
 *         schema:
 *           type: string
 *     requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            $ref: '#/components/schemas/Orders'
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
 *                  $ref: "#/components/schemas/Orders"
 *       400:
 *         description: bad request
 *       401:
 *         description: unauthorized
 *       500:
 *         description: server error
 */
router.post('/order', new Auth().auth, async (req, res)=> {
    const order: order = req.body;
    order.idUser = parseInt(order.idUser.toString())
    let result;
    result = await actions.create(`INSERT INTO orders (date, idUser) 
    VALUES (:date, :idUser)`, order);
    if(result.error) {
        res.status(500).json(result.message);
    } else {
        order.id = result[0];
        res.json(order);
    } 
});

/**
 * @swagger
 * /order/{id}:
 *   delete:
 *     tags:
 *      - Orders
 *     description: delete a order
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
 *         description: Unique indefiquer of order
 *         schema:
 *           type: string
 *     requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            $ref: '#/components/schemas/Orders'
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: order deleted
 *         content:
 *          application/json:
 *              schema:
 *                  type: object
 *                  items:
 *                  $ref: "#/components/schemas/Orders"
 *       400:
 *         description: bad request
 *       401:
 *         description: unauthorized
 *       500:
 *         description: server error
 */
router.delete('/order/:id', new Auth().auth, async (req, res)=> {
    const order: order = { ...req.body, id : req.params.id };
    let result;
    result = await actions.deleteQuery(`DELETE * FROM orders WHERE id = :id`, order);
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
 *     Orders:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           description: The order's id.
 *           example: 1
 *         date:
 *           type: string
 *           description: The date when was created the order.
 *           example: 02-10-2022
 *         idUser:
 *            type: string
 *            description: The user who create the order.
 *            example: 1
 */