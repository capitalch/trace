
# Good React.js libraries
1. react-load-spinner
2. react-animated-burgers for animated menus
3. react-responsive-carousel
4. react-markdown
5. statelake : a good state maintainance library

# Lessons Learned

## Technology used
React, GraphQL, Flask, Graphene, Python, postgreSql

## Methodology
For Inserts and Updates of data, the entire data is converted to a big JSON object with all master and details data to be inserted in tables at back end. This JSON object is sent to GraphQL / Flask server as GraphQL mutation. The same is saved in PostgreSQL db using Graphene and Python.

# Flask deployment while serving static files and index.html from Apache web server.
Go through ood at my documentation of cloudjiffy

# Flask tips
## Understanding of template_folder, static_url_path, static_folder
These can be set during construction of the app object
In TraceServer->traceMain see:
app = Flask(__name__, static_folder="../static",
            template_folder="../build")
template_folder: The html templates / files are stored here. Just define a template_folder and keep only html files and corresponding resources in it.
static_folder keeps the js/css files etc.

I used blueprint to create a "track" module. In this module I used:
trackApp = Blueprint('trackApp', __name__,
                     template_folder='templates', static_folder='static', static_url_path='/track/view/css')
I created a folder "templates" and stored billTemplate.html in it. It worked fine but didn't call the bill.css stored in the static folder. When I set the static_url_path as above and set the  <link href="css/bill.css" rel="stylesheet"> in billTemplate.html it worked. Explaination: The static_url_path becomes the path of resource file and that resource file will be served from static folder. Remember that the path should not be same as any route of flask app otherwise it will take precedence and it will not work. The above path translates to url http://localhost:5000/track/view/css/bill.css and it will look for bill.css in static folder under track folder. File location and url path have no relation, but above setting maps there two and enforces that when a resource with that url is asked it will be taken from static folder.

# Reducing the build size of React app
in package.json file use "build": "set \"GENERATE_SOURCEMAP=false\" && react-scripts build", in "scripts" tag.
This removed the map files
gzipping
"postbuild": "gzip build/static/js/*.js && gzip build/static/css/*.css"

# Creating and activating virtual env in windows in context of Trace
Download and Install Python from installer
cd c:\projects\trace
1. python -m pip install virtualenv
2. python -m venv env
3. env\Scripts\activate
4. pip install flask demjson simplejson psycopg2 requests ariadne pandas flask_cors nested_lookup flask_mail pyjwt datetime bcrypt autopep8 xlsxwriter flask_scss flask_weasyprint babel
5. in .vscode settings.json
{
    "python.pythonPath": "c:\\projects\\trace\\env\\Scripts\\python.exe",
    "python.formatting.provider": "autopep8"
}
6. In launch.json I put this:
{
    // Use IntelliSense to learn about possible attributes.
    // Hover to view descriptions of existing attributes.
    // For more information, visit: https://go.microsoft.com/fwlink/?linkid=830387
    "version": "0.2.0",
    "configurations": [
        {
            "name": "Python: Flask",
            "type": "python",
            "request": "launch",
            "module": "flask",
            "env": {
                "FLASK_APP": "tserver.py",
                "FLASK_ENV": "development",
                "FLASK_DEBUG": "0"
            },
            "args": [
                "run",
                "--no-debugger",
                "--no-reload"
            ],
            "jinja": true
        }
    ]
}
7. To start development server from command line in a command window:
  a) env\Scripts\activate
  b) cd dev\traceServer
  c) set FLASK_APP=traceServer  // no spaces
  d) flask run

complete

* Because of settings.json the environment is switched to "env"

## Deployment procedures at Cloudjiffy Docker container / saas
# Step 1: Build client
  a) Build application with **npm run build** at trace-client. This will create build folder, inside that static folder.
# Step 2: Create local server environment, zip and upload
  a) Create a local Deployment folder, in that copy TraceServer
  b) Take out static folder from build folder and copy both in deployment folder adjacent to TraceServer folder. So you have in Deployment TraceServer, build, static
  c) Copy the server side config.json in TraceServer folder. Originally it has client side config.json
  c) zip the TraceServer, build, static folders and upload to cloudjiffy and unzip it
  d) At cloudjiffy you must have folder structure TraceServer, build ,static
  e) Restart application server cloudjiffy

