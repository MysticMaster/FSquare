import swaggerJsdoc from 'swagger-jsdoc';

const options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'Customer API',
            version: '1.0.0',
            description: 'This is a REST API for the customer module of FSquare application.',
        },
        servers: [
            {
                url: 'http://51.79.156.193:5000/api/customer',
                description: 'Production Server'
            },
        ],
        components: {
            securitySchemes: {
                bearerAuth: {
                    type: 'http',
                    scheme: 'bearer',
                    bearerFormat: 'JWT',
                }
            }
        }
    },
    apis: ['./routes/api/*.js'],
};

const swaggerSpec = swaggerJsdoc(options);
export {swaggerSpec};
