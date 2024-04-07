-- created in April 2023. 
-- New database will need to be upgraded from this patch. 
-- sql-patch1, sql-patch2, sql-patch3, sql-patch4 are already there in accounts.sql (creates new database)
-- As on April 2024 end, all databases are upgraded from this patch

CREATE TABLE IF NOT EXISTS audit_table
(
    id integer NOT NULL GENERATED ALWAYS AS IDENTITY,
    "user" text COLLATE pg_catalog."default" NOT NULL,
    action text COLLATE pg_catalog."default" NOT NULL,
    "timestamp" timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    old_data jsonb,
    new_data jsonb,
    table_name text COLLATE pg_catalog."default",
    altered_columns jsonb,
    table_id integer,
    CONSTRAINT "AuditTrail_pkey" PRIMARY KEY (id)
);

DROP TRIGGER IF EXISTS audit_trigger ON "AccM";
DROP TRIGGER IF EXISTS audit_trigger ON "AccOpBal";
DROP TRIGGER IF EXISTS audit_trigger ON "BankOpBal";
DROP TRIGGER IF EXISTS audit_trigger ON "ProductM";
DROP TRIGGER IF EXISTS audit_trigger ON "ProductOpBal";
DROP TRIGGER IF EXISTS audit_trigger ON "SalePurchaseDetails";
DROP TRIGGER IF EXISTS audit_trigger ON "StockJournal";
DROP TRIGGER IF EXISTS audit_trigger ON "TranD";
DROP TRIGGER IF EXISTS audit_trigger ON "TranH";

CREATE OR REPLACE FUNCTION audit_function()
    RETURNS trigger
    LANGUAGE 'plpgsql'
    COST 100
    VOLATILE NOT LEAKPROOF
AS $BODY$
DECLARE
  old_data JSON;
  new_data JSON;
  table_name TEXT;
  column_name TEXT;
  altered_columns_arr JSONB[] := ARRAY[]::JSONB[];
  altered_columns JSONB;
  old_value TEXT;
  new_value TEXT;
BEGIN
  table_name := TG_TABLE_NAME;

  IF (TG_OP = 'INSERT') THEN
    new_data := row_to_json(NEW);
    INSERT INTO audit_table ("user", action, timestamp, table_name, altered_columns, old_data, new_data)
    VALUES (current_user, 'INSERT', now(), table_name, NULL, NULL, new_data);
    RETURN NEW;
  ELSIF (TG_OP = 'UPDATE') THEN
    -- Compare old and new values column by column
    FOR column_name IN 
	SELECT c.column_name FROM information_schema.columns c WHERE c.table_schema = TG_TABLE_SCHEMA AND c.table_name = TG_TABLE_NAME
	LOOP
      EXECUTE format('SELECT $1.%I::text, $2.%I::text', column_name, column_name)
      INTO old_value, new_value
      USING OLD, NEW;

      IF old_value IS DISTINCT FROM new_value THEN
        altered_columns_arr := array_append(altered_columns_arr, json_build_object('column', column_name, 'old_value', old_value, 'new_value', new_value)::jsonb);
		altered_columns := jsonb_agg(altered_columns_arr);
      END IF;
    END LOOP;

    old_data := row_to_json(OLD);
    new_data := row_to_json(NEW);
    INSERT INTO audit_table ("user", action, timestamp, table_name, altered_columns, old_data, new_data, table_id)
    VALUES (current_user, 'UPDATE', now(), table_name, altered_columns, old_data, new_data, OLD.id);
    RETURN NEW;
  ELSIF (TG_OP = 'DELETE') THEN
    old_data := row_to_json(OLD);
    INSERT INTO audit_table ("user", action, timestamp, table_name, altered_columns, old_data, new_data)
    VALUES (current_user, 'DELETE', now(), table_name, NULL, old_data, NULL);
    RETURN OLD;
  END IF;
  RETURN NULL;
END;
$BODY$;

CREATE TRIGGER audit_trigger
    AFTER INSERT OR DELETE OR UPDATE 
    ON "AccM"
    FOR EACH ROW
    EXECUTE FUNCTION audit_function();

CREATE TRIGGER audit_trigger
    AFTER INSERT OR DELETE OR UPDATE 
    ON "AccOpBal"
    FOR EACH ROW
    EXECUTE FUNCTION audit_function();

CREATE TRIGGER audit_trigger
    AFTER INSERT OR DELETE OR UPDATE 
    ON "BankOpBal"
    FOR EACH ROW
    EXECUTE FUNCTION audit_function();

CREATE TRIGGER audit_trigger
    AFTER INSERT OR DELETE OR UPDATE 
    ON "ProductM"
    FOR EACH ROW
    EXECUTE FUNCTION audit_function();

CREATE TRIGGER audit_trigger
    AFTER INSERT OR DELETE OR UPDATE 
    ON "ProductOpBal"
    FOR EACH ROW
    EXECUTE FUNCTION audit_function();

