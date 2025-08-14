import 'dotenv/config';
import { Router } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { db } from 'src/server/lib/db';
import * as table from 'src/server/lib/db/schema/system';
import { and, eq } from 'drizzle-orm';
import { authenticated, DecodedToken } from 'src/server/middleware/authMiddleware';
import { validateData } from 'src/server/middleware/validationMiddleware';
import { userLoginSchema, userRegistrationSchema } from 'src/server/schemas/userSchema';



const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET || 'my_access_token_secret_key';
const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET || 'my_refresh_token_secret_key';

const authRoutes = Router();

// Register route
/**
 * @swagger
 * /api/auth/register:
 *   post:
 *     tags:
 *       - Auth
 *     summary: Register a new user
 *     description: Register a new user with a username and password
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *                 description: The username of the user
 *               password:
 *                 type: string
 *                 description: The password of the user
 *               fullname:
 *                 type: string
 *                 description: The fullname of the user
 *     responses:
 *       201:
 *         description: User registered successfully
 *       400:
 *         description: Invalid request body
 */
authRoutes.post('/register', validateData(userRegistrationSchema), async (req, res) => {
  const { username, password, fullname } = req.body;

  // Hash the password
  const passwordHash = await bcrypt.hash(password, 10);

  try {
    const publicTenant = (await db.select().from(table.tenant).where(eq(table.tenant.code, 'PUBLIC'))).at(0);
    if (!publicTenant) {
      return res.status(500).json({ message: 'Public tenant not found' });
    }
    const newUserId = crypto.randomUUID();
    await db.insert(table.user).values({ id: newUserId, username, passwordHash, fullname, status: 'active', activeTenantId: publicTenant.id });
    await db.insert(table.userTenant).values({ userId: newUserId, tenantId: publicTenant.id });
    res.status(201).json({ message: 'User registered successfully' });
  } catch (e) {
    console.error('Error during registration:', e);
    return res.status(400).json({ message: 'Bad request' });
  }
  
});

// Login route
/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     tags:
 *       - Auth
 *     summary: Login a user
 *     description: Login a user with a username and password
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *                 description: The username of the user
 *               password:
 *                 type: string
 *                 description: The password of the user
 *     responses:
 *       200:
 *         description: User logged in successfully
 *       400:
 *         description: Invalid request body
 */
authRoutes.post('/login', validateData(userLoginSchema), async (req, res) => {
  const { username, password } = req.body;

  const results = await db.select().from(table.user).where(
              and(
                eq(table.user.username, username), 
                eq(table.user.status, 'active')
              ));

  const user = results.at(0);
  if (!user) {
    return res.status(400).json({ message: 'Invalid credentials' });
  }

  // Check the password
  const isMatch = await bcrypt.compare(password, user.passwordHash);
  if (!isMatch) {
    return res.status(400).json({ message: 'Invalid credentials' });
  }

  // Create a JWT
  const accessToken = jwt.sign({ username: user.username }, ACCESS_TOKEN_SECRET, { expiresIn: '1h' });
  const refreshToken = jwt.sign({ username: user.username }, REFRESH_TOKEN_SECRET, { expiresIn: '24h' });

  res.json({ accessToken, refreshToken });

});

/**
 * @swagger
 * /api/auth/refresh:
 *   post:
 *     tags:
 *       - Auth
 *     summary: Refresh access token
 *     description: Refresh access token using refresh token
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               refreshToken:
 *                 type: string
 *                 description: The refresh token of the user
 *     responses:
 *       200:
 *         description: Access token refreshed successfully
 *       400:
 *         description: Invalid request body
 */
authRoutes.post('/refresh', (req, res) => {
  const { refreshToken } = req.body;
    if (refreshToken) {
        try {
            const decoded = jwt.verify(refreshToken, REFRESH_TOKEN_SECRET) as DecodedToken;
            const accessToken = jwt.sign({ username: decoded.username }, ACCESS_TOKEN_SECRET, { expiresIn: '1h' });
            return res.json({ accessToken });
        } catch (error) {
          if (error instanceof jwt.TokenExpiredError) {
            return res.status(401).json({ message: 'Token expired.' });
          }
          return res.status(401).json({ message: 'Invalid token.' });
        }
    } else {
        return res.status(400).json({ message: 'Invalid request body' });
    }
})


// User route
/**
 * @swagger
 * components:
 *   securitySchemes:
 *     bearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 * /api/auth/user:
 *   get:
 *     tags:
 *       - Auth
 *     summary: Get user information
 *     description: Get user information using access token
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User information retrieved successfully
 *       500:
 *         description: User information not found after authentication.
 */
authRoutes.get('/user', authenticated(), async (req, res) => {
  if (req.user) {
    // First get the user
    const user = await db.query.user.findFirst({
      columns: {
        id: true,
        username: true,
        fullname: true,
        email: true,
        avatar: true,
        status: true
      },
      where: eq(table.user.username, req.user?.username),
      with: {
        activeTenant: {
          columns: {
            id: true,
            code: true,
            name: true,
            description: true,
          }
        }
      }
    });

    if (!user) {
       res.status(404).json({ message: 'Username not found' });
       return
    };

    // Then get roles and permissions for the active tenant
    const rolesWithPermissions = await db.query.userRole.findMany({
      where: and(
        eq(table.userRole.userId, user.id),
        eq(table.userRole.tenantId, user.activeTenant.id)
      ),
      with: {
        role: {
          columns: {
            code: true
          },
          with: {
            permissions: {
              where: eq(table.rolePermission.tenantId, user.activeTenant.id),
              with: {
                permission: {
                  columns: {
                    code: true
                  }
                }
              }
            }
          }
        }
      }
    });

    // Combine the results
    const result = {
      ...user,
      roles: rolesWithPermissions.map(ur => ({
        role: ur.role
      }))
    };
    
    const roles = result?.roles?.map((role) => role.role.code) || [];
    const permissions = result?.roles?.flatMap((role) => role.role.permissions?.map((permission) => permission.permission.code)) || [];
    res.json({
      ...user,
      roles,
      permissions
    });
  
  } else {
    res.status(500).json({ message: 'User information not found after authentication.' });
  }
});

export default authRoutes;