# Step 3: Create virtualenv if not there and install using pip
1. virtualenv virtenv
2. cd virtenv/bin
3. . activate
4. When virtenv is activated run this command:
```pip install ...```

5. wsgi.py file is already edited to make use of virtenv
6. Restart nodes and check log in httpd/error_log
Completed.
try flask.cloudjiffy.net

# Notes
1. use pip install pyjwt and not pip install jwt. The jwt is wrong module
2. To install a new module cd /var/www/webroot/ROOT/virtenv/bin
  . activate
  Check the dot. Otherwise you will get permission error
3. We are using flask_cors library. By default it does not allow all http headers in the request. To allow a custom header with the request, you need to specifically add that in traceserver.py file   as follows:
  CORS(app, expose_headers='SELECTION-CRITERIA')
  here 'SELECTION-CRITERIA' is custom header. Otherwise you won't get it in server. This digout costed me an entire Sunday.
4. Important to see the config.json file at client. It contains the development and production url for Graphql endpoint.

## Server side Tips
* I will be using several json strings from client to be sent to server having graphQL. The json string will be used to create SQL statements for data insertion in db. Python makes use of properly formatted JSON having double quotes (""). This is valid json ``` {"a":"1", "b":"2"} ``` in Python whereas ``` {a: "1", b:"2"} ``` is not. Python simplejson and json library's loads method won't work on invalid json. Use demjson.decode('not a goog json') to make use of bad json in Python. This will save you from escaping json string when you send it as graphql mutation argument.

* For using cors in flask do this:
	```pip install flask_cors```
	In code:
	``` from flask_cors import CORS
	CORS(app)```

* Always remember to wrap the results of GRAPHQL query into a data container as 
 ```
    "data":{
        "hello": "Hello world"
    }
 ```
If you don't do that then the Apollo client of React will not be able to recognize it and fail. client.query(...) will fail at client if data is not inside a "data" wrapper. I wasted lots of time figuring it out.

* Consider following GraphQL query:
    ``` 
    query myQuery{
        generic(tableName:"AccM")
    } 
    ```