CREATE TRIGGER audit_trigger
    AFTER INSERT OR DELETE OR UPDATE 
    ON "SalePurchaseDetails"
    FOR EACH ROW
    EXECUTE FUNCTION audit_function();

CREATE TRIGGER audit_trigger
    AFTER INSERT OR DELETE OR UPDATE 
    ON "StockJournal"
    FOR EACH ROW
    EXECUTE FUNCTION audit_function();

CREATE TRIGGER audit_trigger
    AFTER INSERT OR DELETE OR UPDATE 
    ON "TranD"
    FOR EACH ROW
    EXECUTE FUNCTION audit_function();

CREATE TRIGGER audit_trigger
    AFTER INSERT OR DELETE OR UPDATE 
    ON "TranH"
    FOR EACH ROW
    EXECUTE FUNCTION audit_function();

CREATE OR REPLACE FUNCTION get_productids_on_brand_category_tag(
	type text,
	value integer)
    RETURNS TABLE(id integer, "productCode" text, "catId" integer, "brandId" integer, label text, info text) 
    LANGUAGE 'plpgsql'
    COST 100
    VOLATILE PARALLEL UNSAFE
    ROWS 1000

AS $BODY$
	BEGIN
		if value = 0 then
			return query select p."id", p."productCode", p."catId", p."brandId", p."label", p."info" from "ProductM" p where p."isActive";
		elseif type = 'cat' then
			return query with cte1 as (
				with recursive rec as (
					select c."id", c."parentId", c."isLeaf"
						from "CategoryM" c
							where (c."id" = value)
					union all
					select c.id, c."parentId", c."isLeaf"
							from "CategoryM" c
								join rec on
									rec."id" = c."parentId"
				) select * from rec where "isLeaf"
			) select p."id", p."productCode", p."catId", p."brandId", p."label", p."info"
				from "ProductM" p
					join cte1 c1
						on c1."id" = p."catId" where p."isActive";
		elseif type = 'brand' then
			return query select p."id", p."productCode", p."catId", p."brandId", p."label", p."info" from "ProductM" p
				join "BrandM" b 
					on b."id" = p."brandId" 
						where p."brandId" = value and p."isActive";
		else --tag
			return query with cte1 as (
				with recursive	rec as (
					select c.id, c."parentId", c."isLeaf"
						from "CategoryM" c
							where ("tagId" = value) 
					union all
					select c.id, c."parentId", c."isLeaf"
						from "CategoryM" c
							join rec on
								rec."id" = c."parentId"
					) select * from rec where "isLeaf"
			) select p."id", p."productCode", p."catId", p."brandId", p."label", p."info"
				from "ProductM" p
					join cte1 c1
						on c1."id" = p."catId" where p."isActive";
		end if;
	END;
	
$BODY$;

CREATE OR REPLACE FUNCTION get_stock_on_date(
	branchid integer,
	finyearid integer,
	"onDate" date DEFAULT CURRENT_DATE)
    RETURNS TABLE("productId" integer, "productCode" text, "catName" text, "brandName" text, label text, info text, op numeric, "openingPrice" numeric, "opValue" numeric, sale numeric, purchase numeric, "saleRet" numeric, "purchaseRet" numeric, "stockJournalDebits" numeric, "stockJournalCredits" numeric, "lastPurchaseDate" date, "lastSaleDate" date, clos numeric, price numeric, value numeric, age integer) 
    LANGUAGE 'sql'
    COST 100
    VOLATILE PARALLEL UNSAFE
    ROWS 1000

