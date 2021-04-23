-- set search_path to demounit1;

--Add new columns to CategoryM table
ALTER TABLE "CategoryM"
ADD COLUMN IF NOT EXISTS "descr" TEXT;

ALTER TABLE "CategoryM"
ADD COLUMN IF NOT EXISTS "isLeaf" BOOLEAN NOT NULL default false;

--create table contacts
CREATE TABLE IF NOT EXISTS "Contacts"
(
    id integer NOT NULL GENERATED ALWAYS AS IDENTITY,
    "contactName" text COLLATE pg_catalog."default" NOT NULL,
    "mobileNumber" text COLLATE pg_catalog."default",
    "otherMobileNumber" text COLLATE pg_catalog."default",
    "landPhone" text COLLATE pg_catalog."default",
    email text COLLATE pg_catalog."default",
    descr text COLLATE pg_catalog."default",
    "jData" jsonb,
    "anniversaryDate" date,
    address1 text COLLATE pg_catalog."default" NOT NULL,
    address2 text COLLATE pg_catalog."default",
    country text COLLATE pg_catalog."default" NOT NULL,
    state text COLLATE pg_catalog."default",
    city text COLLATE pg_catalog."default",
    gstin character(15) COLLATE pg_catalog."default",
    pin text COLLATE pg_catalog."default" NOT NULL,
    "dateOfBirth" date,
    "stateCode" smallint,
    CONSTRAINT "Contacts_pkey" PRIMARY KEY (id),
    CONSTRAINT "Contacts_contactName_pin_key" UNIQUE ("contactName", pin),
    CONSTRAINT "Contacts_email_key" UNIQUE (email),
    CONSTRAINT "Contacts_mobileNumber_key" UNIQUE ("mobileNumber")
);

