import { ViewEntity, ViewColumn } from 'typeorm';

@ViewEntity({
  expression: `
      SELECT "role"."id", "role"."name" as "roleName", array_agg("permission"."action") as "permissionActions"
      FROM "role_permission"
      INNER JOIN "role" ON "role_permission"."roleId" = "role"."id"
      INNER JOIN "permission" ON "role_permission"."permissionId" = "permission"."id"
      WHERE "isActive" = true
      GROUP BY "role"."id"
    `,
})
export class RolePermissionView {
  @ViewColumn()
  id: number;

  @ViewColumn()
  roleName: string;

  @ViewColumn()
  permissionActions: [string];
}
