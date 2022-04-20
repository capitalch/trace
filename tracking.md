### To do in sales
                                                                                        1. Add + icon in add button
                                                                                        2. Gstin, date, other validations
                                                                                        2. cgst, sgst, igst group spacing
                                                                                        3. Customer search
                                                                                        4. New / edit button
                                                                                        5. Product search
                                                                                        6. Summary, calculations, amount etc.
                                                                                        7. Serial no mechanism
                                                                                        8. Population of product details
                                                                                        9. Reset, roundoff, back cal buttons, Igst, Add button
                                                                                        10. saleVariety implementation
                                                                                        11. Ship to
12. Total error handling and show of submit
13. Submit functionality
14. View and drill through
15. Page reset
16. Total Debits / Credits
17. New error window in open space
18. Printing
                                                                                        19. Product code change populate
20. Discount manage
21. Taking up the correct prices etc.
22. Mapping the ui with megaData
                                                                                        23. receipts in 0.00 format
                                                                                        23. Address management with payment methods change
24. Address mapping when institution sales selected
25. validations
26. Email and SMS
27. Sale return


## Planning
a. Bank recon saving error has crept in
a. Permissions of Export etc to manager
b. Make product inactive
c. Stock journal
d. Purchase if change in last purchase price show alert
e. Multiple cash entries in receipt
0. Quick reports: Stock summary, daily sales, Jakar, orders, health
1. Include jData or serial no in sales report so that search on sl no may occur
2. ledger report for inventory
3. Stock journal
4. Dashboard reports: Sales, Products
5. SMS as html also
6. Meaningful server messages
7. Purchase invoice scanned pdf save
8. Debit credit notes printing
9. PDF print, BS, PL and TB. Export of PL, BL and TB should be lowest and highest levels, in PDF print
10. Edit from bank recon
11. Fix Accounts master, new contact twice
12. Show category hierarchy in products and stock and sales reports
13. Remember last product sale price and purchase price and pop them at purchase and sale entry time
14. Debit credit notes printing
15. Accounts address entry, do it modal and make email address optional
16. Journal, When ASSET GST is not allowed. Make it allowed for assets also
17. Voucher copy and paste
18. Bill wise payment
19. Automate orders mechanism
20. Notes, to do's, schemes

## Bugs
1. While purchase entry, if hsn is missed in beginning and at last hsn is given then submit button is not activated
3. Correct pricing of purchase and sales entry to dealer price and mrp. Iterate over other prices
4. Purchase entry, unable to enter GST price
5. Swapan reported selected count, totals etc not correct in vouchers
6. Deletion in product not working
 
# Priority
1.0 Data grid change font size control
2.0 Provision to input product price. At present cannot input product price
3. Headings and labels uniform font and naming
4. Left menu to make consige and more accomodating
5. Remove material-table from authentication/generic-crud; its using old version of material-ui
6. Accounts master, when edited, data is not refreshed after save
7. Provide a way to come out of app in mobile. Presently there is no way
8. Footer Trace version copyright
9. Universally make it responsive
10. Purchase invoice upload and search on metadata. Click will show invoice in PDF
11. First page reporting charts
12. Analysis reports
13. Approval of transactions
14. Server logs, client logs
15. Mechanism to connect to local or any other database on cloud
16. Provide a writeup on how GST is taken care in Trace, Documentation
17. Database backup and restore strategy
18. Payment gateway for purchase of Trace
19. Backup and restore strategy
20. Upgrade database for all instances

# 18-04-2022
1. Implemented missing permissions and uploaded
# 17-04-2022
1. Implemented in megaData the registerKeyWithMethod and ExecMethodFor key

# 16-04-2022
1. Continued with Sales

# 12-04-2022 - 15-04-2022
1. Added stock and ageing options in sales report
2. Continued with sale bill
3. Bug fix delete in product not working
4. Hot sale refresh
5. Deletion in product not working bug fixed
6. Time in sale report

# 11-04-2022
1. Simple sales continue
# 10-04-2022
1. Added stock in Sales report
2. Logical AND and logical OR for search
3. Search separated by special characters effectuated
4. Deployment to flask, staging and development
# 05-04-2022 - 09-04-2022
1. Addressed several Ui and launching bugs
2. Provide hsn in category leaf
3. Provided ageing in sales report
4. Simplified login process

