import bcrypt from "bcryptjs";
import { db } from ".";
import { permission, role, rolePermission, tenant, user, userRole, userTenant } from "./schema/system";

async function seed() {

  console.log("Clearing table")
  await db.execute(`TRUNCATE TABLE "sys_user_tenant", "sys_user_role", "sys_role_permission", "sys_permission", "sys_role", "sys_user", "sys_tenant" CASCADE`);

  console.log("Seeding tenant");
  const sysTenantId = crypto.randomUUID();
  const pubTenantId = crypto.randomUUID();
  await db.insert(tenant).values([
    { id: sysTenantId, code: "SYSTEM", name: "System", description: "System Tenant" },
    { id: pubTenantId, code: "PUBLIC", name: "Public", description: "Public Tenant" }
  ]);

  console.log("Seeding user");
  const userId = crypto.randomUUID();
  const passwordHash = await bcrypt.hash("S3cr3T", 10);
  await db.insert(user).values([
    { id: userId, username: "sysadmin", passwordHash: passwordHash, fullname: "System Admin", status: "active", activeTenantId:sysTenantId }
  ]);

  console.log("Seeding role");
  const sysRoleId = crypto.randomUUID();
  const pubRoleId = crypto.randomUUID();
  await db.insert(role).values([
    { id: sysRoleId, code: "SYSADMIN", name: "System Admin", description: "Role System Admin", isSystem: true, tenantId: sysTenantId },
    { id: pubRoleId, code: "SYSADMIN", name: "System Admin", description: "Role System Admin", isSystem: true, tenantId: pubTenantId }
  ]);

  console.log("Seeding permission");
  const sysPermissionId = crypto.randomUUID();
  const pubPermissionId = crypto.randomUUID();
  await db.insert(permission).values([
    { id: sysPermissionId, code: "system.admin", name: "Admin", description: "Permission Admin", tenantId: sysTenantId },
    { id: pubPermissionId, code: "system.admin", name: "Admin", description: "Permission Admin", tenantId: pubTenantId }
  ]);

  console.log("seeding user tenant");
  await db.insert(userTenant).values([
    { userId: userId, tenantId: sysTenantId },
    { userId: userId, tenantId: pubTenantId }
  ]);

  console.log("Seeding user role");
  await db.insert(userRole).values([
    { userId: userId, roleId: sysRoleId, tenantId: sysTenantId },
    { userId: userId, roleId: pubRoleId, tenantId: pubTenantId }
  ]);

  console.log("Seeding role permission");
  await db.insert(rolePermission).values([
    { roleId: sysRoleId, permissionId: sysPermissionId, tenantId: sysTenantId },
    { roleId: pubRoleId, permissionId: pubPermissionId, tenantId: pubTenantId }
  ]);

}

async function main() {
  await seed();
  console.log("Seed completed");
  process.exit(0);
}

main();