*    Here the purpose is, you give a table name and you requires all data of the table. If properly implemented at server it will give a list of String. Each String is a tuple converted to string. You may require a list of list instead of list of tuples. By converting tuple to list you can attain that. Original data before conversion is as follows:
    ```
    {
  "data": {
    "generic": [
      "(1, 'BranchDivision', 'Branch / Divisions', 'L', 'branch', None, 'N', True, None)",
      "(2, 'Capitalaccount', 'Capital Account', 'L', 'capital', None, 'N', True, None)",
      "(6, 'CurrentLiabilities', 'Current Liabilities', 'L', 'other', None, 'N', True, None)",
      "(10, 'LoansLiability', 'Loans Liability', 'L', 'loan', None, 'N', True, None)",
      "(14, 'Suspense', 'Suspense A/c', 'L', 'other', None, 'N', True, None)",
      "(15, 'CurrentAssets', 'Current Assets', 'A', 'other', None, 'N', True, None)",
      "(23, 'MiscExpences', 'Misc Expences (Asset)', 'A', 'other', None, 'N', True, None)",
      "(24, 'Investments', 'Investments', 'A', 'other', None, 'N', True, None)",
      "(25, 'IndirectExpences', 'Indirect Expences', 'E', 'iexp', None, 'N', True, None)",
      "(26, 'Purchase', 'Purchase Accounts', 'E', 'purchase', None, 'N', True, None)",
      "(27, 'DirectExpences', 'Direct Expences', 'E', 'dexp', None, 'N', True, None)",
      "(28, 'DirectIncome', 'Direct Incomes', 'I', 'dincome', None, 'N', True, None)",
      "(29, 'Indirectincome', 'Indirect Incomes', 'I', 'iincome', None, 'N', True, None)",
      "(30, 'Sales', 'Sales Account', 'I', 'sale', None, 'N', True, None)",
      "(3, 'CapitalSubgroup', 'Capital Account Subgroup', 'L', 'capital', 2, 'N', False, None)",
      "(4, 'Capital', 'Capital', 'L', 'capital', 3, 'Y', True, None)",
      "(5, 'ReservesAndSurplus', 'Reserves & Surplus', 'L', 'capital', 2, 'N', True, None)",
      "(7, 'DutiesAndTaxes', 'Duties & Taxes', 'L', 'other', 6, 'N', True, None)",
      "(8, 'Provisions', 'Provisions', 'L', 'other', 6, 'N', True, None)",
      "(9, 'SundryCreditors', 'Sundry Creditors', 'L', 'creditor', 6, 'N', True, None)",
      "(11, 'BankOd', 'Bank OD Account', 'L', 'bank', 10, 'N', True, None)",
      "(12, 'SecuredLoans', 'Secured Loans', 'L', 'loan', 10, 'N', True, None)",
      "(13, 'UnsecuredLoans', 'Unsecured Loans', 'L', 'loan', 10, 'N', True, None)",
      "(16, 'BankAccounts', 'Bank Accounts', 'A', 'bank', 15, 'N', True, None)",
      "(17, 'CashInHand', 'Cash-in-Hand', 'A', 'cash', 15, 'N', True, None)",
      "(18, 'BankOCC', 'Bank Cash Credit', 'L', 'bank', 10, 'N', True, None)",
      "(19, 'DepositsAsset', 'Deposits (Asset)', 'A', 'other', 15, 'N', True, None)",
      "(20, 'StockInHand', 'Stock in Hand', 'A', 'other', 15, 'N', True, None)",
      "(21, 'LoansAndAdvances', 'Loans & Advances (Asset)', 'A', 'other', 15, 'N', True, None)",
      "(22, 'SundryDebtors', 'Sundry Debtors', 'A', 'debtor', 15, 'N', True, None)"
    ]
  }
    } 
    ```
    
    Data after conversion is as follows:
    ```
    {
  "data": {
    "generic": [
      "[1, 'BranchDivision', 'Branch / Divisions', 'L', 'branch', None, 'N', True, None]",
      "[2, 'Capitalaccount', 'Capital Account', 'L', 'capital', None, 'N', True, None]",
      "[6, 'CurrentLiabilities', 'Current Liabilities', 'L', 'other', None, 'N', True, None]",
      "[10, 'LoansLiability', 'Loans Liability', 'L', 'loan', None, 'N', True, None]",
      "[14, 'Suspense', 'Suspense A/c', 'L', 'other', None, 'N', True, None]",
      "[15, 'CurrentAssets', 'Current Assets', 'A', 'other', None, 'N', True, None]",
      "[23, 'MiscExpences', 'Misc Expences (Asset)', 'A', 'other', None, 'N', True, None]",
      "[24, 'Investments', 'Investments', 'A', 'other', None, 'N', True, None]",
      "[25, 'IndirectExpences', 'Indirect Expences', 'E', 'iexp', None, 'N', True, None]",
      "[26, 'Purchase', 'Purchase Accounts', 'E', 'purchase', None, 'N', True, None]",
      "[27, 'DirectExpences', 'Direct Expences', 'E', 'dexp', None, 'N', True, None]",
      "[28, 'DirectIncome', 'Direct Incomes', 'I', 'dincome', None, 'N', True, None]",
      "[29, 'Indirectincome', 'Indirect Incomes', 'I', 'iincome', None, 'N', True, None]",
      "[30, 'Sales', 'Sales Account', 'I', 'sale', None, 'N', True, None]",
      "[3, 'CapitalSubgroup', 'Capital Account Subgroup', 'L', 'capital', 2, 'N', False, None]",
      "[4, 'Capital', 'Capital', 'L', 'capital', 3, 'Y', True, None]",
      "[5, 'ReservesAndSurplus', 'Reserves & Surplus', 'L', 'capital', 2, 'N', True, None]",
      "[7, 'DutiesAndTaxes', 'Duties & Taxes', 'L', 'other', 6, 'N', True, None]",
      "[8, 'Provisions', 'Provisions', 'L', 'other', 6, 'N', True, None]",
      "[9, 'SundryCreditors', 'Sundry Creditors', 'L', 'creditor', 6, 'N', True, None]",
      "[11, 'BankOd', 'Bank OD Account', 'L', 'bank', 10, 'N', True, None]",
      "[12, 'SecuredLoans', 'Secured Loans', 'L', 'loan', 10, 'N', True, None]",
      "[13, 'UnsecuredLoans', 'Unsecured Loans', 'L', 'loan', 10, 'N', True, None]",
      "[16, 'BankAccounts', 'Bank Accounts', 'A', 'bank', 15, 'N', True, None]",
      "[17, 'CashInHand', 'Cash-in-Hand', 'A', 'cash', 15, 'N', True, None]",
      "[18, 'BankOCC', 'Bank Cash Credit', 'L', 'bank', 10, 'N', True, None]",
      "[19, 'DepositsAsset', 'Deposits (Asset)', 'A', 'other', 15, 'N', True, None]",
      "[20, 'StockInHand', 'Stock in Hand', 'A', 'other', 15, 'N', True, None]",
      "[21, 'LoansAndAdvances', 'Loans & Advances (Asset)', 'A', 'other', 15, 'N', True, None]",
      "[22, 'SundryDebtors', 'Sundry Debtors', 'A', 'debtor', 15, 'N', True, None]"
    ]
  }
}
```