# 03-04-2022 - 04-04-2022
1. Bug fixes for contacts
2. Fixed: When a new user is created since lastUsedBuCode in table TraceUser is null, the program crashes when Accounts menu item is clicked
3. Fixed: permissions not working properly issue
4. Change uid does not close the window

# 01-04-2022 - 02-04-2022
1. Implementation and bug fixing
2. Bug fixed: Sometimes when no cust details entry. Print preview click crashes program. In some situations it takes entry without customer details

# 31-03-2022
1. Finalized  SMS, email, implemented new sms
2. Bug fixed in finyears file

# 22-03-2022 - 30-03-2022
1. Working on new sales
3. Updated create scripts for new database creation

# 21-03-2022
Todo: purchase report,  start new simple sales, persistence
1. Added ref-no column in sales report
2. Completed purchase report
3. Prepared new persistence strategy for simple sales
4. Changes in db to allow same category under different parents

# 20-03-2022
1. Workbench: categories, Brands to sort
2. Optimized Accounts launchpa3. fixed bug for opening stock

# 10-03-2022 - 19-03-2033
1. Misc bug fix
2. Stock and ageing report, Sales report
3. DB scripts creation and upload

# 08-03-2022 - 09-03-2022
1. Database table modifications done for all schemas
2. Send New / Edit product info to clients through sockets
3. 
# 07-03-2022
1. Login error when key pressed, rectified
2. Category errors rectified
3. Vouchers: Instr no required when bank tran
4. Valuation for opening stock

# 29-02-2022 - 06-03-2022
1. Completed Opening stock with new product
2. Worked on XXGrid searchbox focus issue
3. AccOpBal issue resolved

# 23-02-2022 - 28-02-2022
1. Opening stock all items in continuation
2. Bug fixing etc.

# 15-02-2022 - 22-02-2022
1. Full implementation of socket based refresh data in vouchers, sales, purchase, dr/cr notes, Accounts masters and associated bug fixes
2. Account balances in vouchers and final reports

# 10-02-2022 - 14-02-2022
1. Fixed emails sent from server
2. Auto subledger concept implemented

# 09-02-2022 - 11-02-2022
1. Fixation of billing errors: 1+ days
2. Implementation of auto subledger: 2 days

# 27-01-2022 - 08-02-2022
1. Security and management redefined
2. Complete rework of authentication and user management
3. Lib upgradation client and server and Deployment
# 24-01-2022 - 26-01-2022
1. Working on authentication, rework on code to convert to x-grid-prof from material-table and prime data-table
# 21-01-2022 - 23-01-2022
1. Complete upgrade of all libraries
2. Complete migration of material ui from v4 to v5
3. General ledger save as pdf, bug fix
4. Several bug fixes which cropped up due to upgradation of libraries and material UI
5. Fixed many warnings
6. Snackbar Alert fix
7. PdfPrint dialog not appearing
8. Sales tab color fixing
9. All transactions Reverse checkbox uncheck not working
10. New contact in sales warning: 'value of input should not be null, it should be empty'
11. Many text boxes a box is coming
12. Voucher tab color problem
13. Bank recon after bank select not working
14. Product grid not working properly
15. Purchase return fix
16. Debit notes / credit notes tab color

# 17-01-2022 = 20-01-2022
1. Working on migration of v4.x to version 5.x

# 14-12-2021 - 16-01-2022
1. Printing of sale invoice, mail, SMS
2. Print vouchers
3. Print general ledger

# 06-12-2021 - 13-12-2021
1. Other works not for Trace

# 29-11-2021 - 05-12-2021
1. Opening balances final: Don't show balance up in the hierarchy, only show balances at lowest level

# 16-11-2021 - 28-11-2021
1. Research on PDF
2. fixed bug for transfer balances
3. Sale amount with GST error, fixed
4. Gst rate > 30 should be error completed
5. Sales: serial no error now fixed

# 13-11-2021 - 15-11-2021
1. Research on print pdf, scss to css in Python, consuming css in HTML template

# 27-10-2021 - 12-11-2021
1. Bank recon upgradations completed
2. Multiple bug fixes
3. Include common remarks, line remarks, line ref no, account names in bank recon
4. Data grid default reverse order issue corrected
5. All transactions, default is reverse, so let the checkbox be checked

