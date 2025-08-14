import { Router } from 'express';
import { db } from 'src/server/lib/db';
import { authenticated, authorized, hasPermissions, hasRoles } from 'src/server/middleware/authMiddleware';

const permissionRoutes = Router();
permissionRoutes.use(authenticated());

/**
 * @swagger
 * /api/system/permission:
 *   get:
 *     tags:
 *       - System
 *     summary: Get all permissions
 *     description: Retrieve a list of all permissions
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: A list of permissions
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Permission'
 */
/**
 * @swagger
 * components:
 *   schemas:
 *     Permission:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           description: The permission ID
 *         name:
 *           type: string
 *           description: The name of the permission
 *         description:
 *           type: string
 *           description: A description of the permission
 */
permissionRoutes.get('/', authorized('SYSADMIN', 'system.admin'), async (_, res) => {
  const permissions = await db.query.permission.findMany();
  return res.json(permissions);
  //return res.status(401).json({ message: 'Unauthorized' });
});

export default permissionRoutes;