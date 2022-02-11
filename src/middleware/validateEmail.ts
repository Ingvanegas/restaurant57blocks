import * as actions  from '../database/actions';

export default class ValidateEmail {
    public validEmail(req: any, res: any, next: any) {
        const regexp = new RegExp(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/);
        if(req.body) {      
            const serchfind = regexp.test(req.body.email);
            if (serchfind) {
                return next();
            } else {
                return res.status(400).json({
                    error: 'Invalid Email',
                    codeError: '003'
                });
            }
        }  else {
            return res.status(400).json({
                error: 'Invalid Email',
                codeError: '003'
            });
        }      
    }

    public async validEmailExist(req: any, res: any, next: any) {        
        if(req.body) {                        
            const result = await actions.get('SELECT COUNT(*) as count FROM users WHERE email = :email and password = :password', req.body);
            const exist = result[0].count == 1;
            const error = req.originalUrl == '/user' ? 
            {
                error: 'Email already exist',
                codeError: '006'
            } :
            {
                error: 'Email not exist',
                codeError: '007'
            }

            if (!exist && req.originalUrl == '/user') {
                return next();
            } else if (exist && req.originalUrl == '/user') {
                return res.status(400).json(error);
            } else if (exist && req.originalUrl == '/login') {
                return next();
            }
            else if (!exist && req.originalUrl == '/login') {
                return res.status(400).json(error);
            }
        }  else {
            return res.status(400).json({
                error: 'Badrequest',
                codeError: '005'
            });
        }      
    }
}