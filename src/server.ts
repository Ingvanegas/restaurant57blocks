import express from 'express';
import helmet from 'helmet';
import bodyparser from 'body-parser';
import swaggerJsDoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import { swaggerDefinition } from './swagger/swaggerDefinitons';
import cors from 'cors';

import users from './routes/users';
import products from './routes/products';
import orders from './routes/orders';
import detailsOrder from './routes/detailsOrder';
import auth from './routes/auth';

const port = process.env.PORT || 8080;
const server = express();

server.use(cors({
    origin: '*'
}));

server.use(bodyparser.json());
server.use(helmet());

server.use('/', users);
server.use('/', products);
server.use('/', orders);
server.use('/', detailsOrder);
server.use('/', auth);

const options = {
    swaggerDefinition,
    apis: ['./dist/src/routes/*.js']
}

const swaggerSpec = swaggerJsDoc(options);

server.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

server.get('/api-docs.json', (req, res) => {
    res.send(swaggerSpec);
});

server.get('/', (req, res) => {
    res.set('Content-Type', 'text/html');
    res.send(Buffer.from(`
    <h1>Welcome to restaurant</h1>
    <a href="/docs">Go to Documentation</a>
    `));
});

server.listen(port, () => {
    console.log(`Server running at port: ${port}`);
});

module.exports = server;