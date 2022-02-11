import express from 'express';
import { detailOrder } from '../models/detailOrder';
import Auth from '../security/auth';
import * as actions  from '../database/actions';
import Util from '../util/util';

const router = express.Router();
const util = new Util();

/**
 * @swagger
 * /detailOrders/{idOrder}:
 *   get:
 *     tags:
 *      - DetailsOrder
 *     description: get all details order from the system
 *     parameters:
 *       - in: header
 *         name: token
 *         required: true
 *         description: Unique indefiquer of client
 *         schema:
 *           type: string
 *       - in: path
 *         name: idOrder
 *         required: true
 *         description: Unique indefiquer of Order
 *         schema:
 *           type: integer
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: all details order from the system
 *         content:
 *          application/json:
 *              schema:
 *                  type: array
 *                  items:
 *                  $ref: "#/components/schemas/DetailsOrder"
 *       400:
 *         description: bad request
 *       401:
 *         description: unauthorized
 *       500:
 *         description: server error
 */
router.get('/detailOrders/:idOrder', new Auth().auth, async (req, res) => {
    let query = 'SELECT id, idOrder, idProduct FROM detailsOrder WHERE idOrder = :idOrder';
    let obj = {};
    if(req.query.limit && req.query.offset) {
        query += util.pagination(req.query.limit, req.query.offset);
        obj = { limit: parseInt(req.query.limit.toString()), offset: parseInt(req.query.offset.toString()) };
    }

    obj = { ...obj, idOrder : req.params.idOrder };
    const result: detailOrder[] = await actions.get(query, obj);
    res.json(result);
});

/**
 * @swagger
 * /detailOrder:
 *   post:
 *     tags:
 *      - DetailsOrder
 *     description: create a detail order
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
 *            $ref: '#/components/schemas/DetailsOrder'
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
 *                  $ref: "#/components/schemas/DetailsOrder"
 *       400:
 *         description: bad request
 *       401:
 *         description: unauthorized
 *       500:
 *         description: server error
 */
router.post('/detailOrder', new Auth().auth, async (req, res)=> {
    const detailOrder: detailOrder = req.body;
    let result;
    result = await actions.create(`INSERT INTO detailOrders (idOrder, idProduct) 
    VALUES (:idOrder, :idProduct)`, detailOrder);
    if(result.error) {
        res.status(500).json(result.message);
    } else {
        detailOrder.id = result[0];
        res.json(detailOrder);
    } 
});

/**
 * @swagger
 * /detailOrder/{id}:
 *   delete:
 *     tags:
 *      - DetailsOrder
 *     description: delete a detail order
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
 *         description: Unique indefiquer of detail order
 *         schema:
 *           type: string
 *     requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            $ref: '#/components/schemas/DetailsOrder'
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: detail order deleted
 *         content:
 *          application/json:
 *              schema:
 *                  type: object
 *                  items:
 *                  $ref: "#/components/schemas/DetailsOrder"
 *       400:
 *         description: bad request
 *       401:
 *         description: unauthorized
 *       500:
 *         description: server error
 */
router.delete('/detailOrder/:id', new Auth().auth, async (req, res)=> {
    const detailOrder: detailOrder = { ...req.body, id : req.params.id };
    let result;
    result = await actions.deleteQuery(`DELETE * FROM detailOrders WHERE id = :id`, detailOrder);
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
 *     DetailsOrder:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           description: The detail order id.
 *           example: 1
 *         idOrder:
 *           type: integer
 *           description: The order's id.
 *           example: 1
 *         idProduct:
 *           type: integer
 *           description: The product's id.
 *           example: 1
 */