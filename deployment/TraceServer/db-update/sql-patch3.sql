-- created on 27-03-2021. New database will need to be upgraded from this patch. The accounts.sql which is used
-- to create new database is alredy having ingredients of sql-patch1.sql and sql-patch2.sql

-- last product code in Settings table
INSERT INTO "Settings" ("id", "key", "intValue")
	SELECT 4, 'lastProductCode', 1000
		WHERE NOT EXISTS (SELECT 1 FROM "Settings" WHERE "id"=4);