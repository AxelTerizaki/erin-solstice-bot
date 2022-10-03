export const selectUserLevel = (all?: boolean) => `
SELECT *
FROM user_level
${all ? 'ORDER BY xp DESC' : 'WHERE id = :id'}
`;

export const upsertUserLevel = `
INSERT INTO user_level VALUES(
	:id,
	:name,
	:avatar,
	:messages,
	:xp,
	:class,
	:level
) ON CONFLICT(id) DO UPDATE SET
	name = :name,
	avatar = :avatar,
	messages = :emssages,
	xp = :xp,
	class = :class,
	level = :level
`;