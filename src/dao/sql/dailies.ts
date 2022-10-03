export const deleteDailyWithDate = `
DELETE FROM daily_user
WHERE date < :date
`;

export const selectDailyType = (type?: boolean) => `
SELECT d.*,
	group_concat(SELECT userid FROM daily_user WHERE dailyType = d.type) AS users
FROM daily d
${type ? 'WHERE type = :type' : ''}
`;

export const selectDailyUser = `
SELECT du.date,
	d.*
FROM daily_user du
LEFT JOIN daily d ON d.id = du.daily
WHERE du.user_id = :userid
`;

export const insertDailyUser = `
INSERT INTO daily_user(
	userid,
	date,
	dailyType
) VALUES(
	:userid,
	:date,
	:dailyType
)
`;

export const insertDaily = `
INSERT INTO daily(
	type,
	amount
) VALUES(
	:type,
	:amount
)
`;

export const deleteDaily = `
DELETE FROM daily
WHERE type = :type
`;