export const deleteDailyWithDate = `
	DELETE FROM daily_user
	WHERE date < :date
`;

export const selectDaily = `
	SELECT
		type,
		amount,
		regress,
		firstcall
	FROM daily
	WHERE type = :type
`;