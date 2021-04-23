Documentation for json format for React Form in Trace

Properties
* type: Text
	name:"", value:"", label:"", validations:[], class:"", placeholder:"", onChange:"custom method name", onBlur:"custom method name", ibukiEmitMessage:"", ibukiFilterOnMessage: "" 

* type: Money
	All text properties (html input type = 'text') are respected. Also these properties are available:  thousandSeparator={true} thousandsGroupStyle="lakh" prefix={'₹ '} fixedDecimalScale= {true} decimalScale={2}. more properties can be found with react library 
	"react-number-format"
	
* type: Range
	name:"", label:"", layout:"table" // table means that first row of Range will have label and other rows will not have label heading
	class:"", pattern: {}

* type: Set
	label:"", name:"", class:"", validations:"", items:""

* type: Hidden, Div, textarea, Password, Radio, Checkbox, Select, Datepicker, Button, Submit

* type: Input
	htmlProps:{} // all html properties are passed as it is manner
	onChange, onBlur, label, name, value,

* type: Select
	ibukiEmitMessage:"", ibukiFilterOnMessage:"" (in options array)
