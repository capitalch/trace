-- created on 27-03-2021. New database will need to be upgraded from this patch. The accounts.sql which is used
-- to create new database is alredy having ingredients of sql-patch1.sql and sql-patch2.sql

-- last product code in Settings table
INSERT INTO "Settings" ("id", "key", "intValue")
	SELECT 4, 'lastProductCode', 1000
		WHERE NOT EXISTS (SELECT 1 FROM "Settings" WHERE "id"=4);

ALTER TABLE IF EXISTS "ExtBusinessContactsAccM"
	ADD COLUMN IF NOT EXISTS "stateCode" SMALLINT DEFAULT 19;


-- 02-06-2021. Create index for faster search
CREATE INDEX if not exists "branchId_tranTypeId_finYearId"
    ON demounit1."TranH" USING btree
    ("branchId" ASC NULLS LAST, "tranTypeId" ASC NULLS LAST, "finYearId" ASC NULLS LAST)
    TABLESPACE pg_default;