* In psycopg2 driver for postgresql you use cursor to execute sql statements. The select statement is case sensitive for table names. If an error occurs while executing SQL, the subsequent sql executions also fail saying some 'Transaction closed' error. To prevent that you need to do cursor.execute("ROLLBACK") as follows:
 ``` 
 try:
        cursor = connection.cursor()
        sql = f'select * from "{tableName}"'
        try:
            cursor.execute(sql)
            res = cursor.fetchall()
        except(Exception) as error:
            print(error)
            cursor.execute("ROLLBACK")
    except(Exception) as error:
        print(error)
    finally:
        cursor.close() 
```

* You can use tableNames and columnsNames as parameter in Postgresql. For that one extension "AsIs" is used.
```from psycopg2.extensions import AsIs```
Your SQl is:
``` 
select %(fieldName)s from %(tableName)s
            where "id" = %(id)s
```
From Python server code using psycopg2
```
clientCodeObj = execSql(ENTITY_NAME, sqlString, {
        'fieldName': AsIs('"clientCode"'), 'tableName': AsIs('"TraceClient"'), "id": valueDict['data']['clientId']}, False)
```
execSql is a method which executes sql statement using cursors. It manages connections, commits and rollbacks.
Check the usage of AsIs('"clientCode"'). It passes the field name clientCode in case sensitive manner to underlying sql statement. It worked.

## Data format sample for master details JSON data. Python genericUpdateMasterDetails method at server consumes this data format
{
  tableName: 'name of table'
  data: [
    {
      col1: 'col1 value'
      col2: 'col2 value'
        ...
    }
  ],
  details: [
    {
      "tableName": "name of details table",
      "fkeyName": "tranHeaderId",
      "data": [
        {
          col1: 'col1 value'
          col2: 'col2 value'
        ...
        }
      ],
      "deletedIds": [1,2,3...],
      "details": [
          ... further nesting
      ]
    }
  ]
}


## pgadmin and maintainance tips

* New cloudjiffy database postgresql 12.2
Host: *******
Login: ******
Password: *******
port: *****

## Taking a dump of existing uptodate database and provision it to TraceServer
1. pg_dump -d trace -h node41766-chisel.cloudjiffy.net -p 11107 -n demounit1 -f c:\projects\trace\DbCreate\accounts.sql -U webadmin --inserts
    It creates the accounts.sql file
2. Replace all instances of 'demounit1' with 'public'
3. The file contains several insert table data. Remove the ones which are not required. Basically only retain the master data as in old accounts.sql file

* How to take a dump of database schema and data together through pg_dump
pg_dump -d trace -h node41766-chisel.cloudjiffy.net -p 11107 -n public -f c:\accounts -U webadmin --inserts
  -d trace            : Take dump of database trace
  -h host_name        : give host name
  -p 11035            : port name of cloudjiffy
  -n public           : take dump of schema public
  -f c:\accounts.sql  : Outputs to c:\accounts.sql file
  -U user name        : Give user name
  --inserts           : In generated sql file use insert statement for adding data. By default copy statement is there which is not recognized by psycopg2 python driver. So it is necessary to convert copy statements to insert statements. The --inserts flag does that work
  You need to have administrative privilege