AS $BODY$
		with cte0 as( --base cte used many times in next
		select "productId", "tranTypeId", "qty", "price", "tranDate", '' as "dc"
			from "TranH" h
				join "TranD" d
					on h."id" = d."tranHeaderId"
				join "SalePurchaseDetails" s
					on d."id" = s."tranDetailsId"
			where ("branchId" = branchId) and ("finYearId" =finYearId) and ("tranDate" <= "onDate")
				union all --necessary otherwise rows with same values are removed
		select "productId", "tranTypeId", "qty", 0 as "price", "tranDate", "dc"
			from "TranH" h
				join "StockJournal" s
					on h."id" = s."tranHeaderId"
			where ("branchId" = branchId) and ("finYearId" =finYearId) and ("tranDate" <= "onDate")
		), 
		cte1 as ( -- opening balance
			select id, "productId", "qty", "openingPrice", "lastPurchaseDate"
				from "ProductOpBal" p 
			where "branchId" = branchId and "finYearId" =finYearId
		),
		cte2 as ( -- create columns for sale, saleRet, purch... Actually creates columns from rows
			select "productId","tranTypeId", 
				SUM(CASE WHEN "tranTypeId" = 4 THEN "qty" ELSE 0 END) as "sale"
				, SUM(CASE WHEN "tranTypeId" = 9 THEN "qty" ELSE 0 END) as "saleRet"
				, SUM(CASE WHEN "tranTypeId" = 5 THEN "qty" ELSE 0 END) as "purchase"
				, SUM(CASE WHEN "tranTypeId" = 10 THEN "qty" ELSE 0 END) as "purchaseRet"
				, SUM(CASE WHEN ("tranTypeId" = 11) and ("dc" = 'D') THEN "qty" ELSE 0 END) as "stockJournalDebits"
				, SUM(CASE WHEN ("tranTypeId" = 11) and ("dc" = 'C') THEN "qty" ELSE 0 END) as "stockJournalCredits"
				, MAX(CASE WHEN "tranTypeId" = 4 THEN "tranDate" END) as "lastSaleDate"
				, MAX(CASE WHEN "tranTypeId" = 5 THEN "tranDate" END) as "lastPurchaseDate"
				from cte0
			group by "productId", "tranTypeId" order by "productId", "tranTypeId"
		),
		cte3 as ( -- sum columns group by productId
			select "productId"
			, coalesce(SUM("sale"),0) as "sale"
			, coalesce(SUM("purchase"),0) as "purchase"
			, coalesce(SUM("saleRet"),0) as "saleRet"
			, coalesce(SUM("purchaseRet"),0) as "purchaseRet"
			, coalesce(SUM("stockJournalDebits"),0) as "stockJournalDebits"
			, coalesce(SUM("stockJournalCredits"),0) as "stockJournalCredits"
			, MAX("lastSaleDate") as "lastSaleDate"
			, MAX("lastPurchaseDate") as "lastPurchaseDate"
			from cte2
				group by "productId"
		),
		cte4 as ( -- join opening balance (cte1) with latest result set
			select coalesce(c1."productId",c3."productId")  as "productId"
			, coalesce(c1.qty,0) as "op"
			, coalesce("sale",0) as "sale"
			, coalesce("purchase",0) as "purchase"
			, coalesce("saleRet", 0) as "saleRet"
			, coalesce("purchaseRet", 0) as "purchaseRet"
			, coalesce("stockJournalDebits", 0) as "stockJournalDebits"
			, coalesce("stockJournalCredits", 0) as "stockJournalCredits"
			, coalesce(c3."lastPurchaseDate", c1."lastPurchaseDate") as "lastPurchaseDate"
			, "openingPrice", "lastSaleDate"
				from cte1 c1
					full join cte3 c3
						on c1."productId" = c3."productId"
		),
		cte5 as ( -- get last purchase price for transacted products
			select DISTINCT ON("productId") "productId", "price" as "lastPurchasePrice"
				from cte0
					where "tranTypeId" = 5
						order by "productId", "tranDate" DESC
		),
		cte6 as (  -- combine last purchase price with latest result set and add clos column and filter on lastPurchaseDate(ageing)
			select coalesce(c4."productId", c5."productId") as "productId"
				,"op", coalesce("openingPrice",0) as "openingPrice",  coalesce("op"* "openingPrice",0)::numeric(12,2) "opValue", "sale", "purchase", "saleRet","purchaseRet","stockJournalDebits", "stockJournalCredits", "lastPurchaseDate","lastSaleDate"
				, coalesce("op" + "purchase" - "purchaseRet" - "sale" + "saleRet" + "stockJournalDebits" - "stockJournalCredits",0) as "clos"
				, coalesce("lastPurchasePrice", "openingPrice") as "lastPurchasePrice"
				from cte4 c4
					full join cte5 c5
						on c4."productId" = c5."productId"
		),
		cte7 as ( -- combine with productM, CategoryM and BrandM
			select c6.*,"productCode", "catName", "brandName", "label", "info"
				from cte6 c6
					join "ProductM" p
						on p."id" = c6."productId"
					join "BrandM" b
						on b."id" = p."brandId"
					join "CategoryM" c
						on c."id" = p."catId"
			where p."isActive" --and "clos" <> 0
		)
		
		select "productId"
		, "productCode"
		, "catName"
		, "brandName"
		, "label"
		, "info"
		, "op"
		, "openingPrice"
		, "opValue"
		, "sale"
		, "purchase"
		, "saleRet"
		, "purchaseRet"
		, "stockJournalDebits"
		, "stockJournalCredits"
		, "lastPurchaseDate"
		, "lastSaleDate"
		, "clos"
		, "lastPurchasePrice" as "price"
		, "clos" * "lastPurchasePrice" as "value"
		, DATE_PART('day', (CURRENT_DATE - "lastPurchaseDate"::timestamp))::int as "age"
				  from cte7
	
$BODY$;

-- On 05-06-2023. StockJournal price. Updated in all existing databases
ALTER TABLE IF EXISTS "StockJournal"
	ADD COLUMN IF NOT EXISTS "price" NUMERIC(12,0) DEFAULT 0;