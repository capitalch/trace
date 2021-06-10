allSqls = {
    'get-sale-bill': '''
        select "id", "jData"
            from "SaleBills"
                where "billNoHash" = %(billNoHash)s
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
                        --,"modifiedTimestamp" = now()
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