* Calling a stored procedure
  call reset()

* To delete a database trace, oper query of another db and do this:
SELECT pg_terminate_backend(pg_stat_activity.pid)
    FROM pg_stat_activity
    WHERE pg_stat_activity.datname = 'trace'
      AND pid <> pg_backend_pid();
drop database trace;

* How to upgrade a database to next major version, say from postgresql 11.3 to 12.3 as source and target respectively
Most of the methods of pgAdmin and cloudjiffy upgrade tag failed. Only following pgdump and psql methods worked.
Step 1: Create a new posegresql 12.3 server
Step 2: Make a dump of the database in question by using pg_dump command line utility
pg_dump -d trace -h node15792-chisel.cloudjiffy.net -p 11035  -f c:\trace -U webadmin; it will ask the password; host and port number are for source
Step 3: Run psql
psql -d trace -h node41766-chisel.cloudjiffy.net -p 11107  -f c:\trace -U webadmin; it will ask the password; mind that here the host and port numbers are for target

** How I ran pg_dump at cloudjiffy for doing backup and then later restore
In the installation of PostgreSql at cloudjiffy there is a folder by name backup. 
a) cd to that backup folder
b) pg_dump -f accounts.sql -U **username** trace
trace is the database name. This creates a backup file accounts.sql in the current folder
c) If you want to restore the accounts.sql:
1) Create a new database locally, say traceLocal.db
2) download the accounts.sql backup file from cloudjiffy server
3) In local command window:
  cd to folder where accounts.sql is present
  run following command
    psql -U username -f accounts.sql traceLocal
  this will load the database in the newly created database traceLocal

* Creating and deleting business unit or schema
1) Business unit or bu is mapped to schema of database. If from Trace UI you create a new bu through admin user menu, then a new schema is auto created in database and corresponding entry is added in 'ClientEntityBu' table of 'TraceEntry' database. 
    a) If you delete the buCode from Trace UI then entry from 'ClientEntityBu' is only deleted, the physical schema is not deleted from database. 
    b) You need to manually delete the schema from database. 
    c) If you accidently deleted the buCode from Trace UI, but the corresponding schema already exists in database then, adding the corresponding buCode through Trace UI will add it in 'ClientEntityBu' table without overwriting or disturbing the physical schema in database.

## Python tips
* x = "('abc', 'def', 'ghi')". To convert x to ('abc', 'def', 'ghi') just do eval(x)
* In Python None is equivalent of null. To check None --> if someVariable is None ...

## Postgresql tips
### Calling a stored procedure
  call sp_name()

### switching to another schema say demounit1
set search_path to demounit1;

### Using recursive CTE queries in PostGreSQL
Recursive CTE's can be used in hierarchical tables with id <-> parentId relationships. Suppose you want to find allrecords which are parent or superParent of a given record. Say in "AccM" table you want all superParents for record whose id = 137.
Step 1: Find the next record above the starting record
  
  You need a cte for starting record to get the next record with starting record.parentId = id of next record. Following gives the next record

  with cte as (select "id", "accName", "accLeaf", "parentId" 
  from  "AccM"
    where "id" = 137)
  select a."id", a."accName", a."accLeaf", a."parentId"
    from cte c
      join "AccM" a
        on c."parentId" = a."id"

Step 2: Turn cte to recursive cte and union with starting record. Keep everything inside the cte. Remember that you start from starting record and keep going up. The next record becomes starting record and so on.
So the cte first gets starting record. Then cte.parentId = "AccM"."id" becomes next record and so on

  with recursive cte as (select "id", "accName", "accLeaf", "parentId" 
    from  "AccM"
      where "id" = 137
    union
    select a."id", a."accName", a."accLeaf", a."parentId"
      from cte c
        join "AccM" a
          on c."parentId" = a."id")
    select * from cte

## Yeoman component generator
In the Yeoman folder of trace:
  > yo comp
  It will ask for comma separated list of components to generate. If you give test1, test2, test3 then all these components along with corresponding hooks will be generated in respective 
  folders.

  In a new machine you need to install yeoman globally (npm install -g yeoman)
  Also do > npm link inside the folder generator-comp to let it available in the machine. 

## Client side React tips

