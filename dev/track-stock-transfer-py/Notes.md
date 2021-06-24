1. This python script (stock-transfer) is developed as stop gap arrangement for transferring inventory data from capi2020 to capi2021.
2. This was developed when during the stock transfer there was error and stock was corrupted in capi2021
3. This was developed when node.js app working odbc appeared to be slow
4. This is very fast in comparison to node counterpart
4. Both the source and dest databases should be up and running for this software to work.
5. ODBC must be setup in registry beforehand.
5. In case you want to use it for other databases, change the sourceConnString and destConnString in stock-transfer.py file.
6. 