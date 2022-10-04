export const selectUser = `
SELECT * 
FROM user
WHERE id = :id
`;

export const updateUserMoney = `
UPDATE user
SET money = :money
WHERE id = :id
`;

export const selectInventory = `
SELECT inv.nb,
	i.name,
	i.emote,
	i.price
FROM item i
LEFT JOIN inventory inv ON inv.itemId = i.id
WHERE inv.userId = :userid
`;

export const upsertInventory = `
INSERT INTO inventory
VALUES(
	:nb,
	:userid,
	:itemid
) ON CONFLICT(userid, itemid) DO UPDATE SET
	nb = nb + :nb,
	userId = :userid,
	itemId = :itemid
`;