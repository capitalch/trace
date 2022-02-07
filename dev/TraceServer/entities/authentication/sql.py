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

    'doesExist_schema_in_db': '''
        SELECT exists(
            select 1 
                FROM "information_schema"."schemata" 
                    WHERE schema_name = %(buCode)s) as "doesExist"
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

    'doesExist_userEmail_for_update': '''
        select exists(select 1 
            from "TraceUser" 
                where "userEmail" = %(userEmail)s 
                and "id" <> %(userId)s)
                as "doesExist"
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

    'doesExist_user_bu_role': '''
        select exists(
            select 1 from "ClientEntityRoleBuUserX"
                where "userId" = %(userId)s
                and "clientEntityRoleId" = %(clientEntityRoleId)s
                and "clientEntityBuId" = %(clientEntityBuId)s
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
        select "id", "uid", "userEmail", "isActive", "descr", "parentId", "userName"
            from "TraceUser"
                where "parentId" is null
                    order by "id" DESC
    ''',

    'get_businessUsers': '''
        select "id", "uid", "userEmail", "isActive", "descr", "parentId",  "userName"
            from "TraceUser"
                where "parentId" = %(parentId)s
                    order by "id" DESC limit (%(no)s)
    ''',

    'get_clientEntityId': '''
        select "id"
            from "ClientEntityX"
                where "clientId" = %(clientId)s and "entityId" = %(entityId)s
    ''',

    'get_clients': '''
        select "id", "clientCode", "clientName","isActive"
            from "TraceClient"
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

    'getJson_businessUnits_permissions_for_loggedinUser': '''
        with cte1 as ( select bu."id", bu."buCode", bu."buName",  --for admin user
        null as "permissions"
        from "TraceUser" u
            join "ClientEntityX" x
                on u."id" = x."userId"
            join "ClientEntityBu" bu
                on x."id" = bu."clientEntityId"
        where u."id" = %(userId)s
        order by "buCode")

        , cte2 as (select bu."id", bu."buCode", bu."buName",  --for business user
            ( select "permissions"
                from "ClientEntityRole" r
                    where r."id" = x."clientEntityRoleId"
            ) as "permissions"
            from "TraceUser" u
                join "ClientEntityRoleBuUserX" x
                    on u."id" = x."userId"
                join "ClientEntityBu" bu
                    on x."clientEntityBuId" = bu."id"
            where u."id" = %(userId)s
            order by "buCode")
	
        select json_build_object(
                    'adminUserBuListPermissions', (SELECT json_agg(a) from cte1 a)
                    , 'businessUserBuListPermissions', (SELECT json_agg(b) from cte2 b)
                ) as "jsonResult"
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

    'getJson_clientEntityRoleBuUserX_businessUsers_clientEntityRole_clientEntityBu': '''
        with cte1 as (select x."id", b."buCode", b."buName", "role", "roleDescr", "uid", "userName", "userEmail",
			u."id" as "businessUserId", x."clientEntityRoleId", x."clientEntityBuId"
            from "ClientEntityRoleBuUserX" x
                join "ClientEntityBu" b
                    on x."clientEntityBuId" = b."id"
                join "ClientEntityRole" r
                    on x."clientEntityRoleId" = r."id"
                join "TraceUser" u
                    on x."userId" = u."id"
            where u."parentId" = %(userId)s
            order by x."id" DESC),

        cte2 as (select "id", "uid", "userName", "userEmail"
            from "TraceUser"
                where "parentId" = %(userId)s),

        cte3 as (select r."id", "role", "roleDescr" 
            from "ClientEntityRole" r
                join "ClientEntityX" x
                    on x."id" = r."clientEntityId"
            where
                x."userId" = %(userId)s),

        cte4 as (select b."id", "buCode", "buName"
            from "ClientEntityBu" b
                join "ClientEntityX" x
                    on x."id" = b."clientEntityId"
            where x."userId" = %(userId)s)

        select json_build_object(
                        'clientEntityRoleBuUserXs',(SELECT json_agg(row_to_json(a)) from cte1 a)
                        , 'businessUsers', (SELECT json_agg(row_to_json(b)) from cte2 b)
                        , 'clientEntityRoles', (SELECT json_agg(row_to_json(c)) from cte3 c)
                        , 'clientEntityBu', (SELECT json_agg(row_to_json(d)) from cte4 d)
                        ) as "jsonResult"
    
    ''',

    "getJson_clients_entities_adminUsers_clientEntityXs": '''
    with cte1 as (select "id", "clientCode", "clientName"
		from "TraceClient"
			where "isActive" = true order by "id" DESC)
	, cte2 as (select "id", "entityName"
		from "TraceEntity" order by "id" DESC)
    , cte3 as (select "id", "uid", "userName", "userEmail" 
            from "TraceUser" u
                where u."parentId" is null 
                    --and not exists(
                    --    select 1 from "ClientEntityX" c
                    --       where c."userId" = u."id"
                    --)
                order by u."id" DESC
        )
	, cte4 as (select x."id", "clientId", "entityId", "dbName", x."userId", "userEmail", "userName", uid, 
		"clientCode", "clientName", "entityName"
		from "ClientEntityX" x
			join "TraceClient" c on c."id" = x."clientId"
			join "TraceEntity" e on e."id" = x."entityId"
            join "TraceUser" u on u."id" = x."userId" order by x."id" DESC)        
            
        select json_build_object(
                'clients', (SELECT json_agg(row_to_json(a)) from cte1 a)
                , 'entities', (SELECT json_agg(row_to_json(b)) from cte2 b)
                , 'users', (SELECT json_agg(row_to_json(c)) from cte3 c)
                , 'clientEntityXs', (SELECT json_agg(row_to_json(d)) from cte4 d)
            ) as "jsonResult"
    ''',

    'getJson_entities_bu': '''
       with cte1 as (select b."id", "clientEntityId" , "entityName" , "buCode", "buName"
	        from "ClientEntityBu" b
		        join "ClientEntityX" x
			        on x."id" = b."clientEntityId"
			   	join "TraceEntity" e
			   		on e."id" = x."entityId"
	        where x."clientId" = %(clientId)s
            order by b."id" DESC)
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
            where  c."id" =  %(clientId)s and u."isActive" = true and c."isActive" = true
                    union
            select u."id", "uid", "userEmail"
			from "TraceUser" u
				join "TraceClient" c
					on u."id" = c."userId"
			where  c."id" =  %(clientId)s and u."isActive" = true and c."isActive" = true)
        , cte3 as ( -- rows against users created for this client and entity
            select c."id", "entityName", "uid", "userEmail", "dbName", "permissions"
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

    'getJson_roles_clienEntityId_entityName': '''
        with cte1 as (
		select r."id", "clientEntityId", "role","roleDescr", "permissions", "dbName", "userId"
			from "ClientEntityRole" r
				join "ClientEntityX" c
					on c."id" = r."clientEntityId"
			where "userId" = %(userId)s
			order by r."id" DESC)
	    , cte2 as (
            select x."id", "entityName"
				from "ClientEntityX" x
					join "TraceEntity" e
						on x."entityId" = e."id"
			where "userId" = %(userId)s)
        select json_build_object(
            'roles', (SELECT json_agg(a) from cte1 a)
            , 'clientEntityId', (SELECT "id" from cte2)
			, 'entityName', (SELECT "entityName" from cte2)
        ) as "jsonResult"
    ''',

    'getJson_userDetails': '''
        with cte1 as(--business user
            select u."id", "uid", "parentId", c."id" as "clientId", "clientCode", "clientName", 
 				"lastUsedBuCode", "lastUsedBranchId",
                 array_agg("entityName") as "entityNames",
				 ( select array_agg("buCode") 
				 	from "ClientEntityBu" b
				  		join "ClientEntityRoleBuUserX" x1
				  			on b."id" = x1."clientEntityBuId"
				  	where x1."userId" = u."id"
				 ) as "buCodes"
				 --, ( select "permissions"
				 -- 	from "ClientEntityRole" r
				 -- 		join "ClientEntityRoleBuUserX" x1
				 -- 			on r."id" = x1."clientEntityRoleId"
				 -- 		join "ClientEntityBu" b
				 -- 			on x1."clientEntityBuId" = b."id"
				 -- 	where "buCode" = u."lastUsedBuCode"				 
				 --) as "permissions"
                     from "TraceUser" u
                         join "ClientEntityX" x
                             on x."userId" = u."parentId"
                         join "TraceEntity" e
                             on e."id" = x."entityId"
 						join "TraceClient" c
 							on c."id" = x."clientId"
                         where ("uid" = %(uidOrEmail)s or "userEmail" = %(uidOrEmail)s)
                                 and u."isActive" = true
                                     and c."isActive" = true
                 group by u."id", c."id"),
        cte2 as( --admin user
            select u."id", "parentId", "uid", c."id" as "clientId","clientCode", "clientName", 
                    "lastUsedBuCode", "lastUsedBranchId",
                array_agg("entityName") as "entityNames",
                (select array_agg("buCode") 
                    from "ClientEntityBu" b
                        where b."clientEntityId" = x."id"
                ) as "buCodes",
                    null as "permissions"
                    from "TraceUser" u
                        join "ClientEntityX" x
                            on x."userId" = u."id"
                        join "TraceEntity" e
                            on e."id" = x."entityId"
                        join "TraceClient" c
                            on c."id" = x."clientId"
                        where ("uid" = %(uidOrEmail)s or "userEmail" = %(uidOrEmail)s)
                                and u."isActive" = true
                                    and c."isActive" = true
                    group by u."id" ,c."id", x."id")
            select json_build_object(
                    'businessUser', (select row_to_json(a) from cte1 a)
                    , 'adminUser', (SELECT row_to_json(b) from cte2 b)
                ) as "jsonResult"
    ''',

    'update_hash': '''
        update "TraceUser"
            set "hash" = %(hash)s
                where "userEmail" = %(userEmail)s
        returning "id"
    ''',

    "update_lastUsedBranchId": '''
        update "TraceUser"
            set "lastUsedBranchId" = %(branchId)s
                where "id" = %(userId)s
    ''',

    "update_lastUsedBuCode": '''
        update "TraceUser"
            set "lastUsedBuCode" = %(buCode)s
                where "id" = %(userId)s
    '''
}
