export const selectItems = (search?: string, id?: number) => `
SELECT * 
FROM item
${search ? 'AND (id = :search OR name = :search OR emote = :search)' : ''}
${id ? 'AND id = :id' : ''}
`;

export const upsertItem = `
INSERT INTO item VALUES(
	:id,
	:name,
	:emote,
	:price
) ON CONFLICT(id) DO UPDATE SET 
	name = :name,
	emote = :emote,
	price = :price
`;

export const deleteItem = `
DELETE FROM item
WHERE id = :id
`;