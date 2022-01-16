import React, { useEffect, useState, useRef, useContext } from 'react'
import { Component8 } from './component8'
import { useIbuki } from '../utils/ibuki'

function Component6() {
    const { filterOn } = useIbuki()
    return (
        <div>
            <button
                onClick={() => {
                 console.log(number2text(912454455.12))
                }}>
                Convert
            </button>
        </div>
    )

    function number2text(value:any) {
        var fraction = Math.round(frac(value)*100);
        var f_text  = "";
    
        if(fraction > 0) {
            f_text = "AND "+convert_number(fraction)+" PAISE";
        }
    
        return convert_number(value)+" RUPEE "+f_text+" ONLY";
    }
    
    function frac(f:any) {
        return f % 1;
    }
    
    function convert_number(number:any)
    {
        if ((number < 0) || (number > 999999999)) 
        { 
            return "NUMBER OUT OF RANGE!";
        }
        var Gn = Math.floor(number / 10000000);  /* Crore */ 
        number -= Gn * 10000000; 
        var kn = Math.floor(number / 100000);     /* lakhs */ 
        number -= kn * 100000; 
        var Hn = Math.floor(number / 1000);      /* thousand */ 
        number -= Hn * 1000; 
        var Dn = Math.floor(number / 100);       /* Tens (deca) */ 
        number = number % 100;               /* Ones */ 
        var tn= Math.floor(number / 10); 
        var one=Math.floor(number % 10); 
        var res = ""; 
    
        if (Gn>0) 
        { 
            res += (convert_number(Gn) + " CRORE"); 
        } 
        if (kn>0) 
        { 
                res += (((res=="") ? "" : " ") + 
                convert_number(kn) + " LAKH"); 
        } 
        if (Hn>0) 
        { 
            res += (((res=="") ? "" : " ") +
                convert_number(Hn) + " THOUSAND"); 
        } 
    
        if (Dn) 
        { 
            res += (((res=="") ? "" : " ") + 
                convert_number(Dn) + " HUNDRED"); 
        } 
    
    
        var ones = Array("", "ONE", "TWO", "THREE", "FOUR", "FIVE", "SIX","SEVEN", "EIGHT", "NINE", "TEN", "ELEVEN", "TWELVE", "THIRTEEN","FOURTEEN", "FIFTEEN", "SIXTEEN", "SEVENTEEN", "EIGHTEEN","NINETEEN"); 
    var tens = Array("", "", "TWENTY", "THIRTY", "FOURTY", "FIFTY", "SIXTY","SEVENTY", "EIGHTY", "NINETY"); 
    
        if (tn>0 || one>0) 
        { 
            if (!(res=="")) 
            { 
                res += " AND "; 
            } 
            if (tn < 2) 
            { 
                res += ones[tn * 10 + one]; 
            } 
            else 
            { 
    
                res += tens[tn];
                if (one>0) 
                { 
                    res += ("-" + ones[one]); 
                } 
            } 
        }
    
        if (res=="")
        { 
            res = "zero"; 
        } 
        return res;
    }

    function convertNumberToWords(amount: any) {
        var words = new Array();
        words[0] = '';
        words[1] = 'One';
        words[2] = 'Two';
        words[3] = 'Three';
        words[4] = 'Four';
        words[5] = 'Five';
        words[6] = 'Six';
        words[7] = 'Seven';
        words[8] = 'Eight';
        words[9] = 'Nine';
        words[10] = 'Ten';
        words[11] = 'Eleven';
        words[12] = 'Twelve';
        words[13] = 'Thirteen';
        words[14] = 'Fourteen';
        words[15] = 'Fifteen';
        words[16] = 'Sixteen';
        words[17] = 'Seventeen';
        words[18] = 'Eighteen';
        words[19] = 'Nineteen';
        words[20] = 'Twenty';
        words[30] = 'Thirty';
        words[40] = 'Forty';
        words[50] = 'Fifty';
        words[60] = 'Sixty';
        words[70] = 'Seventy';
        words[80] = 'Eighty';
        words[90] = 'Ninety';
        amount = amount.toString();
        var atemp = amount.split(".");
        var number = atemp[0].split(",").join("");
        var n_length = number.length;
        var words_string = "";
        if (n_length <= 9) {
            var n_array:any = new Array(0, 0, 0, 0, 0, 0, 0, 0, 0);
            var received_n_array = new Array();
            for (var i = 0; i < n_length; i++) {
                received_n_array[i] = number.substr(i, 1);
            }
            for (var i = 9 - n_length, j = 0; i < 9; i++, j++) {
                n_array[i] = received_n_array[j];
            }
            for (var i = 0, j = 1; i < 9; i++, j++) {
                if (i == 0 || i == 2 || i == 4 || i == 7) {
                    if (n_array[i] == 1) {
                        n_array[j] = 10 + parseInt(n_array[j]);
                        n_array[i] = 0;
                    }
                }
            }
            let value:any = "";
            for (var i = 0; i < 9; i++) {
                if (i == 0 || i == 2 || i == 4 || i == 7) {
                    value = n_array[i] * 10;
                } else {
                    value = n_array[i];
                }
                if (value != 0) {
                    words_string += words[value] + " ";
                }
                if ((i == 1 && value != 0) || (i == 0 && value != 0 && n_array[i + 1] == 0)) {
                    words_string += "Crores ";
                }
                if ((i == 3 && value != 0) || (i == 2 && value != 0 && n_array[i + 1] == 0)) {
                    words_string += "Lakhs ";
                }
                if ((i == 5 && value != 0) || (i == 4 && value != 0 && n_array[i + 1] == 0)) {
                    words_string += "Thousand ";
                }
                if (i == 6 && value != 0 && (n_array[i + 1] != 0 && n_array[i + 2] != 0)) {
                    words_string += "Hundred and ";
                } else if (i == 6 && value != 0) {
                    words_string += "Hundred ";
                }
            }
            words_string = words_string.split("  ").join(" ");
        }
        return words_string;
    }
}

export { Component6 }
