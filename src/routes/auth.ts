import express from 'express';
import { user } from '../models/user';
import ValidateEmail from '../middleware/validateEmail';
import ValidatePassword from '../middleware/validatePassword';
import * as actions  from '../database/actions';
import Auth from '../security/auth';

const router = express.Router();
const validateEmail = new ValidateEmail();
const validatePassword = new ValidatePassword();

/**
 * @swagger
 * /login:
 *   post:
 *     tags:
 *      - Auth
 *     description: autenticate user
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
 *         description: token
 *         content:
 *          application/json:
 *              schema:
 *                  type: string
 *       400:
 *         description: bad request
 *       401:
 *         description: unauthorized
 *       500:
 *         description: server error
 */
 router.post('/login', validateEmail.validEmail, validateEmail.validEmailExist, validatePassword.validPassword, async (req, res)=> {
    const user: user = req.body;
    let result;
    result = await actions.get(`SELECT COUNT(*) as count FROM users WHERE email = :email and password = :password`, user);    
    if(result.error) {
        return res.status(500).json({
            error: result.message,
            codeError: 'BD'
        });
    } else {
        if(result[0].count == 1) {
            const token = new Auth().generateToken({ email: user.email })
            return res.json(token);
        } else {
            return res.status(500).json({
                error: 'User or password incorrect',
                codeError: '007'
            });
        }       
    } 
});

export default router;
