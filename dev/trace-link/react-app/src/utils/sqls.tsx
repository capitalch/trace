const sqls: any = {
    'track-get-company-info': `
        select comp_name,addr1, addr2, pin, phone, email, pan, free1, free2, free3, free4, gstin
            from acc_setup
    `,

    'track-get-payment-details': `
        select (select acc_name from acc_main where acc_id = j.acc_id ) as acc_name, bv_amt as amount, bv_chequeno as chequeNo
        from bill_memo b
            join bill_memo_journal j on
                b.bill_memo_id = j.bill_memo_id
            where b.bill_memo_id = ?
    `,

    'track-get-product-details': `
        select item, brand, model, code, qty, price, discount, m.spec, m.hsn  
            from bill_memo_product m
                join inv_main i
                    on i.inv_main_id = m.inv_main_id
                join product p
                    on p.pr_id = i.pr_id
            where bill_memo_id = ?
    `,

    'track-sale-sms': `
    select NUMBER(*) id, "date", b.bill_memo_id, "name", TRIM("addr1" + ' ' + "addr2") "address",pin, phone, email, mobile, stateCode, 
    (select LIST(item + ' ' +brand + ' ' + model) from 
        bill_memo_product m1
            join inv_main i1
                on i1.inv_main_id = m1.inv_main_id
            join product p1
                on p1.pr_id = i1.pr_id
        where bill_memo_id = b.bill_memo_id
        ) as product,
        acc_name, ref_no,  total_amt, type, bill_memo, roundoff, if b.gstin is not NULL then b.gstin else c.gstin endif as gstin, b.cgst, b.sgst, b.igst,
        t.cgst as cgstRate, t.sgst as sgstRate, t.igst as igstRate
        
        from bill_memo b
            left outer join acc_main a
                    on a.acc_id = b.acc_id
            join tax t
                    on b.sale_tax_sale_id = t.acc_id
            left outer join customer c
                    on c.cust_id = b.cust_id
        where "type" = 's' and
        "date" = ?
        order by "date", b.bill_memo_id;
    `,
}

export { sqls }
