## Branch Transfer
# New design
																							- Dest branch should not have current branch
																							- Line item correction
																							- BranchTransferStore correction
																							- Validations
																								- Dest branch
																								- qty != 0
																								- productId should be there
																								- Date
																							- Error management
																							- Reset functionality
- Submit functionality
- DB changes
- Report changes
- View grid


## Branch features
- Consolidated final reports
- Consolidated bank recon

																							## Purchase preview
																							- For purchase return
																							- Final invoice value with amount in words																							
																							## To Do 20-04-2024
																							- Purchase preview
																								- Provide preview icon in purchase view
																								- Provide preview icon in edit purchase
																								- implement preview
## Immediate to Do
																								- Remove and delete database of bika and all its users and clean the database
- Maintenance
																								- Part 1
																									- Create an admin user sanjeev using temp email and a database bille
																									- Create a BU billenium
																									- Create some inventory and check inv reports. That will not be coming
																									- Update database with latest patch and check inventory reports
																									- Do corrective actions
																								- Part 2
																								- delete the new admin user and new database
																								- using pg_dump create the new accounts.sql file
																								- update code at server
																								- repeat part 1
																								- create new accounts
																								- create new products

																							- Create new client and new admin user
																								- Setup inventory
																								- Check why not audit_table is created and rectify that
																								- Check why sales report are not visible and rectify that
																								- Check why stock transaction not visible

##  Bugs
																								- Reset purchase and purchase ret after drill down from trial balance. Otherwise on Purchase it shows the populated values
																								- PurchPurchase entry saved but not reset
																								- Purchase return from purchase wrong behavior
## Plan for Checkup
																								- delete all purchase and purchase return
																								- New purchase entry
																									- Check trial balance
																									- Enter purchase invoice
																									- Verify trial balance
																									- Verify GST report
																									- Verify stock
																								- New purchase Return entry
																									- Check trial balance
																									- Enter purchase invoice
																									- Verify trial balance
																									- Verify GST report
																									- Verify stock
																								- New purchase return from purchase entry
																									- Check trial balance
																									- Enter purchase invoice
																									- Verify trial balance
																									- Verify GST report
																									- Verify stock
																								- Delete Purchase Return entry
																									- Check trial balance
																									- Enter purchase invoice
																									- Verify trial balance
																									- Verify GST report
																									- Verify stock
																								- Delete Purchase Return entry
																									- Check trial balance
																									- Enter purchase invoice
																									- Verify trial balance
																									- Verify GST report
																									- Verify stock
																								- Delete purchase Entry
																									- Check trial balance
																									- Enter purchase invoice
																									- Verify trial balance
																									- Verify GST report
																									- Verify stock
## Purchases new
- When prod code is given sometimes wrong selection. Say for prod code 11 the prod code 1013 is selected
																								- Drill down from balance sheet, trial balance, ledgers
																									- Prevent multi load purchase
																									- Close on submit and reset

																									- Bug: When edit purchase Ret, it becomes purchase

- Final thorough checkup with a new entry and then delete
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