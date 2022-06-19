import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:trace_mobile/features/vouchers/classes/vouchers_state.dart';
import 'package:trace_mobile/features/vouchers/widgets/vouchers_appbar_title.dart';
import 'package:trace_mobile/features/vouchers/widgets/vouchers_body.dart';
import 'package:trace_mobile/features/vouchers/widgets/vouchers_header.dart';
import 'package:trace_mobile/features/vouchers/widgets/vouchers_summary.dart';

class VouchersPage extends StatelessWidget {
  const VouchersPage({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    context.read<VouchersState>().init();
    return Scaffold(
      appBar: AppBar(
        automaticallyImplyLeading: false,
        title: const VouchersAppBarTitle(),
      ),
      body: Column(children: const [
        VouchersHeader(),
        SizedBox(
          height: 5,
        ),
        VouchersBody(),
        SizedBox(height: 5),
        VouchersSummary()
      ]),
    );
  }
}
