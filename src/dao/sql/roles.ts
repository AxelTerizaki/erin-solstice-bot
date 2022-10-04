export const insertRole = `
INSERT INTO role(id, name, assignable)
VALUES(:id, :name, :assignable)
`;

export const deleteRole = `
DELETE FROM role
WHERE id = :id
`;

export const selectRoles = (role?: string) => `
SELECT *
FROM roles
${role ? 'WHERE name = :name' : ''}
`;