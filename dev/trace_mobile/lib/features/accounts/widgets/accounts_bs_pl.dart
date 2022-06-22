import 'package:flutter/cupertino.dart';
import 'package:flutter/material.dart';
import 'package:trace_mobile/common/widgets/bu_code_branch_header.dart';

class AccountsBsPl extends StatelessWidget {
  const AccountsBsPl({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    final bsplType = ModalRoute.of(context)!.settings.arguments;
    final title = bsplType == 'bs' ? 'Balance sheet' : 'Profit & loss';
    return Scaffold(
      appBar: AppBar(
        automaticallyImplyLeading: false,
        title: SingleChildScrollView(
            scrollDirection: Axis.horizontal,
            child: Row(
              children: [
                InkWell(
                  child: Row(
                    children: [
                      const Icon(
                        Icons.chevron_left,
                        size: 30,
                        color: Colors.indigo,
                      ),
                      Text(
                        'Balance sheet',
                        style: Theme.of(context).textTheme.headline6,
                      ),
                    ],
                  ),
                  onTap: () {
                    Navigator.pop(context);
                  },
                ),
                const SizedBox(width: 5),
                const BuCodeBranchCodeHeader()
              ],
            )),
      ),
      body: Column(children: const []),
    );
  }
}

class BsPlHeader extends StatelessWidget {
  const BsPlHeader({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return Container(
      width: double.maxFinite,
      color: Colors.grey.shade300,
      padding: const EdgeInsets.only(left: 35, top: 5, bottom: 5, right: 15),
      child: Row(
          mainAxisAlignment: MainAxisAlignment.spaceBetween,
          children: const [
            Text('Opening'),
            Text('Debits'),
            Text('Credits'),
            Text('Closing')
          ]),
    );
  }
}
