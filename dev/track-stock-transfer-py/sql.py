sqls = {
    'get-counters': '''
        select * from counter
    ''',

    'get-godowns': '''
        select * from godown
    ''',

    'get-products': '''
        select * from product
    ''',

    'get-inv-main': '''
        select * from inv_main
    ''',

    'insert-tempC': '''
        insert into tempC(counter_id,counter_code, counter_name)
            values(?,?,?)
    ''',

    'truncate-tempC': '''truncate table tempC''',

    'insert-tempG': '''
        insert into tempG(gw_id, gw_code, gw_descr)
            values(?,?,?)
    ''',

    'truncate-tempG': '''
        truncate table tempG
    ''',

    'insert-tempP': '''
        insert into tempP(pr_id, item, brand, model, sl_no, op_price, last_price, last_date,
            acc_id_sale_tax, spec, basic_price, show, code, bar_code, counter_id, isfittoorder)
            values(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)
    ''',

    'truncate-tempP': '''
        truncate table tempP
    ''',

    'insert-tempI': '''
        insert into tempI(op, db, cr, inv_main_id, pr_id, trf_db, trf_cr, gw_id, op_price, TallyDate, IsDisputed, IsIgnored)
        values(?,?,?,?,?,?,?,?,?,?,?,?)
    ''',

    'truncate-tempI': '''
        truncate table tempI
    ''',

    'pre-process': '''
        update acc_setup set maxcode=(select max(code) from product);
        
        insert into counter(counter_code,counter_name) select counter_code, counter_name from tempC where not exists(select 0 from counter a where a.counter_code = tempC.counter_code);
        
        insert into godown(gw_code,gw_descr) select gw_code,gw_descr from tempG where not exists(select 0 from godown a where a.gw_code = tempG.gw_code );
        
        update product set op_price = if b.last_price is null or b.last_price = 0 then
            b.op_price else b.last_price endif
            from product a join tempP b on
                a.item = b.item 
                and a.brand = b.brand
                and a.model = b.model;
        
        update inv_main set op=d.op + d.db - d.cr
            from inv_main a join product b on a.pr_id = b.pr_id
                join tempP c on b.item = c.item and b.brand = c.brand and b.model = c.model 
                    join tempI d on c.pr_id = d.pr_id;

        update tempP a 
            set counter_id =(select counter_id from counter 
                where counter_code = (select counter_code from tempC where counter_id = a.counter_id));

    ''',
    'insert-product': '''
        insert into product( item,brand,model,acc_id_sale_tax,basic_price,last_date,last_price,op_price,sl_no,spec,show,counter_id,isfittoorder ) 
            select item,brand,model,acc_id_sale_tax,
            basic_price,last_date,last_price,op_price,
            sl_no,spec,show,counter_id,isfittoorder from tempP where not exists(select 0 from product a where a.item = tempP.item and a.brand=tempP.brand and a.model=tempP.model)
    ''',
    'update-tempI': '''
        update tempI set pr_id = (
            select a.pr_id from product a join tempP b on a.item=b.item and a.brand = b.brand and a.model = b.model 
                where tempI.pr_id = b.pr_id);
        delete from tempI where pr_id in(select pr_id from inv_main);
    ''',

    'insert-inv-main': '''
        insert into inv_main(op,db,cr,gw_id,pr_id,trf_db,trf_cr,TallyDate,IsDisputed,IsIgnored) select
            (op+db-cr),0,0,1,pr_id,0,0,TallyDate,IsDisputed,IsIgnored from tempI;     
    ''',

    'drop-temp-tables': '''
        drop table if exists tempG;
        drop table if exists tempC;
        drop table if exists tempI;
        drop table if exists tempP;
    '''

}