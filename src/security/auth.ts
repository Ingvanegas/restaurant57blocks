import jwt from 'jsonwebtoken';
import { tokenData } from '../models/tokenData';

const sign: string = 'Sign';

export default class Auth {

    constructor() {
        
    }
    
    public generateToken(data: tokenData): string {
        return jwt.sign(data, sign, { expiresIn: 20 * 60000 });
    }

    public auth(req: any, res: any, next: any) {
        try {
            const token: string | undefined = req?.headers?.token?.split(' ')[1];
            if (token) {
                const tokenVerificado: tokenData = jwt.verify(token, sign) as tokenData;
                if(tokenVerificado) {
                    req.user = tokenVerificado.email;
                    return next();
                }
            } else {
                return res.status(401).json({
                    error: 'Invalid Token',
                    codeError: '001'
                });
            }      
        } catch (error) {
            return res.status(401).json({
                error: 'The user you are trying to log in does not have sufficient privileges.',
                codeError: '002'
            });
        }
    }
}