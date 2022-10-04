export const selectSetting = `
SELECT value FROM setting WHERE setting = :setting
`;

export const insertSetting = `
INSERT INTO setting VALUES(:setting, :value) 
ON CONFLICT(setting) DO UPDATE SET value = :value
`;

export const deleteSetting = `
DELETE FROM setting
WHERE setting = :setting
`;