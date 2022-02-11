export const swaggerDefinition = {
    openapi: '3.0.0',
    info: {
        title: 'Reataurant API',
        version: '1.0.0'
    },
    servers: [
        {
            url: 'http://localhost:3000/',
            description: 'Develop'
        },
        {
            url: 'https://restaurantapi57blocks.herokuapp.com/',
            description: 'Production'
        },
    ]
}