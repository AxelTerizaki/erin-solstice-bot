export const sqldeleteReminder = `
DELETE FROM reminder 
WHERE id = :id
`;

export const sqlselectReminders = (byUser?: string, byID?: number) => `
SELECT * 
FROM reminder
${byUser ? 'WHERE user_id = :user_id' : ''}
${byID ? 'WHERE id = :id' : ''};
`;

export const sqlinsertReminder = `
INSERT INTO reminder(
	user_id,
	name,
	content, 
	created_at,
	remind_at,
	channel_id
) VALUES(
	:user_id,
	:name,
	:content,
	:created_at,
	:remind_at,
	:channel_id
)
`;