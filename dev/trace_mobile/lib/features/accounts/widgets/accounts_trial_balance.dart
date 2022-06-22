import 'package:flutter/material.dart';
import 'package:intl/intl.dart';
import 'package:provider/provider.dart';
import 'package:trace_mobile/common/classes/global_settings.dart';
import 'package:trace_mobile/common/classes/graphql_queries.dart';
import 'package:trace_mobile/common/widgets/bu_code_branch_header.dart';
import 'package:trace_mobile/features/accounts/classes/accounts_trial_balance_data_model.dart';
import 'package:trace_mobile/features/accounts/classes/accounts_trial_balance_state.dart';
import 'package:trace_mobile/features/accounts/widgets/custom_expansion_tile.dart';

class AccountsTrialBalance extends StatelessWidget {
  const AccountsTrialBalance({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
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
                          'Trial balance',
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
              ),
            )),
        body: Column(
          children: const [
            TrialBalanceHeader(),
            Expanded(
              child: TrialBalanceBody(),
            )
          ],
        ));
  }
}

class TrialBalanceHeader extends StatelessWidget {
  const TrialBalanceHeader({Key? key}) : super(key: key);

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

class TrialBalanceBody extends StatelessWidget {
  const TrialBalanceBody({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    var globalSettings = context.read<GlobalSettings>();
    var trialBalanceFuture =
        GraphQLQueries.trialBalance(globalSettings: globalSettings);
    return FutureBuilder(
      future: trialBalanceFuture,
      builder: (context, snapshot) {
        var messageTheme = Theme.of(context).textTheme.headline6;
        dynamic widget = const Text('');
        if (snapshot.connectionState == ConnectionState.waiting) {
          widget = Text('Loading...', style: messageTheme);
        } else if (snapshot.hasData) {
          widget = Text('Has data', style: messageTheme);

          List<dynamic> dataList = snapshot.data?.data?['accounts']
                  ?['trialBalance']?['trialBal'] ??
              [];
          if (dataList.isEmpty) {
            widget = Text('No data', style: messageTheme);
          } else {
            widget = ListView(
              children: getChildListOfWidgets(context, dataList),
            );

            double opening = 0, debits = 0, credits = 0, closing = 0;
            for (var item in dataList) {
              var data = item['data'];
              var openingRow = (data['opening_dc'] == 'D')
                  ? data['opening']
                  : -data['opening'];
              var closingRow = (data['closing_dc'] == 'D')
                  ? data['closing']
                  : -data['closing'];
              opening = opening + openingRow;
              closing = closing + closingRow;
              debits = debits + data['debit'];
              credits = credits + data['credit'];
            }
            String openingDC = (opening >= 0) ? 'Dr' : 'Cr';
            String closingDC = (closing >= 0) ? 'Dr' : 'Cr';
            opening = opening.abs();
            closing = closing.abs();
            var temp = context.read<AccountsTrialBalanceState>();
            temp.opening = opening;
            temp.closing = closing;
            temp.debits = debits;
            temp.credits = credits;
            temp.openingDC = openingDC;
            temp.closingDC = closingDC;
            Future.delayed(Duration.zero, () {
              temp.notify();
            });
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
        // textColor: Colors.blue.shade700,
        // collapsedTextColor: Colors.red,
        // tilePadding: const EdgeInsets.only(left: 15),
        // trailing: const Icon(Icons.ac_unit),
        // initiallyExpanded: true,
        // expandedAlignment: Alignment.centerRight,
        backgroundColor: Colors.amber.shade100,
        // collapsedBackgroundColor: Colors.grey.shade100,
        childrenPadding: const EdgeInsets.only(left: 15),
        title: Container(
          width: double.infinity,
          padding: const EdgeInsets.only(top: 10),
          // color: Colors.white70,
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
                getFormattedNumberWidget(context, data.opening, data.openingDC),
                const SizedBox(width: 5),
                getFormattedNumberWidget(context, data.debit, null),
                const SizedBox(width: 5),
                getFormattedNumberWidget(context, data.credit, null),
                const SizedBox(width: 5),
                getFormattedNumberWidget(context, data.closing, data.closingDC),
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

  getFormattedNumberWidget(BuildContext context, double amount, String? drcr) {
    NumberFormat formatter = NumberFormat('###,###.00');
    var theme = Theme.of(context).textTheme;
    var formattedAmountWidget = Text(formatter.format(amount),
        style: theme.bodyText1?.copyWith(fontWeight: FontWeight.bold));
    var drcrWidget = const Text('');
    if (drcr != null) {
      drcrWidget = (drcr == 'D')
          ? Text(
              'Dr',
              style: theme.labelMedium?.copyWith(color: Colors.blue),
            )
          : Text(
              'Cr',
              style: theme.labelMedium?.copyWith(color: Colors.red),
            );
    }
    return Container(
        padding: const EdgeInsets.only(top: 5),
        width: 120,
        child: Row(
          mainAxisAlignment: MainAxisAlignment.end,
          children: [
            formattedAmountWidget,
            const SizedBox(width: 2),
            drcrWidget
          ],
        ));
  }
}

class TrialBalanceFooter extends StatelessWidget {
  const TrialBalanceFooter({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return Container();
  }
}
