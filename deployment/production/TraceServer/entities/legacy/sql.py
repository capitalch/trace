allSqls = {
    'get-sale-bill': '''
        select "id", "jData"
            from "SaleBills"
                where "billNoHash" = %(billNoHash)s
    ''',

    'update-extended-warranty-sms-sent':'''
        update "service_extended_warranty"
            set "smsSentDates" = array_append("smsSentDates", CURRENT_DATE )
	    where "id" = %(id)s
    ''',

    'get-extended-warranty-customer':'''
        select "id", "purchDate", "custName", "mobileNo","productCategory", "serialNumber", "address", "pin"
            from "service_extended_warranty"
        where "id"= %(id)s
    ''',

    'get-extended-warranty-customers': '''
        select "id","purchDate", "custName", "mobileNo", "address", "pin","productCategory", "modelCode", "modelName", 
            "serialNumber", "smsSentDates"::text, (select (CURRENT_DATE - interval '1 day')::date - ("purchDate"::date + interval '1 year')::date) as "daysLeft"
        from "service_extended_warranty"
            where "hasWarrantyPurchased" = false
                and (select (CURRENT_DATE - interval '1 day')::date - ("purchDate"::date + interval '1 year')::date)
                    between -3 and %(daysOver)s
        order by "id"
    ''',

    'upsert-extended-warranty-customer': '''
    do $$
    begin
        if exists( 
            select 1 from "service_extended_warranty"	
                where "modelCode" = %(modelCode)s
					and "serialNumber" = %(serialNumber)s)
				then
                    update "service_extended_warranty"
                        set "ascCode" = %(ascCode)s,
                        "custName" = %(custName)s,
                        "mobileNo" = %(mobileNo)s, 
                        "address" = %(address)s, 
                        "pin" = %(pin)s, 
                        "purchDate" = %(purchDate)s,
				        "warrantyType" = %(warrantyType)s, 
                        "warrantyCategory" = %(warrantyCategory)s, 
                        "productCategory" = %(productCategory)s,
                        "productSubCategory" = %(productSubCategory)s, 
                        "modelName" = %(modelCode)s
                    where "modelCode" = %(modelCode)s
                        and "serialNumber" = %(serialNumber)s;
        else
            insert into "service_extended_warranty" ("ascCode", "custName", "mobileNo", "address", "pin", "purchDate",
				"warrantyType", "warrantyCategory", "productCategory","productSubCategory", "modelCode", "modelName", 
					"serialNumber")
                values (
					%(ascCode)s, 
					%(custName)s, 
					%(mobileNo)s,
					
					%(address)s, 
					%(pin)s, 
					%(purchDate)s,
					
					%(warrantyType)s, 
					%(warrantyCategory)s, 
					%(productCategory)s,
					
					%(productSubCategory)s, 
					%(modelCode)s, 
					%(modelName)s,
					
					%(serialNumber)s
				);
        end if;
    end $$;
    ''',
    
    'upsert-sale-bill': '''
    do $$
    begin
        if exists( 
            select 1 from "SaleBills"	
                where "billNoHash" = %(billNoHash)s) then
                    update "SaleBills"
                        set "jData" = %(jData)s,
                        "billNo" = %(billNo)s
                        ,"modifiedTimestamp" = now()
                            where "billNoHash" = %(billNoHash)s;
        else
            insert into "SaleBills" ("billNoHash", "jData", "billNo")
                values (%(billNoHash)s, %(jData)s, %(billNo)s);
        end if;
    end $$;
    ''',

    'get-cash-sale-account-ids': '''
        set search_path to %(schema)s;
        select (select "id" from "AccM"
            where "accCode" = %(saleAccountCode)s) as "saleAccountId",
            (select "id" from "AccM"
            where "accCode" = %(cashAccountCode)s) as "cashAccountId"
    '''
}
