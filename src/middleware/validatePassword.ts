export default class ValidatePassword {
    public validPassword(req: any, res: any, next: any) {
        const regexp = new RegExp(/^(?=.*[0-9])(?=.*[!@#?\]])(?=.*[a-z])(?=.*[A-Z])[a-zA-Z0-9!@#?\]]{10,30}$/); 
        if (req.body) {
            const serchfind = regexp.test(req.body.password);
            if (serchfind) {
                return next();
            } else {
                return res.status(400).json({
                    error: 'Invalid Password',
                    codeError: '004'
                });
            }
        }  else {
            return res.status(400).json({
                error: 'Invalid Password',
                codeError: '004'
            });
        }
       
    }
}