# 23-10-2021 - 26-10-2021
1. Complete rework on sales, purchase, debit, credit notes, uplifting the state to launchpad level using useContext and Provider
2. Started work on bank recon as prof grid

# 21-10-2021 - 22-10-2021
2. Bug fixing for sales and purchases

# 19-10-2021 - 20-10-2021
1. Sales data persistent

# 18-10-2021
1. Working on sales values disappear when drawyer status changes
2. Change all reports date field valueGetter to valueFormatter
3. In xx-grid the Reverse is way too close to View select box

# 17-10-2021
1. Removed material table from all over in accounts
2. Rework on generic exports and common utilities
3. In mobile device, the title is way too close to header: corrected

# 13-10-2021 - 16-10-2021
1. Purchase horizontal alignment
2. All screens in accounts provided xx-grid and removed material table
3. All reports of accounts entity now use X-Grid
4. Branch master, finYear master rework
5. Brands and products reworked
6. Organize code for using shared components all over

# 11-10-2021 - 12-10-2021
1. Sales and purchases provided xx-grid
2. Product new entry hangs when 1st product is entered, when there is no leaf category

# 10-10-2021
1. Reorganized code
2. In all transaction reports date wise reverse + id sort
3. Vouchers view is not filled 2nd time, corrected
4. XXGrid viewLimit incorporated
6. Fix up bugs originated from reorganizing the code
7. When change company, UI freezes
8. Branch edit, Fy Year edit is not being possible. It is throwing server side error

# 05-10-2021 to 09-10-2021
1. Working on Material uI migration from V4.x to 5.x: failed

# 26-09-2021
1. Bug fix: General ledger opening balance always coming as 01/04//2021 now fixed: 30 mins
2. Bug fix: Error when no brands and No category leaf and new product entry now fixed: 1 hr
3. Bug fix: Bank recon: Last fin year with same current year rows were incorrectly coming now fixed: 1 hr
4. Bug fix: All Transaction reports: Remove opening balance: 30 mins

# 20-09-2021 to 4-10-2021
Other work

# 19-09-2021
Bug fix: General ledger for null entries

# 12-09-2021: Off for new-town flutter work

# 08-09-2021 - 11-09-2021
1. Completed drill down reports and bug fixes
2. Implemented reverseOrder in XXGrid
3. Reworked on XXGrid / ProfGrid

# 05-09-2021 - 07-09-2021
1. Drill down completed for Debit notes credit notes
2. bug fix: When in report filter then when returns filter does not fire

# 01-09-2021 - 04-09-2021
1. Drill down reports for purchase, sales, vouchers

# 16-08-2021 - 31-08-2021
1. GST journals
2. All vouchers in new style and with GST completed

# 06-08-2021 - 15-08-2021
1. Working on GST Journals

# 01-08-2021 - 5-08-2021
1. Making the XXGrid as generic multi-place grid
2. All transaction report has all fields

# 26-07-2021 - 31-07-2021
1. All transactions report

# 19-07-2021 - 20-07-2021
1. Fixed bug in purchase, gst amount does auto change
2. Upgraded all libs in trace-client. Fixed issue of library react-widgets

# 30-06-2021 - 23-07-2021
1. Other works apart from Trace

# 28-06-2021 - 29-06-2021
1. Fixed up some bug with link-server
2. Incorporated rxjs latest version 7.x

# 22-06-2021 - 27-06-2021
1. completed SMS sale using tkinter GUI library

# 20-06-2021 - 21-06-2021
1. Service extended warranty for Sony started
2. Reading Excel files in python

# Till 04-07-2021
1. Working on Service+ data upload to Trace in Python

# Till 19-06-2021
1. Completed link-server and implemented with trace
2. Trial balance is now getting updated auto
3. Changed deployment strategy
4. Service+ integration with pull sales info into Trace
5. Updated all libraries to latest versions

# 12-05-2021 - 25-05-2021
Did not work in Trace

# 11-05-2021
1. Purchase default date should be null
2. In mobile phones the top headings are overlapping

# 09-05-2021 - 10-05-2021
1. Daily balance for cash book in general ledger

# 27-04-2021 - 08-05-2021
1. Completed Track SMS sending.
2. Implemented SMS sending through fast2SMS
3. Investigated and applied for DLT registration
4. Updated server side deployment. Arrived at new strategy of deployment of TraceServer
5. Upgraded python code to latest
6. Overall revamp
7. Login screen should be modal, should work on "enter" key
8. Track+ SMS gateway for sale bills
9. PDF invoice through sms
10. Track+ billing throuh SMS gateway
11. ODF master documentation


