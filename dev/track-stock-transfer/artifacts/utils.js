const fs = require("fs");
const odbc = require("odbc");
const path = require("path");
const { sqls } = require("./sql");

async function createTempTables(connString) {
  try {
    fs.readFile(
      path.join(__dirname, "create-temp-files.sql"),
      async (error, data) => {
        if (error) {
          throw error;
        }
        let conn;
        try {
          const conn = await odbc.connect(connString);
        } catch (e) {
          console.log(e.message);
        }
        try {
          const dt = data.toString();
          const ret = (await conn) && conn.query(dt);
        } catch (e) {
          console.log(e.message);
        } finally {
          conn && conn.close();
        }
      }
    );
  } catch (e) {
    console.log(e);
  }
}

async function doAllTransfers(sourceConnString, destConnString) {
  await createTempTables(destConnString); // create temp tables in destination datatbase
  await transferData(sourceConnString, destConnString);
  await processDest(destConnString);
}

async function processDest(destConnString) {
  let destConn;
  try {
    destConn = await odbc.connect(destConnString);
    const [
      preProcessSql,
      insertProductSql,
      updateTempISql,
      insertInvMainSql,
      dropTempTables,
    ] = [
      sqls["pre-process"],
      sqls["insert-product"],
      sqls["update-tempI"],
      sqls["insert-inv-main"],
      sqls["drop-temp-tables"],
    ];

    await destConn.query(preProcessSql);
    console.log("Preprocessing done");

    await destConn.query(insertProductSql);
    console.log("Inserted data in product table");

    await destConn.query(updateTempISql);
    console.log("Updated some temp tables");

    await destConn.query(insertInvMainSql);
    console.log("Updated inv_main table");

    await destConn.query(dropTempTables);
    console.log("Dropped temp tables");
  } catch (e) {
    console.log(e);
  } finally {
    destConn && destConn.close();
  }
}

async function transferData(sourceConnString, destConnString) {
  let sourceConn, destConn;
  try {
    destConn = await odbc.connect(destConnString); //.then(()=>{}).catch(()=>{})
    sourceConn = await odbc.connect(sourceConnString); //.then(()=>{}).catch(()=>{})

    const getCountersSql = sqls["get-counters"];
    const getGodownSql = sqls["get-godowns"];
    const getProductsSql = sqls["get-products"];
    const getInvMainsSql = sqls["get-inv-main"];

    const counterData = await sourceConn.query(getCountersSql);
    const productsData = await sourceConn.query(getProductsSql);
    const godownsData = await sourceConn.query(getGodownSql);
    const invMainData = await sourceConn.query(getInvMainsSql);

    // tempC
    console.log("Transfering data to tempC from Counter...");
    const insertTempCSql = sqls["insert-tempC"];
    await destConn.query(sqls["truncate-tempC"]);
    for (item of counterData) {
      await destConn.query(insertTempCSql, [
        item.counter_id,
        item.counter_code,
        item.counter_name,
      ]);
    }
    console.log("tempC completed");

    // // tempG
    console.log("Transfering data to tempG from godown...");
    const insertTempGSql = sqls["insert-tempG"];
    await destConn.query(sqls["truncate-tempG"]);
    for (item of godownsData) {
      await destConn.query(insertTempGSql, [
        item.gw_id,
        item.gw_code,
        item.gw_descr,
      ]);
    }
    console.log("tempG completed");

    // product
    console.log(
      "Transfering data to tempP from product. It will take a while..."
    );
    const insertTempPSql = sqls["insert-tempP"];
    await destConn.query(sqls["truncate-tempP"]);
    for (item of productsData) {
      await destConn.query(insertTempPSql, [
        item.pr_id,
        item.item,
        item.brand,
        item.model,
        item.sl_no,
        item.op_price,
        item.last_price,
        item.last_date,
        item.acc_id_sale_tax,
        item.spec,
        item.basic_price,
        item.show,
        item.code,
        item.bar_code,
        item.counter_id,
        item.isfittoorder,
      ]);
    }
    console.log("tempP completed");

    // inv_main
    console.log(
      "Transfering data to tempI from inv_main. It will take a while..."
    );
    const insertTempISql = sqls["insert-tempI"];
    await destConn.query(sqls["truncate-tempI"]);
    for (item of invMainData) {
      await destConn.query(insertTempISql, [
        item.op,
        item.db,
        item.cr,
        item.inv_main_id,
        item.pr_id,
        item.trf_db,
        item.trf_cr,
        item.gw_id,
        item.op_price,
        item.TallyDate,
        item.IsDisputed,
        item.IsIgnored,
      ]);
    }
    console.log("tempI completed");
  } catch (e) {
    console.log(e.message);
  } finally {
    sourceConn && sourceConn.close();
    destConn && destConn.close();
  }
}

module.exports = { createTempTables, doAllTransfers, process, transferData };
