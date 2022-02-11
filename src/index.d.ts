
import { tokenData } from './models/tokenData';

declare global {
    namespace Express {
      interface Request {
        user?: tokenData;
        body?: any;
      }
    }
}