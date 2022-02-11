import express from 'express';
import { user } from '../models/user';
import Auth from '../security/auth';
import ValidateEmail from '../middleware/validateEmail';
import ValidatePassword from '../middleware/validatePassword';
import * as actions  from '../database/actions';
import Util from '../util/util';

const router = express.Router();
const validateEmail = new ValidateEmail();
const validatePassword = new ValidatePassword();
const util = new Util();

/**
 * @swagger
 * /users:
 *   get:
 *     tags:
 *      - Users
 *     description: get all users from the system
 *     parameters:
 *       - in: header
 *         name: token
 *         required: true
 *         description: Unique indefiquer of user
 *         schema:
 *           type: string
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: all users from the system
 *         content:
 *          application/json:
 *              schema:
 *                  type: array
 *                  items:
 *                  $ref: "#/components/schemas/Users"
 *       400:
 *         description: bad request
 *       401:
 *         description: unauthorized
 *       500:
 *         description: server error
 */
router.get('/users', new Auth().auth, async (req, res) => {
    let query = 'SELECT id, email, password FROM Users';
    let obj = {};
    if(req.query.limit && req.query.offset) {
        query += util.pagination(req.query.limit, req.query.offset);
        obj = { limit: parseInt(req.query.limit.toString()), offset: parseInt(req.query.offset.toString()) };
    }
    const result: user[] = await actions.get(query, obj);
    res.json(result);
});

/**
 * @swagger
 * /user:
 *   post:
 *     tags:
 *      - Users
 *     description: create a user
 *     requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            $ref: '#/components/schemas/Users'
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: user created
 *         content:
 *          application/json:
 *              schema:
 *                  type: object
 *                  items:
 *                  $ref: "#/components/schemas/Users"
 *       400:
 *         description: bad request
 *       401:
 *         description: unauthorized
 *       500:
 *         description: server error
 */
router.post('/user', validateEmail.validEmail, validatePassword.validPassword, validateEmail.validEmailExist, async (req, res)=> {
    const user: user = req.body;
    let result;
    user.email = user.email.toLowerCase();
    result = await actions.create(`INSERT INTO users (email, password) 
    VALUES (:email, :password)`, user);
    if(result.error) {
        res.status(500).json(result.message);
    } else {
        user.id = result[0];
        res.json(user);
    } 
});

/**
 * @swagger
 * /user/{id}:
 *   patch:
 *     tags:
 *      - Users
 *     description: change password for a user
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
 *         description: Unique indefiquer of user
 *         schema:
 *           type: string
 *     requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            properties:
 *              password:
 *                  type: string
 *                  description: The user's password.
 *                  example: 1234
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: true if was changed, false if not
 *         content:
 *          application/json:
 *              schema:
 *                  type: boolean
 *       400:
 *         description: bad request
 *       401:
 *         description: unauthorized
 *       500:
 *         description: server error
 */
router.patch('/changepassword/:id', new Auth().auth, async (req, res)=> {
    const user: user = { ...req.body, id : req.params.id };
    let result;
    result = await actions.update(`UPDATE SET users password = :password WHERE id = :id`, user);
    if(result.error) {
        res.status(500).json(result.message);
    } else {
        res.json(user);
    } 
});

export default router;

/**
 * @swagger
 * components:
 *   schemas:
 *     Users:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           description: The user's id.
 *           example: 1
 *         email:
 *           type: string
 *           description: The user's email.
 *           example: test@test.com
 *         password:
 *            type: string
 *            description: The password of the user.
 *            example: TestToPass4#
 */