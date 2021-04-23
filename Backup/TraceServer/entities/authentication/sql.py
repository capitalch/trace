allSqls = {

    'activate_user': '''
        update "TraceUser"
            set "isActive" = true
                where uid = %s
                    returning "id"
    ''',

    'change_pwd': '''
        update "TraceUser"
            set "hash" = %(hash)s
                where uid = %(uid)s
                    returning "id"
    ''',

    'change_uid': '''
        update "TraceUser"
	        set "uid" = %(newUid)s 
                where uid = %(oldUid)s
                    returning "id"
    ''',

    'doesExist_bu': '''
        select exists(
            select 1
                from "ClientEntityBu" b
                    join "ClientEntityX" x
                        on b."clientEntityId" = x."id"
                where "buCode" = %(buCode)s
                    and "clientId" = %(clientId)s
                    and "entityId" = %(entityId)s) as "doesExist"
    ''',

    'doesExist_userId': '''
        select exists(select 1 
            from "TraceClient" 
                where  "userId" = %(userId)s)
                    as "doesExist"
    ''',

    'doesExist_userEmail': '''
        select exists(select 1 
            from "TraceUser" 
                where "userEmail" = %(userEmail)s) as "doesExist"
    ''',

    'doExist_client_entity': '''
        select exists(select 1 
            from "ClientEntityX" 
                where "clientId" = %(clientId)s and "entityId" = %(entityId)s)
                    as "doExist"
    ''',

    'doesExist_database': '''
        select exists(select 1 from pg_catalog.pg_database where datname = %(dbName)s) as "doesExist"
    ''',

    'doesExist_user_allocation_to_entity': '''
        select exists(
            select 1 from "ClientEntityUserX" ux
                join "ClientEntityX" x
                    on x."id" = ux."clientEntityId"
                join "TraceEntity" e
                    on  e."id" = x."entityId"
                join "TraceClient" c
                    on c."id" = x."clientId"
                join "TraceUser" u
                    on u."id" = ux."userId"
                where "clientId" = %(clientId)s
                    and "entityId" = %(entityId)s
                        and ux."userId" = %(userId)s
        ) as "doesExist"
    ''',

    'doesNotExist_database': '''
        select not exists(select 1 from pg_catalog.pg_database where datname = %(dbName)s) as "doesNotExist"
    ''',

    'forgot_pwd': '''
        select "id"
            from "TraceUser"
                where "userEmail" = %(userEmail)s
    ''',

    'get_adminUsers': '''
        select "id", "uid", "userEmail", "isActive", "descr", "parentId"
            from "TraceUser"
                where "parentId" is null
                    order by "id" DESC
    ''',

    'get_businessUsers': '''
        select "id", "uid", "userEmail", "isActive", "descr", "parentId"
            from "TraceUser"
                where "parentId" = %(parentId)s
                    order by "id" DESC
    ''',

    "get_businessUnits_for_loggedinUser": '''
        select bu."id", "buCode"
            from "ClientEntityBu" bu
                join "ClientEntityX" x
                    on bu."clientEntityId" = x."id"
                join "ClientEntityUserX" ux
                    on ux."clientEntityId" = x."id"
                join "TraceUser" u
                    on ux."userId" = u."id"
                join "TraceClient" c
                    on x."clientId" = c."id"
                join "TraceEntity" e
                    on x."entityId" = e."id"
        where x."clientId" = %(clientId)s
            and e."entityName" = %(entityName)s
            and u."id" = %(id)s
            and c."isActive" = true
            and u."isActive" = true
        order by "buCode"
    ''',

    'get_clientEntityId': '''
        select "id"
            from "ClientEntityX"
                where "clientId" = %(clientId)s and "entityId" = %(entityId)s
    ''',

    'get_dbName': '''
        select "dbName"
            from "ClientEntityX" x
                join "TraceEntity" e
                    on e."id" = x."entityId"
                join "TraceClient" c
                    on c."id" = x."clientId"
            where "clientId" = %(clientId)s
                and "entityName" = %(entityName)s
                and c."isActive" = true
    ''',

    'get_entities': '''
        select "id", "entityName"
	        from "TraceEntity" order by "id" DESC
    ''',

    'get_user_hash': '''
        select "id", "hash"
            from "TraceUser"
                where (("uid" = %(uidOrEmail)s) or ("userEmail" = %(uidOrEmail)s))
                    and "isActive" = true 
    ''',

    "get_clientEntityXId_dbName_entityName": '''
        select x."id", "dbName", "entityName"
            from "ClientEntityX" x
                join "TraceEntity" e
                    on e."id" = x."entityId"
        where "clientId" = %(clientId)s
            and "entityId" = %(entityId)s
    ''',

    "get_lastBuCode_finYearId_branchId": '''
        select "lastUsedBuCode", "lastUsedBranchId"
        from "TraceUser"
            where "id" = %(userId)s
    ''',

    'getJson_clientCode_entityName': '''
        with cte1 as (select "clientCode"
		from "TraceClient"
			where "id" = %(clientId)s)
        , cte2 as (select "entityName"
            from "TraceEntity" 
                where "id" = %(entityId)s)
            select json_build_object(
                    'client', (SELECT row_to_json(a) from cte1 a)
                    , 'entity', (SELECT row_to_json(b) from cte2 b)
                ) as "jsonResult"
    ''',

    "getJson_clients_entities_clientEntityXs": '''
    with cte1 as (select "id", "clientCode", "clientName"
		from "TraceClient"
			where "isActive" = true)
	, cte2 as (select "id", "entityName"
		from "TraceEntity")
	, cte3 as (select x."id", "clientId", "entityId", "dbName"
		, "clientCode", "clientName", "entityName"
		from "ClientEntityX" x
			join "TraceClient" c on c."id" = x."clientId"
			join "TraceEntity" e on e."id" = x."entityId")
        select json_build_object(
                'clients', (SELECT json_agg(row_to_json(a)) from cte1 a)
                , 'entities', (SELECT json_agg(row_to_json(b)) from cte2 b)
                , 'clientEntityXs', (SELECT json_agg(row_to_json(c)) from cte3 c)
            ) as "jsonResult"
    ''',

    'getJson_clients_users': '''
        with cte1 as (
        select c."id", "clientCode", "clientName", c."userId", c."isActive", "uid", "userEmail"
            from "TraceClient" c
                join "TraceUser" u 
                    on c."userId" = u."id"
                order by "id" DESC
        ), cte2 as (
            select "id", "uid", "userEmail", "isActive", "parentId", "descr"
                from "TraceUser" where "parentId" is null and "isActive" = true
        )
        select json_build_object(
            'clients', (SELECT json_agg(row_to_json(a)) from cte1 a)
            , 'users', (SELECT json_agg(row_to_json(b)) from cte2 b)
        ) as "jsonResult"
    ''',

    'getJson_entities_bu': '''
       with cte1 as (select b."id", "clientEntityId" , "entityName" , "buCode"
	        from "ClientEntityBu" b
		        join "ClientEntityX" x
			        on x."id" = b."clientEntityId"
			   	join "TraceEntity" e
			   		on e."id" = x."entityId"
	        where x."clientId" = %(clientId)s
            order by b."id")
        , cte2 as (
            select e."id", "entityName" 
                from "TraceEntity" e
                    join "ClientEntityX" x
                        on e."id" = x."entityId"
                where "clientId" = %(clientId)s order by "entityName")
            select json_build_object(
                'entitiesBu',(SELECT json_agg(row_to_json(a)) from cte1 a)
                , 'entities', (SELECT json_agg(row_to_json(b)) from cte2 b)) as "jsonResult"
    ''',

    'getJson_entities_users_clientEntityUserXs': '''
        with cte1 as ( --entities for the client
		select e."id", "entityName"
			from "TraceEntity" e
				join "ClientEntityX" x
					on e."id" = x."entityId"
				where "clientId" = %(clientId)s)
	    , cte2 as ( --users created by admin for this client 
            select u."id", "uid", "userEmail"
			from "TraceUser" u
				join "TraceClient" c
					on u."parentId" = c."userId"
                    union
            select u."id", "uid", "userEmail"
			from "TraceUser" u
				join "TraceClient" c
					on u."id" = c."userId"
			where  c."id" =  %(clientId)s and u."isActive" = true and c."isActive" = true)
        , cte3 as ( -- rows against users created for this client and entity
            select c."id", "entityName", "uid", "userEmail"
                from "ClientEntityUserX" c
                    join "ClientEntityX" x
                        on x."id" = c."clientEntityId"
                    join "TraceEntity" t
                        on t."id" = x."entityId"
                    join "TraceUser" u
                        on u."id" = c."userId"
                where "clientId" = %(clientId)s and u."isActive" = true)
            select json_build_object(
                        'entities', (SELECT json_agg(row_to_json(a)) from cte1 a)
                        , 'users', (SELECT json_agg(row_to_json(b)) from cte2 b)
                        , 'clientEntityUserXs', (SELECT json_agg(row_to_json(c)) from cte3 c)
                    ) as "jsonResult"
    ''',

    'getJson_userDetails': '''
        with cte1 as ( -- for Admin users
            select u."id", "parentId", "uid", c."id" as "clientId","clientCode", "clientName", array_agg("entityName") as "entityNames"
                from "TraceUser" u
                    join "TraceClient" c
                        on c."userId" = u."id"
                    join "ClientEntityX" x
                        on x."clientId" = c."id"
                    join "TraceEntity" e
                        on e."id" = x."entityId"
                    where ("uid" = %(uidOrEmail)s or "userEmail" = %(uidOrEmail)s)
                            and u."isActive" = true
                                and c."isActive" = true
                group by u."id", "parentId", "uid", c."id","clientCode", "clientName"
            ),
        cte2 as ( -- for businessUsers
                select u."id", "uid", "parentId", c."id" as "clientId", "clientCode", "clientName", array_agg("entityName") as "entityNames"
                    from "TraceUser" u
                        join "TraceClient" c
                            on c."userId" = u."parentId"
                        join "ClientEntityX" x
                            on x."clientId" = c."id"
                        join "TraceEntity" e
                            on e."id" = x."entityId"
                        join "ClientEntityUserX" ux
                            on ux."clientEntityId" = x."id"
                        where ("uid" = %(uidOrEmail)s or "userEmail" = %(uidOrEmail)s)
                                and u."isActive" = true
                                    and c."isActive" = true
                group by u."id", "parentId", "uid", c."id","clientCode", "clientName"
            ),
    
        cte3 as (
            select "id", "uid", "parentId"
                from "TraceUser"
                    where ("uid" = %(uidOrEmail)s or "userEmail" = %(uidOrEmail)s)
                            and "isActive" = true
            )
            
        select json_build_object(
                    'adminUser', (select row_to_json(a) from cte1 a)
                    , 'businessUser', (SELECT row_to_json(b) from cte2 b)
                    , 'justUser', (SELECT row_to_json(c) from cte3 c)
                ) as "jsonResult"
        
    ''',

    'update_hash': '''
        update "TraceUser"
            set "hash" = %(hash)s
                where "userEmail" = %(userEmail)s
        returning "id"
    ''',

    "update_lastUsedBranchId":'''
        update "TraceUser"
            set "lastUsedBranchId" = %(branchId)s
                where "id" = %(userId)s
    ''',

    "update_lastUsedBuCode":'''
        update "TraceUser"
            set "lastUsedBuCode" = %(buCode)s
                where "id" = %(userId)s
    '''
}




    # "upsert_lastUsedBuCode": '''
    #     do $$
    #     begin
    #         if exists( 
    #             select 1 from "TraceUser"	
    #                 where "id" = %(userId)s) then
    #                     update "TraceUser"
    #                         set "lastUsedBuCode" = %(buCode)s
    #                             where "id" = %(userId)s;
    #         else
    #             insert into "TraceUser" ("userId", "lastUsedBuCode")
    #                 values (%(id)s, %(buCode)s);
    #         end if;
    #     end $$;
    # '''

    #  "upsert_lastUsedBranchId": '''
    #     do $$
    #     begin
    #         if exists( 
    #             select 1 from "TraceUser"	
    #                 where "userId" = %(userId)s) then
    #                     update "TraceUser"
    #                         set "lastUsedBranchId" = %(id)s
    #                             where "userId" = %(userId)s;
    #         else
    #             insert into "TraceUser" ("userId", "lastUsedBranchId")
    #                 values (%(userId)s, %(id)s);
    #         end if;
    #     end $$;
    # ''',