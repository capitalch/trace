																									## Debit note / Credit note view not working. Giving errors
## QA script
																									- Delete all purchase invoices
																									- Select a physical invoice and create all products
																									- Check Stock inventory and trial balance figures and write them down

																									- Add entries for invoice. Verify trial balance and inventory: OK
																									- Verify entry in table ExtTanDGst table: OK

																									- Create normal purchase return and verify trial balance and inventory: ok
																									- Verify entry in table ExtGstTranD table:OK
																									- Delete purchase return and verify entries as above: OK

																									- Do purchase return after selecting an already entered invoice
																									- Verify trial balance and inventory
																									- delete purchase return and verify entries

## Purchase
- Security in purchase
																									- salePurchaseDeletedIds if empty array then save error at server
																									- Purchase delete of lineItem not working. Row still remains in SalePurchaseDetails table
																									- Sum of item values has floating point approximations. Use big.js
																									- Purchase edit: Total amount at bottom is not changing
																									- Purchase view index should be serially ASC
- Drill down compatibility
																									- purchase ret
																									- submit for insert, update and delete
																									- Exhaustive check
																									- Column Account: Inter Photo, Capital Photo etc.
																									- delete				
																									- Descr column at end
																									- Change icons to PDF and EXCEL icons				
																									- Serial numbers not working
																									- Total amt vs invoice amount not tallying in case of Inter foto
																									- edit
																									- Search
																									- No of rows select
																									- Export pdf
																									- Export Excel
																									- Refresh
																									- Column Aggr, Gst's, Remarks
																									- wrap text
																									- numeric, rignt aligned
																									- date format
																									- Attach columns and data
																									- summary: Aggregate (count, Sum aggr, sum cgst, sgst, igst, amount, )
																									- columns: labels, Serial numbers, product codes, hsn