* For environment I used process.env.NODE_ENV. It has a value 'development' when started by 'npm start'. NODE_ENV has value 'production' if it is deployed to a server after ```npm run build```. I created a config.json file. There were two properties in it 'production' and 'development' and corresponding url's. Now based on the deployment corresponding url's were connected.

* In React always name a component with first letter capital as 'MyComponent' and not 'myComponent'
* In new versions of React the hooks name start with 'use' and Rool of Hooks is followed
* For state management I did not use Redux. In JavaScript, in multiple files if you import same file, the file is only impoted once and code in the file is executed with first reference of the file. So if you create a store object in a file, which is not in a function, then the state of the store is maintained in multiple files. The 'global-form-service' has a store and this store maintains the data of each form in the system through its formId.
* By default if you use the same graphql client, it will cache the data and will not even fetch data from server after first call. To avoid that either use cache false policy or create a new client for each fetch.
* Important note about <input type = 'date'> control: It always internally stores data in iso date ('YYYY-MM-DD') format, but displays the data in browser's locale format. So when you use it in React do this, otherwise it won't work properly:
See meta.current.thisDate is in format 'YYYY-MM-DD'
```
const meta: any = useRef({
    thisDate: moment().format('YYYY-MM-DD')
})

return <TextField
      type='date'
      onChange={e => {
        meta.current.thisDate = e.target.value
        setRefresh({})
      }}
      value={meta.current.thisDate}>
    </TextField>
```

## React basic important understanding
1. Every react functional component renders twice if you make use of useRef or useState. To change this behavior remove React.strictMode from index.tsx
2. A parent React component can have a child component say <ComponentA> in two ways:
  a) Render in parent as return (<ComponentA someProp={value}></ComponentA>) . In this way if child component is refreshed then parent component is not refreshed
  b) Render in parent as return ( {ComponentA(value)}). In this way if child component is refreshed then parent component is also refreshed.

## React Component load event lifecycles
* Hook is just a React component with no markup. It is a React component without any visual interface.
* Comp1 has Comp2 has Comp3 has hookA
* Lifecycle is:
  Body Comp1, Body Comp2, Body Comp3, Body hookA
  LayoutEffect hookA, LayoutEffect Comp3, LayoutEffect Comp2, LayoutEffect Comp1
  useEffect hookA, useEffect Comp3, useEffect Comp2, useEffect Comp1

  So in brief sequence is parent body, child body, child layouteffect, parent layouteffect, child useEffect, parentuseEffect
* When child is refreshed then parent is not refreshed
* When parent is refreshed then child is refreshed with sequence parent body, child body, child layout, parent layout, child effect, parent effect
* When a hook is refreshed then its parent which hosted the hook, is also refreshed
* you can have useLayoutEffect and useEffect multiple times in a component
* useLayoutEffect is syncronous and is run before useEffect

## How to do auto login as 'd' in development environment
In trace-header.ts > useEffects > enable the line having 'shortCircuit'. To undo autologin comment out 'shortCircuit' line

## Auto logout after inactivity
Implemented by using react-idle-timer library in trace-header

## client side graphql tips
* You are sending graphql mutations which contains json objects. Please please escape the double quotes by ```str.replace(/"/g,"\\\"")```. Otherwise there will be error. Escaping the parameter json and sending through graphql inserts it correctly in postgresql after removing the escape character.

## Client side CSS tips
* Anything defined in SCSS file is applicable application wide. For local styling you can very well use styled-components. But if you want to define classes at local level consider using makeStyles and createStyles of material-ui. Using them you can define local css classes and use them in code. Further use clsx library wherein you can apply multiple classes together for className attribute. Combination of makeStyles, createStyles and clsx is killer combination.
* Material-ui is defacto standard for responsive design. Make use of useMediaQuery, which gives updated result when you change the screen. I successfully tried out window resize event along with window.innerWidth and lodash debounce, which worked but is less efficient. Even window.matchMedia event works fine but found material-ui useMediaQuery as ultimate solution.

## material UI tips

* It is good to use Roboto fonts, material meta tag and CssBaseLine

