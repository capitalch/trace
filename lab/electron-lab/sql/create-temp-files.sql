if not exists(select table_name from systable where table_name = 'tempC') then
  CREATE TABLE "DBA"."tempC" (
    "counter_id"                     unsigned int NOT NULL
   ,"counter_code"                   char(10) NOT NULL
   ,"counter_name"                   varchar(20) NOT NULL
   ,PRIMARY KEY ("counter_id") 
)
end if
go

if not exists(select table_name from systable where table_name = 'tempG') then
  CREATE TABLE "DBA"."tempG" (
    "gw_id"                          numeric(3,0) NOT NULL
   ,"gw_code"                        char(15) NOT NULL
   ,"gw_descr"                       varchar(20) NOT NULL
   ,PRIMARY KEY ("gw_id")
)
end if
go

if not exists(select table_name from systable where table_name = 'tempP') then
CREATE TABLE "DBA"."product" (
   "pr_id"                          unsigned int NOT NULL
   ,"item"                           char(10) NOT NULL
   ,"brand"                          char(20) NOT NULL
   ,"model"                          char(20) NOT NULL
   ,"sl_no"                          char(1) NOT NULL DEFAULT 'N' check(sl_no in( 'Y','N' ) )
   ,"op_price"                       "T_money" NULL
   ,"last_price"                     "T_money" NULL
   ,"last_date"                      date NULL
   ,"acc_id_sale_tax"                integer NULL
   ,"spec"                           varchar(90) NULL
   ,"basic_price"                    "T_money" NULL
   ,"show"                           char(1) NOT NULL DEFAULT 'Y'
   ,"code"                           unsigned int NOT NULL
   ,"bar_code"                       varchar(20) NULL
   ,"counter_id"                     unsigned int NOT NULL
   ,"isfittoorder"					 bit default 1
   ,PRIMARY KEY ("pr_id")  
)
end if
go

if not exists(select table_name from systable where table_name = 'tempI') then
  CREATE TABLE "DBA"."tempI" (
    "op"                             integer NOT NULL
   ,"db"                             integer NOT NULL
   ,"cr"                             integer NOT NULL
   ,"inv_main_id"                    unsigned int NOT NULL
   ,"pr_id"                          unsigned int NOT NULL
   ,"trf_db"                         integer NOT NULL DEFAULT 0
   ,"trf_cr"                         integer NOT NULL DEFAULT 0
   ,"gw_id"                          numeric(3,0) NOT NULL
   ,"op_price"                       decimal(10,2) NULL
   ,"TallyDate"                      date NULL
   ,"IsDisputed"                     bit NOT NULL DEFAULT 0
   ,"IsIgnored"                      bit NOT NULL DEFAULT 0
   ,PRIMARY KEY ("inv_main_id")
)
end if
go