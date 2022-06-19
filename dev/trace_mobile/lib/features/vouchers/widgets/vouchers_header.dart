import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:trace_mobile/features/vouchers/classes/vouchers_state.dart';

class VouchersHeader extends StatelessWidget{
  const VouchersHeader({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return Consumer<VouchersState>(
      builder: (context, value, child) {
        return Container(
          color: Colors.grey.shade200,
          width: double.maxFinite,
          alignment: Alignment.center,
          child: Text(
            'Vouchers last ${value.queryKey} rows',
            style: Theme.of(context)
                .textTheme
                .subtitle1
                ?.copyWith(fontWeight: FontWeight.bold),
          ),
        );
      },
    );
  }
}