# 21-04-2021 - 26-04-2021
1. Started with Electron app, created React App
2. UI created

# 19-04-2021 - 20-04-2021
1. Bug fix for in serial number for purchase, a comma was coming

# 18-04-2021
1. In purchase entry modify, the entries are shown as cash purchase
2. Purchase / purchase return bugs fix
3. Bug fix: In Bank recon if instr no is big it overlaps with adjacent column

# 03-04-2021 - 08-04-2021
1. GST all exports
2. Fixed multiple errors in export

# 02-04-2021
1. Meeting With Rancelab. Not connected to this project

# 01-04-2021 - 02-04-2021
1. Finished general ledger
2. Audit lock

# 31-03-2021
1. Started general ledger

# 29-03-2021 - 30-03-2021
1. Company select, fin year select, branch select as list and not drop down
2. Activation of user management and permissions

# 28-03-2021
1. Completed database upgrade plan
2. Alldatabases upgraded till sql-patch2
3. Flask.cloudjiffy.net upgraded to latest version
4. Audit lock when null then shows the current date. It should reflect null: fixed
5. In sales Account name and invoice not appearing: fixed

# 27-03-2021
1. Completed create database with pg_dump

# 26-03-2021
1. Cash purchase delete was not possible due to foreign key conflict. Now fixed
2. Non GST invoice logs GST in GST table
3. Non-gst invoice selected as gst invoice while edit
4. CGST / IGST selection error at time of edit in purchase / sale
5. Cash Purchase edit error 

# 23-03-2021 - 25-03-2021
1. Audit lock completed in sales, purchases, debit notes, credit notes, voucher transactions
2. No modify allowed if reconcillation already done
3. Add timestamps to many tables
4. Debit credit notes data entry error

# 22-03-2021
1. Thorough testing of all purchase and sale transactions including returns. Bug found in Purch ret which was fixed.

# 21-03-2021
1. Purchase return saving error; Null value in productId
2. Purchase search product does not work as expected
3. Edit sale saving priceGst is zero
4. Payment voucher view does not actually shows last No of records
5. Reports: all transactions: drop down list for no of rows shown. Retain the value selected. Similarly retain value selected in all such screens
6. Ledger view fonts correction
7. Balance sheet warning: There was error ...


# 19-03-2021 - 20-03-2021
1. Removed unused sql from sql.py file
2. Optimized basic sales / sales return / purchase / purchase return
3. Redo purchase for optimization
4. Bs & PL scroll table so that view in full screen
5. Manage tree expansion in all trees
6. Removed old sales as sales1
7. Inventory popups are not displaying correctly: fixed
8. New brand breaks the program: fixed

# 13-03-2021 - 18-03-2021
1. Completed basic sales / sales return / purchase / purchase return

# 03-03-2021 - 12-03-2021
1. Sale delete
2. bill To, ship To

# 02-03-2021
1. Purchase line remarks not working: fixed
2. Sales Remarks, Serial number treatment in saving
3. Total debits / total credits
4. Sales: footer instrNo and remarks save

# 22-02-2021 - 01-03-2021
1. sale-items component
2. sale-footer
3. reduce vertical space to accomodate more space

# 20-02-2021 - 21-02-2021
1. bill-To component complete
2. ship-to component

# 18-02-2021 - 19-02-2021
1. Sales head

# 17-02-2021
1. Sales revisit

# 07-02-2021 - 17-02-2021
1. purchase
2. Purchase return

# 30-01-2021 - 06-02-2021
1. Purchase                                                

# 16/01/2021 - 29-01-2021
1. Purchase

# 03/01/2021 - 15/01/2021
1. Working on purchase

# 02/01/2021
1. Completed 1st cut of Sales return

# 01/01/2021
1. Yeoman component generator extended for multiple components
2. Upgraded to React 17.1 but it failed with Opening balance component

# 31/12/2020
1. In sales Products delete implemented
2. Sale delete implemented
3. Sales return view

# 24-12-2020 - 30-12-2020
1. Sales return continue
2. Yeoman component generator

