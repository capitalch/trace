1. This node-app is developed as stop gap arrangement for transferring inventory data from capi2020 to capi2021.
2. This was developed when during the stock transfer there was error and stock was corrupted in capi2021
3. This is a very slow since it uses ODBC. The JDBC was far superior. Current process may take around 5+ minutes.
4. Both the source and dest databases should be up and running for this software to work.
5. ODBC must be setup in registry beforehand.
5. In case you want to use it for other databases, change the sourceConnString and destConnString in index.js file.