--create table ExtBusinessContactsAccM
CREATE TABLE IF NOT EXISTS "ExtBusinessContactsAccM"
(
    id integer NOT NULL GENERATED ALWAYS AS IDENTITY,
    "contactName" text COLLATE pg_catalog."default" NOT NULL,
    "contactCode" text COLLATE pg_catalog."default" NOT NULL,
    "mobileNumber" text COLLATE pg_catalog."default",
    "otherMobileNumber" text COLLATE pg_catalog."default",
    "landPhone" text COLLATE pg_catalog."default",
    email text COLLATE pg_catalog."default" NOT NULL,
    "otherEmail" text COLLATE pg_catalog."default",
    "jAddress" jsonb NOT NULL,
    descr text COLLATE pg_catalog."default",
    "accId" integer,
    "jData" jsonb,
    CONSTRAINT "ExtBusinessContactsAccM_pkey" PRIMARY KEY (id),
    CONSTRAINT "ExtBusinessContactsAccM_contactCode_key" UNIQUE ("contactCode"),
    CONSTRAINT "ExtBusinessContactsAccM_accId_fkey" FOREIGN KEY ("accId")
        REFERENCES "AccM" (id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION
)
TABLESPACE pg_default;
ALTER TABLE "ExtBusinessContactsAccM"
    OWNER to webadmin;
DROP INDEX if EXISTS fki;
CREATE INDEX fki
    ON "ExtBusinessContactsAccM" USING btree
    ("accId" ASC NULLS LAST)
    TABLESPACE pg_default;

-- Table ExtMiscAccM create for autoSubledger
CREATE TABLE IF NOT EXISTS "ExtMiscAccM"
(
    id integer NOT NULL GENERATED ALWAYS AS IDENTITY,
    "accId" integer NOT NULL,
    "isAutoSubledger" boolean NOT NULL DEFAULT false,
    CONSTRAINT "ExtMiscAccM_pkey" PRIMARY KEY (id),
    CONSTRAINT "ExtMiscAccM_accId_fkey" FOREIGN KEY ("accId")
        REFERENCES "AccM" (id) MATCH SIMPLE
        ON UPDATE CASCADE
        ON DELETE CASCADE
)
TABLESPACE pg_default;
ALTER TABLE "ExtMiscAccM"
    OWNER to webadmin;

-- Create table ExtProductTranTranD
CREATE TABLE IF NOT EXISTS "ExtProductTranTranD"
(
    id integer NOT NULL GENERATED ALWAYS AS IDENTITY,
    "tranDetailsId" integer NOT NULL,
    "productId" integer NOT NULL,
    qty integer NOT NULL DEFAULT 0,
    price numeric(12,2) NOT NULL DEFAULT 0,
    discount numeric(12,2) NOT NULL DEFAULT 0,
    amount numeric(12,2) NOT NULL GENERATED ALWAYS AS (((price - discount) * (qty)::numeric)) STORED,
    CONSTRAINT "ExtProductTranTranD_pkey" PRIMARY KEY (id),
    CONSTRAINT "ExtProductTranTranD_productId_fkey" FOREIGN KEY ("productId")
        REFERENCES "ProductM" (id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION,
    CONSTRAINT "ExtProductTranTranD_tranDetailsId_fkey" FOREIGN KEY ("tranDetailsId")
        REFERENCES "TranD" (id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION
)
TABLESPACE pg_default;
ALTER TABLE "ExtProductTranTranD"
    OWNER to webadmin;
DROP INDEX if EXISTS fki_c;
CREATE INDEX fki_c
    ON "ExtProductTranTranD" USING btree
    ("tranDetailsId" ASC NULLS LAST)
    TABLESPACE pg_default;
DROP INDEX if EXISTS fki_d;
CREATE INDEX fki_d
    ON "ExtProductTranTranD" USING btree
    ("productId" ASC NULLS LAST)
    TABLESPACE pg_default;

-- drop table ExtMetaTranD
drop table IF EXISTS "ExtMetaTranD";
--drop table InvExtD
drop table IF EXISTS "InvExtD";


--Insert debit note, credit note, sale return and purchase return transaction types
INSERT INTO "TranTypeM" ("id", "tranType", "tranCode")
	SELECT 7, 'Debit note', 'DRN'
		WHERE NOT EXISTS (SELECT 1 FROM "TranTypeM" WHERE "id"=7);

INSERT INTO "TranTypeM" ("id", "tranType", "tranCode")
	SELECT 8, 'Credit note', 'CRN'
 		WHERE NOT EXISTS (SELECT 1 FROM "TranTypeM" WHERE "id"=8);

INSERT INTO "TranTypeM" ("id", "tranType", "tranCode")
 	SELECT 9, 'Sale return', 'SRT'
 		WHERE NOT EXISTS (SELECT 1 FROM "TranTypeM" WHERE "id"=9);

INSERT INTO "TranTypeM" ("id", "tranType", "tranCode")
	SELECT 10, 'Purchase return', 'PRT'
		WHERE NOT EXISTS (SELECT 1 FROM "TranTypeM" WHERE "id"=10);

--insert data into UnitM
INSERT INTO "UnitM" ("id", "unitName", "symbol")
	SELECT 1, 'piece', 'Pc'
		WHERE NOT EXISTS (SELECT 1 FROM "UnitM" WHERE "id"=1);

INSERT INTO "UnitM" ("id", "unitName", "symbol")
	SELECT 2, 'kilogram', 'Kg'
		WHERE NOT EXISTS (SELECT 1 FROM "UnitM" WHERE "id"=2);

-- change column type of unitId column in ProductM table
alter table "ProductM"
 	ALTER COLUMN "unitId"  SET NOT NULL,
	ALTER COLUMN "unitId" SET DEFAULT 1;

-- change some columns and add a few columns in productM
ALTER TABLE "ProductM"
	DROP COLUMN IF EXISTS "barCode" ,
	ADD COLUMN IF NOT EXISTS "productCode" TEXT NOT NULL,
	ADD COLUMN IF NOT EXISTS "upcCode" TEXT NULL,
	ADD COLUMN IF NOT EXISTS "isActive" BOOLEAN NOT NULL default TRUE,
	ADD COLUMN IF NOT EXISTS  "maxRetailPrice" numeric(12,2) NOT NULL DEFAULT 0,
	ADD COLUMN IF NOT EXISTS "dealerPrice" numeric(12,2) NOT NULL DEFAULT 0,
	ADD COLUMN IF NOT EXISTS "gstRate" numeric(5,2) NOT NULL DEFAULT 0,
	ADD COLUMN IF NOT EXISTS "salePrice" numeric(12,2) NOT NULL DEFAULT 0,
	ADD COLUMN IF NOT EXISTS "discount" numeric(12,2) NOT NULL DEFAULT 0,
	ADD COLUMN IF NOT EXISTS "discountRate" numeric(5,2) NOT NULL DEFAULT 0,
	ADD COLUMN IF NOT EXISTS "hsn" numeric(8,0);

-- Create unique constraints in ProductM
ALTER TABLE "ProductM"
	DROP CONSTRAINT IF EXISTS "ProductM_productCode_key",
	DROP CONSTRAINT IF EXISTS "ProductM_upcCode_key",
    ADD CONSTRAINT "ProductM_productCode_key" UNIQUE ("productCode"),
	ADD CONSTRAINT "ProductM_upcCode_key" UNIQUE ("upcCode");

-- last product code in Settings table
INSERT INTO "Settings" ("id", "key", "intValue")
	SELECT 4, 'lastProductCode', 1000
		WHERE NOT EXISTS (SELECT 1 FROM "Settings" WHERE "id"=4);

-- Add gstRate column in ProductM
-- ALTER TABLE "ProductM"
-- ADD COLUMN IF NOT EXISTS "gstRate" DECIMAL(5,2) NOT NULL default 0,
-- ADD COLUMN IF NOT EXISTS "salePrice" DECIMAL(12,2) NOT NULL default 0,
-- ADD COLUMN IF NOT EXISTS "discount" DECIMAL(12,2) NOT NULL default 0,
-- ADD COLUMN IF NOT EXISTS "discountRate" DECIMAL(5,2) NOT NULL default 0,
-- ADD COLUMN IF NOT EXISTS "isActive" BOOLEAN NOT NULL default true;

-- Change barCode to upcCode in ProductM
-- DO $$
-- BEGIN
--   IF EXISTS(SELECT *
--     FROM information_schema.columns
--     WHERE table_name='ProductM' and column_name='barCode')
--   THEN
--       ALTER TABLE "ProductM" RENAME COLUMN "barCode" TO "upcCode";
--   END IF;
-- END $$;

-- Add few columns in ProductM

-- Create table ExtProductDProductM
-- CREATE TABLE IF NOT EXISTS "ExtProductDProductM"
-- (
--     id integer NOT NULL GENERATED ALWAYS AS IDENTITY,
--     "productId" integer NOT NULL,
--     "maxRetailPrice" numeric(12,2) NOT NULL DEFAULT 0,
--     "dealerPrice" numeric(12,2) NOT NULL DEFAULT 0,
--     "gstRate" numeric(5,2) NOT NULL DEFAULT 0,
--     "salePrice" numeric(12,2) NOT NULL DEFAULT 0,
--     "jData" jsonb,
--     hsn numeric(8,0),
--     CONSTRAINT "ExtProductDProductM_pkey" PRIMARY KEY (id),
--     CONSTRAINT "ExtProductDProductM_productId_fkey" FOREIGN KEY ("productId")
--         REFERENCES "ProductM" (id) MATCH SIMPLE
--         ON UPDATE NO ACTION
--         ON DELETE NO ACTION
-- )
-- TABLESPACE pg_default;
-- ALTER TABLE "ExtProductDProductM"
--     OWNER to webadmin;