# 23-12-2020
1. Sales return UI
2. Move GSTIN validation centrally
3. Server insert return ID value
4. In sales if cust details not there then show validation error
5. Yeoman component generator

# 22-12-2020
nothing

# 21-12-2020
1. Sale edit: Manual gstin entry if not already there

# 19-12-2020 - 20-12-2020
1. Sale bill edit
2. Sale, Product entry should not delete first row
3. In Sale edit index not appearing
4. New sale button
5. View screen drop down
6. Sale edit, Igst checkbox
7. Sale edit Id management and modify -- save

# 09-12-2020 - 18-12-2020
1. Sale bill furtherance

# 08-11-2020 - 08-12-2020
1. Sale bill creation continue
2. Separate GSTIN in Sale bill body and its validation cycle

# 30-10-2020 - 07-11-2020
1. Working on sales and inventory

# 19-10-2020 - 29-10-2020
1. Working on Categories, Brands and Products

# 17-10-2020 - 18-10-2020
1. Working on Category CRUD in tree

# 13-10-2020 - 16-10-2020
1. Sale body
2. Additional database tables

# 12-10-2020
1. auto subledger

# 06-10-2020 - 11/10/2020
1. Other work not in Trace

# 04-10-2020 - 05-10-2020
1. Working on sales header
2. Fixing up country, state, city
3. Sales final data structure for capturing complete sales info

# 18-09-2020 - 03-10-2020
1. Rancelab

# 11-09-2020 - 17-09-2020
1. Sales full strategy completed
2. Sales header implementation started

# 10-09-2020
1. Voucher view mode Remarks is blank, corrected

# 09-09-2020
1. In many screens an auto horizontal bar is coming
2. Voucher modification. Date is converted to today's date

# 28-08-2020 - 08-09-2020
1. Sales

# 27-08-2020
1. Extension of database for accomodating contacts, Inventory and Sales purchases

# 26-08-2020 - 27-08-2020
1. React native warmup tutorial

# 21-08-2020 - 25-08-2020
1. Auto logout after few minutes of inactivity
2. Acc op bal, allow when debits and credits are not equal. In Final accounts if not matching, give Alert that there was difference in opening balances
3. Bug fix in UI

# 19-08-2020 - 20-08-2020
1. Permissions with templates and Role management

# 16-08-2020 - 18-08-2020
1. User permissions

# 15-08-2020
1. Manage BU made independent
2. Manage Role Create, Update, Delete, Permissions

# 14-08-2020
1. Bug fix: Corrected edit of Admin user
2. Provided cascade delete foreign key in database for User and Client
3. Cleaned up database
4. Manage clients reworked and fixed
5. manage entities reworked and moved to separate file
6. Associate user with client and entity

# 09-08-2020 - 13-08-2020
1. Control level user permissions
2. Bug fix: Masters: When edit self and then new entry done, it's still in edit mode.

# 03-08-2020 - 08-08-2020
1. Bug fixing and release
2, Bug fix: When associating users with entities by admin, it shows all users, but it should only show business users.

# 02-08-2020
1. Window width not stable

# 31-08-2020 - 01-08-2020
1. Correct and add GST control. Gst validation and retention of values
2. In mobile view voucher data not saved. Credit amount is not present in output
3. React unloaded warning happening after I used refresh in the dialog of accountsMaster. This happens when accType is changed in drop down, to refill the class drop down. The bug happens only with Add Group

# 27-07-2020 - 30-07-2020
1. Applied the react-material in superAdmin and admin crud operations. Misc login screens and admin screens are made responsive and material compliant
2. Universal loading screen concept implemented
3. Cleanup of unused tsx files
4. Remove backdrop from everywhere and convert to universal loading concept
5. When left menu is collapsed, not all space is occupied
6. Clickaway implemented for left menu item collapse

# 26-07-2020
1. generic-vouchers concept to receipts, contra, journals
2. Responsive completed prima facie for all vouchers
3. Bug removed: If from beginning bank account is selected, then also the instrNo is still disabled
4. Bank recon clear date not saving
5. Convert dataview to PrimeReact data table
6. Convert react form to material UI by default

# 20-07-2020 - 25-07-2020
1. Responsive
2. Change system to generic-forms
3. css classes for vouchers
4. Alignment of date
5. Required column with material ui
6. Remove label header concept for Range
7. Increase size of submit button and reduce size of Reset button

