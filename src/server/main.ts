import express from "express";
import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import ViteExpress from "vite-express";
import permissionRoutes from "./routes/system/permission";
import authRoutes from "./routes/auth/auth";


const app = express();

// middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// CORS
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  next();
});

const swaggerOptions = {
  swaggerDefinition: {
    openapi: '3.0.0', // Specify OpenAPI version
    info: {
      title: 'React Admin API',
      version: '1.0.0',
      description: 'API documentation for react admin application',
    },
    servers: [
      {
        url: 'http://localhost:3000', // Replace with your API base URL
        description: 'Development server',
      },
    ],
    // Add security schemes, components (schemas), etc. here if needed
  },
  // Path to your route files where JSDoc comments are located
  apis: [
    './src/server/routes/auth/*.ts',
    './src/server/routes/system/*.ts',
  ], 
};

const swaggerDocs = swaggerJsdoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

// auth routes
app.use('/api/auth', authRoutes);
// system routes
app.use('/api/system/permission', permissionRoutes);

ViteExpress.listen(app, 3000, () =>
  console.log("Server is listening on port 3000..."),
);
