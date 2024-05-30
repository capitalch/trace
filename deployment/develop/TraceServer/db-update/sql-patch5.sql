-- Created in May 2024 for requirements for Branch transfer operations
-- New databases will need to be updated with this patch
-- Till sql-patch4.sql already there in accounts.sql (creates new database)
-- Also added this file (sql-patch5.sql) to the accounts.sql, towards the end for new databases
-- Table: BranchTransfer


CREATE TABLE IF NOT EXISTS "BranchTransfer"
(
    id integer NOT NULL GENERATED ALWAYS AS IDENTITY ( INCREMENT 1 START 1 MINVALUE 1 MAXVALUE 2147483647 CACHE 1 ),
    "tranHeaderId" integer NOT NULL,
    "productId" integer NOT NULL,
    qty integer NOT NULL DEFAULT 0,
    "lineRemarks" text COLLATE pg_catalog."default",
    "lineRefNo" text COLLATE pg_catalog."default",
    "jData" jsonb,
    price numeric(12,2) NOT NULL DEFAULT 0,
    "destBranchId" smallint NOT NULL,
    "timestamp" timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "BranchTransfer_pkey" PRIMARY KEY (id),
    CONSTRAINT "BranchTransfer_destBranchId_fkey" FOREIGN KEY ("destBranchId")
        REFERENCES "BranchM" (id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION,
    CONSTRAINT "BranchTransfer_productId_fkey" FOREIGN KEY ("productId")
        REFERENCES "ProductM" (id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION,
    CONSTRAINT "BranchTransfer_tranHeaderId_fkey" FOREIGN KEY ("tranHeaderId")
        REFERENCES "TranH" (id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE CASCADE
        NOT VALID
)

TABLESPACE pg_default;

ALTER TABLE IF EXISTS "BranchTransfer"
    OWNER to webadmin;

-- Trigger: audit_trigger

DROP TRIGGER IF EXISTS audit_trigger ON "BranchTransfer";

CREATE TRIGGER audit_trigger
    AFTER INSERT OR DELETE OR UPDATE 
    ON "BranchTransfer"
    FOR EACH ROW
    EXECUTE FUNCTION audit_function();

-- New tran type
INSERT INTO "TranTypeM" ("id", "tranType", "tranCode")
	SELECT 12, 'Branch transfer', 'BRT'
		WHERE NOT EXISTS (SELECT 1 FROM "TranTypeM" WHERE "id"=12);