import { ViewEntity, ViewColumn } from 'typeorm';

@ViewEntity({
  expression: `
        SELECT "user"."id" AS "id", "user"."name" AS "name", "user"."email" AS "email", 
        json_build_object('name', role.name, 'id' , role.id) AS role
        FROM "user_role"
        LEFT JOIN "user" ON "user_role"."userId" = "user"."id"
        LEFT JOIN "role" ON "user_role"."roleId" = "role"."id"
    `,
})
export class UserRoleView {
  @ViewColumn()
  id: number;

  @ViewColumn()
  name: string;

  @ViewColumn()
  email: string;

  @ViewColumn()
  role: {
    id: number;
    name: string;
  };
}