# 16-07-2020 - 19-07-2020
1. Launchpad mechanism implemented
2. Responsive continue
3. Main title height auto adjustible when view is changed from xs to higher and vice versa

# 08-07-2020 - 15-07-2020
1. Making responsive
2. Date validation fails for first time
3. Remove footer from mobile
4. react-form provide material controls

# 07-07-2020
1. Converted generic dialoges to material
2. Converted generic exports to responsive

# 29-06-2020 - 06-07-2020
1. Material-UI
2. Disable browser back
3. Continued with reponsive
4. Provided in mobile pull down no refresh, through CSS
5. Make responsive and ductable left menu

# 26-06-2020 to 28-06-2020
1. Responsive

# 21-06-2020 to 25-06-2020
1. Exports

# 20-06-2020
1. Trial balance, accounts master, Opening balance Global search
2. Include remarks, Instr no in view
3. Bank recon pagination
4. Make New / View Button invisible when not required
5. Connection pool exhausted error
6. In Accounts master new entry cursor always goes to last

# 19-06-2020
1. Reports: Show all transactions together, master transaction report
2. Global search mechanism
3. Did test entries of full accounts in database

# 16-06-2020 - 18-06-2020
1. Date entry better mechanism. Too many key strokes
2. Universal date format implementation
3. Bank recon improvement
4. Set global date format
5. Bug: Branch selection error
6. Bug: Trial balance shows negative
7. Bug: Noderef error when expanding left menu

# 14-06-2020 - 15-06-2020
1. Correct hierarchy of trial balance
2. Trial balance tree expanded
3. Balance sheet show tree expanded
4. Financial year date validations
5. Bug: There is something in main screen say accounts master. When you click on accounts, error occurs
6. Bug fix: Contra should not have both accounts as same
7. financial year click changer

# 12-06-2020 - 13-06-2020
1. Opening balance entry through hierarchy
2. Resolve update error in opening balance
3. Validation for debit and credit both there for opening balance
4. Recreate accounts.sql file. There were some changes in "trace" database

# 10-06-2020 - 11-06-2020
1. Resolve deployment issues
2. Accounts master retain expanded tree
3. Deploy and throughly test

# 08-06-2020 - 09-06-2020
1. Change PostGreSql version from 11.5 to 12.3

# 27-05-2020 - 07-06-2020
1. Bank recon

# 26-05-2020
1. Opening balance transfer error resolved
2. GST checkup
3. Renew SQL script generator
4. Individual voucher series numbering
5. Branch issue when selected 'aaa' and then shift another bu

# 24-05-2020 - 25-05-2020
1. Change left navigation menu
2. Show logo in top menu may be in middle
3. Change normal buttons to good quality buttons
4. Deploymen
5. Implement Company Info and reflect in all reports, headings
6. Opening balance does not show all leaf assets

# 13-05-2020 - 23-05-2020
1. Login to show Hello person after login successful
2. Transfer opening balance
3. Implement BranchId and FinYearId in select queries
4. Reorganize SQL with naming convention
5. Reorganize and minimize end points with maximizing on generic
6. Code for lastRefNo and Debit equals credit need to move to Accounts entity
7. Move all styles to app.scss file having classes and subclasses
8. Trial balance shows negative zero and Cr as opening total
9. Changed top menu look and feel

# 01-05-2020 - 12-05-2020
1. selection of BU, FY, Branch
2. Misc works

# 15-01-2020
1. DB alteration for last no, timestamp
2. Client side transformation of data to be saved in multiple tables for voucher
3. Strategy for auto numbering
5. POC for python pandas dataframe and pivot table for trial balance

# 16-01-2020
1. Server side error handling
2. Last voucher no and auto generate ref no
3. Client side make auto ref-no disabled
4. Trial balance server side 80%

# 17-01-2020
1. Trial balance server side 100%
2. Opening balances mecanism

# 18-01-2020
1. Researched various React Grid components and zeroed to react-table so far

# 19-01-2020
1. In Trial Balance aggregate the subledger accounts to ledger accounts
2. Finalized SQL for Trial balance which had a bug in union (removes duplicates)

# 20-01-2020
1. Research

# 21-02-2020, 22-02-2020, 23-02-2020, 24-02-2020, 25-02-2020
1. Client Trial Balance

