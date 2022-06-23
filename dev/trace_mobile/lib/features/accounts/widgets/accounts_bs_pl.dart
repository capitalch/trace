import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:trace_mobile/common/classes/global_settings.dart';
import 'package:trace_mobile/common/classes/graphql_queries.dart';
import 'package:trace_mobile/common/widgets/bu_code_branch_header.dart';
import 'package:trace_mobile/features/accounts/classes/accounts_bs_pl_state.dart';
import 'package:trace_mobile/features/accounts/classes/accounts_trial_balance_data_model.dart';
import 'package:trace_mobile/features/accounts/widgets/custom_expansion_tile.dart';
import 'package:trace_mobile/features/accounts/widgets/trial_balance_body.dart';

class AccountsBsPl extends StatelessWidget {
  const AccountsBsPl({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    final bsplType = ModalRoute.of(context)!.settings.arguments.toString();
    var bsplState = context.read<AccountsBsplState>();
    bsplState.bsplType = bsplType;
    bsplState.init();
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
                        title,
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
      body: Column(children: const [
        BsplHeader(),
        Expanded(
          child: BsplBody(),
        )
      ]),
    );
  }
}

class BsplHeader extends StatelessWidget {
  const BsplHeader({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    var bsplState = context.read<AccountsBsplState>();
    return Selector<AccountsBsplState, bool>(
      selector: (p0, p1) => p1.isSelectedLeftLabel,
      builder: (context, value, child) {
        return Container(
          width: double.maxFinite,
          color: Colors.grey.shade300,
          padding:
              const EdgeInsets.only(left: 35, top: 5, bottom: 5, right: 15),
          child:
              Row(mainAxisAlignment: MainAxisAlignment.spaceBetween, children: [
            Container(
              padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 5),
              decoration: BoxDecoration(
                  color: value ? Colors.yellow.shade600 : Colors.transparent,
                  border: value
                      ? Border.all(width: 2)
                      : Border.all(width: 0, color: Colors.grey.shade300)),
              child: ElevatedButton(
                  onPressed: () {
                    bsplState.isSelectedLeftLabel = true;
                  },
                  child: Text(bsplState.leftLabel)),
            ),
            Container(
              padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 5),
              decoration: BoxDecoration(
                  color: !value ? Colors.yellow.shade600 : Colors.transparent,
                  border: !value
                      ? Border.all(width: 2)
                      : Border.all(width: 0, color: Colors.grey.shade300)),
              child: ElevatedButton(
                  onPressed: () {
                    bsplState.isSelectedLeftLabel = false;
                  },
                  child: Text(bsplState.rightLabel)),
            )
          ]),
        );
      },
    );
  }
}

class BsplSubHeader extends StatelessWidget {
  const BsplSubHeader({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    var bsplState = context.read<AccountsBsplState>();
    return Container();
  }
}

class BsplBody extends StatelessWidget {
  const BsplBody({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    var globalSettings = context.read<GlobalSettings>();
    var bsplFuture =
        GraphQLQueries.balanceSheetProfitLoss(globalSettings: globalSettings);

    return FutureBuilder(
      future: bsplFuture,
      builder: (context, snapshot) {
        var messageTheme = Theme.of(context).textTheme.headline6;
        dynamic widget = const Text('');
        if (snapshot.connectionState == ConnectionState.waiting) {
          widget = Text('Loading...', style: messageTheme);
        } else if (snapshot.hasData) {
          var bsplAll =
              snapshot.data?.data?['accounts']?['balanceSheetProfitLoss'];
          List<dynamic> dataList = bsplAll?['balanceSheetProfitLoss'] ?? [];
          double profitOrLoss = bsplAll?['profitOrLoss'] ?? 0;
          List<dynamic> aggregates = bsplAll?['aggregates'] ?? [];
          if (dataList.isEmpty) {
            widget = Text('No data', style: messageTheme);
          } else {
            widget = ListView(
              children: getChildListOfWidgets(context, dataList),
            );

            // double opening = 0, debits = 0, credits = 0, closing = 0;
            // for (var item in dataList) {
            //   var data = item['data'];
            //   var openingRow = (data['opening_dc'] == 'D')
            //       ? data['opening']
            //       : -data['opening'];
            //   var closingRow = (data['closing_dc'] == 'D')
            //       ? data['closing']
            //       : -data['closing'];
            //   opening = opening + openingRow;
            //   closing = closing + closingRow;
            //   debits = debits + data['debit'];
            //   credits = credits + data['credit'];
            // }
            // String openingDC = (opening >= 0) ? 'Dr' : 'Cr';
            // String closingDC = (closing >= 0) ? 'Dr' : 'Cr';
            // opening = opening.abs();
            // closing = closing.abs();
            // var temp = context.read<AccountsTrialBalanceState>();
            // temp.summary = Summary(
            //     opening: opening,
            //     closing: closing,
            //     debits: debits,
            //     credits: credits,
            //     openingDC: openingDC,
            //     closingDC: closingDC);

            // Future.delayed(Duration.zero, () {
            //   temp.notify();
            // });
          }
        } else {
          widget = Text('No data', style: messageTheme);
        }
        return Center(
          child: widget,
        );
      },
    );
  }

  getChildListOfWidgets(BuildContext context, List<dynamic> childList) {
    List<Widget> childListOfWidgets = [];
    var theme = Theme.of(context).textTheme;
    for (dynamic child in childList) {
      TrialBalanceData data = TrialBalanceData.fromJson(j: child['data']);
      Widget childWidget = CustomExpansionTile(
        maintainState: true,
        collapsedIconColor: Colors.amber.shade700,
        backgroundColor: Colors.amber.shade100,
        childrenPadding: const EdgeInsets.only(left: 15),
        title: Container(
          width: double.infinity,
          padding: const EdgeInsets.only(top: 10),
          child: Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Text(
                data.accName,
                style: theme.subtitle1?.copyWith(
                    fontWeight: FontWeight.bold,
                    color:
                        child['children'] == null ? Colors.blue : Colors.black),
                overflow: TextOverflow.ellipsis,
              ),
              Text(
                data.accTypeMap[data.accType] ?? '',
                style: theme.bodyText1?.copyWith(color: Colors.grey.shade700),
              )
            ],
          ),
        ),
        subtitle: SingleChildScrollView(
            padding: const EdgeInsets.only(top: 10, bottom: 10),
            scrollDirection: Axis.horizontal,
            child: Row(
              children: [
                FormattedNumber(amount: data.opening, drcr: data.openingDC),
                const SizedBox(width: 5),
                FormattedNumber(amount: data.debit, drcr: null),
                const SizedBox(width: 5),
                FormattedNumber(amount: data.credit, drcr: null),
                const SizedBox(width: 5),
                FormattedNumber(amount: data.closing, drcr: data.closingDC),
              ],
            )),
        children: (child['children'] == null)
            ? [const SizedBox.shrink()]
            : getChildListOfWidgets(context, child['children']),
        hasChildren: (child['children'] == null) ? false : true,
      );
      childListOfWidgets.add(childWidget);
    }
    return childListOfWidgets;
  }
}



class BsplFooter extends StatelessWidget {
  const BsplFooter({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return Container();
  }
}
