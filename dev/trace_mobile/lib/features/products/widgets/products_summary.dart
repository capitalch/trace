import 'package:flutter/material.dart';
import 'package:intl/intl.dart';
import 'package:provider/provider.dart';
import 'package:trace_mobile/features/products/classes/products_summary_state.dart';

class ProductsSummary extends StatelessWidget {
  const ProductsSummary({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    ThemeData theme = Theme.of(context);
    var formatter = NumberFormat('#,##,000');
    ProductsSummaryState productsSummaryState =
        Provider.of<ProductsSummaryState>(context, listen: true);
    return Container(
        height: 20,
        
        padding: const EdgeInsets.only(bottom: 2, top: 2, left: 15, right: 15),
        width: double.maxFinite,
        color: Colors.grey.shade300,
        child: SingleChildScrollView(
          scrollDirection: Axis.horizontal,
          child: Row(
            children: [
              Text(
                'Rows: ${formatter.format(productsSummaryState.summaryCount)}', //
                style: theme.textTheme.bodyText2//?.copyWith(color: Colors.white),
              ),
              const SizedBox(width: 15,),
              Text(
                'Qty: ${formatter.format(productsSummaryState.summaryClos)}', //
                style: theme.textTheme.bodyText2//?.copyWith(color: Colors.white),
              ),
              const SizedBox(width: 15,),
              Text(
                'Val: ${formatter.format(productsSummaryState.summarySum)}', //
                style: theme.textTheme.bodyText2//?.copyWith(color: Colors.white),
              ),
              const SizedBox(width: 15,),
              Text(
                'Val(Gst): ${formatter.format(productsSummaryState.summarySumGst)}', //
                style: theme.textTheme.bodyText2//?.copyWith(color: Colors.white),
              )
            ],
          ),
        ));
  }
}