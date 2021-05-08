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
    '''
}