**  In public / index.html, include following in <head> tag:
    <meta
      name="viewport"
      content="minimum-scale=1, initial-scale=1, width=device-width, shrink-to-fit=no"
    />
    <link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Roboto:300,400,500,700&display=swap" />
    <link rel="stylesheet" href="https://fonts.googleapis.com/icon?family=Material+Icons" />

** To include CssBaseLine I added <CssBaseline /> in AppMain component which is the topmost component
* Use Typography for any type of text wherever possible. Use Paper, Container or Box as div.
* Use module clsx to apply multiple classes to an element

* When you want to change style of all input in a page using material component TextField
const useStyles = makeStyles((theme) => ({
    root: {
        '& .MuiInputBase-root': {
            fontSize: '30px',
            color: 'red'
        }
    },
}))
<form className={classes.root} noValidate autoComplete="off">
  ...
  use <TextField> here
This way all the TextField will have color = red and fontSize = 30px. I got MuiInputBase-root from Chrome Elements tab

* To select all children use '& > * '

* Generate classes at the bottom of file using makeStyles material construct and use those classes all over in the code file. These css classes are local for this code file and not global. Remember that if you write any scss in the app.scss or any other .scss file that becomes global. It is very difficult to manage that once the project becomes big. It is always recommended to use local class files. Full process
  a) import { makeStyles, useTheme, Theme, createStyles } from '@material-ui/core/styles'
  b) In function component at the begining:
      const theme = useTheme()
      const classes = useStyles()
  c) After the export statement of function component
            ```
            const useStyles: any = makeStyles((theme: Theme) =>
            createStyles({
                menuButton: {
                    marginRight: theme.spacing(2),
                },
                hide: {
                    display: 'none',
                },
                appBarButton: {
                    minHeight: 'inherit'
                    , border: '1px solid transparent'
                    , "&:hover": { border: `1px solid ${theme.palette.background.default}` }
                    , textTransform:'capitalize' // First letter to be capital. By default material makes all button text as uppercase
                }
              })
            )
        ```
    d) Now function component you can use the menuButton, hide and appBarButton as className
      ```
        <Button
            size='large'
            variant="outlined"
            color='inherit'
            className={classes.appBarButton}  <--- see the use
            endIcon={<ArrowDropDown></ArrowDropDown>}
            onClick=
      ```
* Overriding existing classes of Material UI components. A material UI component is composed of several elements. Each element has its own set of classes which collectively provide look and feal of complete material ui component. All elements are nested inside a 'root' element.
You can override / merge the classes of root element and its nested children elements. Each mat ui component has a 'classes' attribute which is different than the className attribute. You can use the className attribute, but if it does not work due to specificity then you can make use of 'classes' object. Here is the way;
a) Just create a new css class say 'myRoot' inside the 'createStyles' as shown above by making use of makeStyles, createStyles, useStyles and so on.
b) In the documentation of Button api you can see the rules such as root, label, text, textPrimary and so on. You can customize any of these rules by using 'classes' attribute which is an object. See how:
  1) Suppose I already created 'myRoot' class following the above procedure.
        ```
        createStyles({
        myRoot: {
            backgroundColor: 'teal'
            , textTransform:'capitalize'
        },
        ```
  2) This is how to use 'classes' attribute of Button
  ```
        <Button size='large' variant="outlined" color="inherit"
            className={classes.appbarButton}
            classes = {{
                root: classes.myRoot <--- See how I have injected the myRoot class in the root element of Button component
                }
            }>
            Button 1
        </Button>
  ```

* By default all buttons of material have uppercase. To make it first letter only uppercase use textTransform: 'none' in the class or style

* A tricky case for making close button in dialogbox at top right corner
```
<Dialog
      open={meta.current.showDialog}
      maxWidth='sm'
      onClose={() => {
          closeDialog()
      }}>
      <DialogTitle disableTypography id="simple-dialog-title"  <--- disableTypography does the trick. Check the dialogTitle class
          className={classes.dialogTitle}>
          <h2>
              {meta.current.dialogConfig.title}
          </h2>
          <IconButton size='small' color="default"
              onClick={closeDialog} aria-label="close">
              <CloseIcon />
          </IconButton>
      </DialogTitle>
      <DialogContent>
          <Comp></Comp>
      </DialogContent>
      <DialogActions>
          <TraceSubmitButton
              onClick={() => {
                  submitDialog()
              }}></TraceSubmitButton>
          <TraceCancelButton
              onClick={
                  () => {
                      closeDialog()
                  }}></TraceCancelButton>

      </DialogActions>
</Dialog>
```
```
...
dialogTitle: {
    display: 'flex'
    , justifyContent: 'space-between'
    , alignItems: 'center'
}
...
```