# 26-01-2020, 27-01-2020, 28-01-2020, 29-01-2020
3. Form submit correction
4. Form level validations
1. validations redefine

# 30-01-2020
1. When changing forms from left menu item, payment-voucher does not retain values in range control
2. When coming back to form, the submit form does not work
3. Show server error

# 31-01-2020
1. At server side make sure that debits = credits before saving to database, otherwise throw error
2. Custom defined exception strategy at server, using an exception messages file

# 01-02-2020
1. When GST checkbox is clicked / unclicked, there is error in saving the data at server

# 02-02-2020
1. When graphql server is off, the system breaks. Show proper error message that server is not running

# 03-02-2020, 04-02-2020, 05-02-2020
1. Bug fix: Data saving with instr No in another table

# 06-02-2020
1. GST details, data saving in ExtGstTranD table

# 07-02-2020
1. GST validation item level and set level

# 08-02-2020, 09-02-2020
1. Ledger / subledger control and its validation
2. Auto fill cgst, sgst and igst
3. When you delete a row from range array, still debit amount does not reduce
4. validation in GST custom control

# 10-02-2020, 11-02-2020, 12-02-2020, 13-02-2020
1. Restructure ibuki messages
2. Auto populate credit text box from debit entries
3. Completed payment voucher new entry
4. Delete a row and save does not work

# 14-02-2020, 15-02-2020, 16--02-2020
1. Payment add in between does not set value but shows value in ledger / subledger
2. Ledger / SubLedger control does not persist data
3. Provide Reset button in payment voucher
4. Rename payment voucher to Payments
5. If not cash then instrNo is mandatory

# 15-02-2020, 15-02-2020, 17-02-2020, 18-02-2020, 19-02-2020, 20-02-2020
1. Decorate fields, Header, Edit and delete in the table
2. Reorganize code and make generic

# 21-02-2020, 22-02-2020, 23-02-2020
1. Edit functionality
2. Reorganize
3. Main window edit and view mode
4. Edit and delete functionality
5. View mode

# 24-02-2020
1. New button functionality
2. Delete confirm
3. Reset button to remove errors

# 25-02-2020
1. Disable control issue

# 26-02-2020
1. Navigation of view edit and new streamlined
2. Implemented spinner in view mode
3. Better user experience in view mode
4. When edit mode starts remove earlier form level errors
5. Scroll view in div for edit delete
6. In edit mode, disable reset button and provide cancel button. After submit, control transfers to view with the 		corresponding line selected.
7. Edit mode delete any row
8. New record line remarks not saving
9. InstrNo issue
10. Reverse order

# 27-02-2020, 28-02-2020, 29-02-2020, 01-02-2020, 02-03-2020, 03-03-2020
1. React tabular view research and pagination
2. Completion of CRUD operation
3. Global filter in data view
4. Performace, caching, pagination and quick load in dataView
5. Left menu modification with all voucher in the vouchers menu item

# 04-03-2020, 05-03-2020
1. Trial balance since ajax calls if clicked many times, component load warning of React.
2. Generalize global filter
3. Delete while modifying
4. Bug: When doing modify, auto ref no is getting incremented
5. Rework on menu
6. Trial balance correction for subledgers
7. React version upgrade

# 06-03-2020, 07-03-2020, 08-03-2020, 09-03-2020, 10-03-2020, 11-03-2020, 12-03-2020
1. Balance sheet, server and client side
2. PL server and client side
3. Accounts master server and client side

# 13-03-2020, 14-03-2020, 15-03-2020
1. Accounts master

# 16-03-2020 to 28-03-2020
1. Complete Account master
2. Complete Op balances
3. Complete showing of ledger accounts, drill down

# 29-03-2020 to 31-03-2020
1. Receipts
2. Contra
3. Journals

# 01-04-2020 - 07-04-2020
1. Login
2. Authentication

# 08-04-2020 - 20-04-2020
1. Reorganize
2. Authentication
3. After much time of inactivity create user or delete a user throws client side error
4. Snackbar messaging

# 21-03-2020 - 30-04-2020
1. Completed authentication module
2. Show some message or waiting cursor at client while creating a user and sending activation mail.

# 31-04-2020
1. Edit / new is not retaining values bug fix
2. When balance sheet is selected then click payroll, then click accounts. Error occurs.
3. Client side change entity 'super-admin' to 'authentication'