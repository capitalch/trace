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
    ON "TranH" USING btree
    ("branchId" ASC NULLS LAST, "tranTypeId" ASC NULLS LAST, "finYearId" ASC NULLS LAST)
    TABLESPACE pg_default;

-- 11-02-2022. Auto subledger implementation and others
CREATE TABLE IF NOT EXISTS "AutoSubledgerCounter"  (
	id integer NOT NULL GENERATED ALWAYS AS IDENTITY,
	"finYearId" smallint not null,
	"branchId" smallint NOT NULL,
	"accId" integer NOT NULL,
	"lastNo" integer NOT null,
	CONSTRAINT "AutoSubledger_pkey" PRIMARY KEY (id),
	CONSTRAINT "FinYearM_AutoSubledgerCounter_fkey" FOREIGN KEY("finYearId")
		REFERENCES "FinYearM" (id) MATCH SIMPLE
			ON UPDATE NO ACTION
			ON DELETE CASCADE,
	CONSTRAINT "BranchM_AutoSubledgerCounter_fkey" FOREIGN KEY("branchId")
		REFERENCES "BranchM" (id) MATCH SIMPLE
			ON UPDATE NO ACTION
			ON DELETE CASCADE,
	CONSTRAINT "AccM_AutoSubledgerCounter_fkey" FOREIGN KEY("accId")
		REFERENCES "AccM" (id) MATCH SIMPLE
			ON UPDATE NO ACTION
			ON DELETE CASCADE
);
-- create unique constraint on 'accCode' and parentId in table 'AccM'. At present same account code can exist twice in the table
ALTER TABLE "AccM"
	DROP CONSTRAINT IF EXISTS "AccM_accCode_key",
	DROP CONSTRAINT IF EXISTS "AccM_accCode_parentId_unique_key",
    ADD CONSTRAINT "AccM_accCode_parentId_unique_key" UNIQUE ("accCode", "parentId");

-- create ProductOpBal table
CREATE TABLE IF NOT EXISTS "ProductOpBal"
(
    id integer NOT NULL GENERATED ALWAYS AS IDENTITY,
	"productId" integer NOT NULL,
	"branchId" smallint NOT NULL,
	"finYearId" smallint NOT NULL,
	"qty" numeric(10,2) NOT NULL DEFAULT 0,
	"openingPrice" numeric(12,2) NOT NULL DEFAULT 0,
	"lastPurchaseDate" date NOT NULL,
	"jData" jsonb,
	"timestamp" timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
	CONSTRAINT "branchId" FOREIGN KEY ("branchId")
        REFERENCES "BranchM" (id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE RESTRICT,
	CONSTRAINT "finYearId" FOREIGN KEY ("finYearId")
        REFERENCES "FinYearM" (id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE RESTRICT,
	CONSTRAINT "productId" FOREIGN KEY ("productId")
        REFERENCES "ProductM" (id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE RESTRICT,
	CONSTRAINT "productId_branchId_finYearId_key" UNIQUE ("productId", "branchId", "finYearId")
);

-- add unique index for "ProductM" as brandId, catId, label
ALTER TABLE IF EXISTS "ProductM"
   DROP CONSTRAINT IF EXISTS "catId_brandId_label_unique_key",
   ADD  CONSTRAINT "catId_brandId_label_unique_key"
   UNIQUE ("brandId", "catId", "label");

-- modify fkey or add if not exists in table AccOpBal
ALTER TABLE "AccOpBal"
   DROP CONSTRAINT IF EXISTS "accId",
   DROP CONSTRAINT IF EXISTS "AccOpBal_accId_fkey",
   ADD  CONSTRAINT "AccOpBal_accId_fkey"
   FOREIGN KEY ("accId") REFERENCES "AccM" ("id") ON DELETE NO ACTION;

-- Add unique in "AccOpBal" for accId, branchId, finYearId
ALTER TABLE IF EXISTS "AccOpBal"
   DROP CONSTRAINT IF EXISTS "accOpBal_accId_branchId_finYearId_unique_key",
   ADD  CONSTRAINT "accOpBal_accId_branchId_finYearId_unique_key"
   UNIQUE ("accId", "branchId", "finYearId");

-- 21-03-2022; Upto this point all changes are included in database creation script; all databases are updated.
-- 22-03-2022 Allow same category name with different parent
ALTER TABLE IF EXISTS "CategoryM"
   DROP CONSTRAINT IF EXISTS "catName",
   DROP CONSTRAINT IF EXISTS "CategoryM_catName_parentId_unique_key",
   ADD  CONSTRAINT "CategoryM_catName_parentId_unique_key"
   UNIQUE ("catName", "parentId");

-- 05-04-2022 Added a hsn column for root category and updated in all databases
ALTER TABLE IF EXISTS "CategoryM"
	ADD COLUMN IF NOT EXISTS "hsn" NUMERIC(8) NULL;

-- 05-05-2022 create TagsM table for categories, Added in all databases
CREATE TABLE IF NOT EXISTS "TagsM"(
	id integer NOT NULL PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
	"tagName" TEXT NOT NULL,
	CONSTRAINT "TagsM_tagName_unique_key"
		UNIQUE("tagName")
);
ALTER TABLE IF EXISTS "CategoryM"
	ADD COLUMN IF NOT EXISTS "tagId" integer NULL;
ALTER TABLE IF EXISTS "CategoryM"
	DROP CONSTRAINT IF EXISTS "TagsM_CategoryM_fkey",
 	ADD CONSTRAINT "TagsM_CategoryM_fkey"
 		FOREIGN KEY("tagId") REFERENCES "TagsM" ("id")
 			ON DELETE SET NULL;

-- 10-07-2022 Stock journal implementation
CREATE TABLE IF NOT EXISTS "StockJournal"
(
    id integer NOT NULL GENERATED ALWAYS AS IDENTITY ( INCREMENT 1 START 1 MINVALUE 1 MAXVALUE 2147483647 CACHE 1 ),
    "tranHeaderId" integer NOT NULL,
    "productId" integer NOT NULL,
    qty integer NOT NULL DEFAULT 0,
    dc character(1) COLLATE pg_catalog."default" NOT NULL DEFAULT 'D'::bpchar,
    "lineRemarks" text COLLATE pg_catalog."default",
    "lineRefNo" text COLLATE pg_catalog."default",
    "timestamp" timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "jData" jsonb,
	-- "branchId" smallint not null DEFAULT 1,
    CONSTRAINT "StockJournal_pkey" PRIMARY KEY (id),
    CONSTRAINT "ProductM_StockJournal_fkey" FOREIGN KEY ("productId")
        REFERENCES "ProductM" (id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE RESTRICT,
    CONSTRAINT "TranH_StockJournal_fkey" FOREIGN KEY ("tranHeaderId")
        REFERENCES "TranH" (id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE CASCADE
	-- ,CONSTRAINT "BranchM_StockJournal_fkey" FOREIGN KEY ("branchId")
    --     REFERENCES "BranchM" (id) MATCH SIMPLE
    --     ON UPDATE NO ACTION
    --     ON DELETE RESTRICT
);
INSERT INTO "TranTypeM" ("id", "tranType", "tranCode")
	SELECT 11, 'Stock journal', 'STJ'
		WHERE NOT EXISTS (SELECT 1 FROM "TranTypeM" WHERE "id"=11);