* material-table is good datatable for material react UI. You need to set the 'icons' property, otherwise basic icons will not be visible
* A very tricky case of TextField of material UI. TextField is a set of many controls. If you want to customize the <input> control inside TextField you must use inputProps attribute. This is how I changed color to red and increased the width:
```
<TextField
  className= {classes.textField}
  inputProps={{
    style: {
      color: 'red',
      width: '10rem'
    }
  }}
  type='date'
  onChange={e => {
    setField(parent, item.name, e.target.value)
    setRefresh({})
  }}
  value = {getField(parent, item.name) || ''}
  >
</TextField>
```
See how I provided a blank value for the value field. This is important to stop the warning of uncontrolled React component. For every controlled React component an initial value is important.
*** Universal loading indicator. trace-loading-indicator is universal loading indicator which can be activated from any part of software. It uses material "Backdrop" control.

### Adding a new entity / module
* A new module is called entity in Trace software. As on 18th Now 2019 there are two entities 'accounts' and 'sample-forms'. When you add a new entity in trace you have to go through following process in order to make use of 'react-forms' dynamic forms utility.

** Create a components-catalog.tsx file, which outputs all components as key (name of component), value ( the component itself) object in the entity root folder.
** Create a register-artifacts.tsx file wchich makes use of 'useIbuki' hook and does 'emit' all components. This is implemented as hook.
** In 'TraceMain' component, use the hook created in register-artifacts.tsx file, maybe named as 'useArtifacts'. This is just to load the file at this stage in order to enable 'emit' of 'useIbuki' after the 'filterOn' of 'useIbuki' hook. The 'useArtifacts' hook is not used in the 'TraceMain', it is just used to invoke the hook so that occurence of subscription happens before the emit of Ibuki. In React child component useEffect is called first then the parent component's.
** In TraceLoadedComponent subscribe and merge the d.data to 'allComponents' object by using Object.assign method.
** Register the ibuki source and recipient in 'ibuki-message-catalog'

### Client side framework
* Ibuki messaging is extensively used through rxjs reactive library.
* DataCache mechanism is implemented. That means, at first page load all fixed data is cached. That fixed data is available through hotEmit / hotFilterOn Ibuki mechanism. Once data is cached you can use that data in various select or other controls without retrieving them from server. Tha dataCache can be a nested big object directly retrieved from server without any transformation. How it is implemented? 
	1. In trace-left component graphql query is executed with await. 
	2. After the query results are available, the same is done hotEmit (from ebuki). Since emit is performed before filterOn, hence hot is used. Ibuki message is 'DATACACHE-SUCCESSFULLY-LOADED'.
	3. Remember that in JavaScript when you import a file in different components, the file is only loaded once. So this mechanism can be used to implement a global object. In trace-global-objects there is a 'subs' object. This is all Ibuki subscriptions for all entities. In custom-methods file filterOn is implemented inside a Promise. The promise is consumed in the 'generic-item' as doInitForSelect() method. I tried it with async await but it did not work out. Only the way it is implemented it worked.
	4. The json form template file uses the 'methodName': 'dataCache', args:['arg1', 'arg2' ...]. The dataCache is merely a method in the custom-methods file, and nothing more than that.
* For number formatting and input of numbers a library react-number-format is used. It is used in the Money control in html-core.tsx
* For searchable drop down a library react-select is used.

## Postman
* Used for sending data to Flask server. For mutation all data sent to server is JSON data. The JSON data from Postman was of following format. Check the "" for string format. The '' does not work. Inside "" the json data needs to be escaped. The content-type is application/json. 

mutation { jAddAdam(inputJson:
" { \"parent\": {            \"name\": \"adam1\", \"value\": { \"sample\": \"def\" } }}"
) { id    }    }

This is a mutation with name jAddAdam. This is a test scenario. All insert and update data will have similar JSON which is converted to SQL's at server by using a generic function in Python
