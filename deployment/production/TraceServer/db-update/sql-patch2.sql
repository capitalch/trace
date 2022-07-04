--alter table contacts
ALTER TABLE "Contacts"
    DROP CONSTRAINT IF EXISTS "Contacts_contactName_pin_key",
	DROP CONSTRAINT IF EXISTS "Contacts_contactName_pin_address1_key",
    ADD CONSTRAINT  "Contacts_contactName_pin_address1_key" UNIQUE("contactName", "pin", "address1");

-- Add a column contactsId in table TranH
ALTER TABLE "TranH"
ADD COLUMN IF NOT EXISTS "contactsId" integer,
DROP CONSTRAINT IF EXISTS "contactsId",
ADD CONSTRAINT "contactsId" FOREIGN KEY ("contactsId")
        REFERENCES "Contacts" (id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION;

drop table IF EXISTS "ExtMiscTranH";
drop table IF EXISTS "ExtProductDProductM";

-- To provide delete functionality in "TranD" table for foreigh key, delete cascade
ALTER TABLE IF EXISTS "ExtProductTranTranD"
   DROP CONSTRAINT IF EXISTS "ExtProductTranTranD_tranDetailsId_fkey",
   ADD  CONSTRAINT "ExtProductTranTranD_tranDetailsId_fkey"
   FOREIGN KEY ("tranDetailsId") REFERENCES "TranD" ("id") ON DELETE CASCADE;

CREATE TABLE IF NOT EXISTS "SalePurchaseDetails"  (
	id integer NOT NULL GENERATED ALWAYS AS IDENTITY,
	"tranDetailsId" integer not null,
	"productId" integer NOT NULL,
	"qty" integer NOT NULL DEFAULT 0,
	"gstRate" numeric(5,2) NOT NULL DEFAULT 0,
	"price" numeric(12,2) NOT NULL DEFAULT 0,
	"priceGst" numeric(12,2) NOT NULL DEFAULT 0,
	"discount" numeric(12,2) NOT NULL DEFAULT 0,
	"cgst" numeric(12,2) NOT NULL DEFAULT 0,
	"sgst" numeric(12,2) NOT NULL DEFAULT 0,
	"igst" numeric(12,2) NOT NULL DEFAULT 0,
	"amount" numeric(12,2) NOT NULL DEFAULT 0,
	"hsn" integer NOT NULL,
	"jData" jsonb null,
	CONSTRAINT "SalePurchaseDetails_pkey" PRIMARY KEY (id),
	CONSTRAINT "SalePurchaseDetails_productId_fkey" FOREIGN KEY("productId")
		REFERENCES "ProductM" (id) MATCH SIMPLE
			ON UPDATE NO ACTION
			ON DELETE RESTRICT,
	CONSTRAINT "SalePurchaseDetails_tranDetailsId_fkey" FOREIGN KEY("tranDetailsId")
		REFERENCES "TranD" (id) MATCH SIMPLE
			ON UPDATE NO ACTION
			ON DELETE CASCADE
)
TABLESPACE pg_default;

-- add some new columns in ProductM
ALTER TABLE IF EXISTS "ProductM"
	DROP COLUMN IF EXISTS "discountRate",
	ADD COLUMN IF NOT EXISTS "saleDiscountRate" numeric(5,2) NOT NULL DEFAULT 0,
	DROP COLUMN IF EXISTS "discount",
	ADD COLUMN IF NOT EXISTS "saleDiscount" numeric(12,2) NOT NULL DEFAULT 0,
	ADD COLUMN IF NOT EXISTS "salePriceGst" numeric(12,2) NOT NULL DEFAULT 0,
	ADD COLUMN IF NOT EXISTS "purPriceGst" numeric(12,2) NOT NULL DEFAULT 0,
	ADD COLUMN IF NOT EXISTS "purPrice" numeric(12,2) NOT NULL DEFAULT 0,
	ADD COLUMN IF NOT EXISTS "purDiscount" numeric(12,2) NOT NULL DEFAULT 0,
	ADD COLUMN IF NOT EXISTS "purDiscountRate" numeric(5,2) NOT NULL DEFAULT 0;

--Change rate column to NULL able in ExtGstTranD table
alter table IF EXISTS "ExtGstTranD"
	ALTER COLUMN "rate" DROP NOT NULL;

--Separate GSTIN column
ALTER TABLE IF EXISTS "ExtBusinessContactsAccM"
	ADD COLUMN IF NOT EXISTS "gstin" VARCHAR(15) NULL;

--25-03-2021
--Change TranH timestamp to with timezone
ALTER TABLE IF EXISTS "TranH"
	ALTER COLUMN "timestamp" TYPE TIMESTAMP with TIME ZONE ;

--Add timeStamp column in several tables
ALTER TABLE IF EXISTS "AccM"
	ADD COLUMN IF NOT EXISTS "timestamp" TIMESTAMP with TIME ZONE DEFAULT CURRENT_TIMESTAMP;
ALTER TABLE IF EXISTS "AccOpBal"
	ADD COLUMN IF NOT EXISTS "timestamp" TIMESTAMP with TIME ZONE DEFAULT CURRENT_TIMESTAMP;
ALTER TABLE IF EXISTS "BankOpBal"
	ADD COLUMN IF NOT EXISTS "timestamp" TIMESTAMP with TIME ZONE DEFAULT CURRENT_TIMESTAMP;
ALTER TABLE IF EXISTS "BranchM"
	ADD COLUMN IF NOT EXISTS "timestamp" TIMESTAMP with TIME ZONE DEFAULT CURRENT_TIMESTAMP;
ALTER TABLE IF EXISTS "BrandM"
	ADD COLUMN IF NOT EXISTS "timestamp" TIMESTAMP with TIME ZONE DEFAULT CURRENT_TIMESTAMP;
ALTER TABLE IF EXISTS "CategoryM"
	ADD COLUMN IF NOT EXISTS "timestamp" TIMESTAMP with TIME ZONE DEFAULT CURRENT_TIMESTAMP;
ALTER TABLE IF EXISTS "Contacts"
	ADD COLUMN IF NOT EXISTS "timestamp" TIMESTAMP with TIME ZONE DEFAULT CURRENT_TIMESTAMP;
ALTER TABLE IF EXISTS "ExtBankReconTranD"
	ADD COLUMN IF NOT EXISTS "timestamp" TIMESTAMP with TIME ZONE DEFAULT CURRENT_TIMESTAMP;
ALTER TABLE IF EXISTS "ExtBusinessContactsAccM"
	ADD COLUMN IF NOT EXISTS "timestamp" TIMESTAMP with TIME ZONE DEFAULT CURRENT_TIMESTAMP;
ALTER TABLE IF EXISTS "ExtGstTranD"
	ADD COLUMN IF NOT EXISTS "timestamp" TIMESTAMP with TIME ZONE DEFAULT CURRENT_TIMESTAMP;
ALTER TABLE IF EXISTS "GodownM"
	ADD COLUMN IF NOT EXISTS "timestamp" TIMESTAMP with TIME ZONE DEFAULT CURRENT_TIMESTAMP;
ALTER TABLE IF EXISTS "ProductM"
	ADD COLUMN IF NOT EXISTS "timestamp" TIMESTAMP with TIME ZONE DEFAULT CURRENT_TIMESTAMP;
ALTER TABLE IF EXISTS "SalePurchaseDetails"
	ADD COLUMN IF NOT EXISTS "timestamp" TIMESTAMP with TIME ZONE DEFAULT CURRENT_TIMESTAMP;
ALTER TABLE IF EXISTS "Settings"
	ADD COLUMN IF NOT EXISTS "timestamp" TIMESTAMP with TIME ZONE DEFAULT CURRENT_TIMESTAMP;
ALTER TABLE IF EXISTS "TranD"
	ADD COLUMN IF NOT EXISTS "timestamp" TIMESTAMP with TIME ZONE DEFAULT CURRENT_TIMESTAMP;
ALTER TABLE IF EXISTS "TranH"
	ADD COLUMN IF NOT EXISTS "timestamp" TIMESTAMP with TIME ZONE DEFAULT CURRENT_TIMESTAMP;

--Add a column checked in table "TranH"
ALTER TABLE IF EXISTS "TranH"
	ADD COLUMN IF NOT EXISTS "checked" BOOLEAN DEFAULT FALSE;

--remove table ExtProductTranTranD
drop table IF EXISTS "ExtProductTranTranD";

-- To provide delete functionality in "TranD" table. Presence of ExtBankReconTranD foreign key prevents it. So delete cascade.
ALTER TABLE "ExtBankReconTranD"
   DROP CONSTRAINT IF EXISTS "ExtBankReconTranD_tranDetailsId_fkey",
   ADD  CONSTRAINT "ExtBankReconTranD_tranDetailsId_fkey"
   FOREIGN KEY ("tranDetailsId") REFERENCES "TranD" ("id") ON DELETE CASCADE;

-- Add state code in ExtBusinessContactsAccM
ALTER TABLE IF EXISTS "ExtBusinessContactsAccM"
	ADD COLUMN IF NOT EXISTS "stateCode" smallint DEFAULT 19;









