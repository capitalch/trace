import 'package:flutter/material.dart';
import 'package:intl/intl.dart';
import 'package:provider/provider.dart';
import 'package:trace_mobile/common/classes/global_settings.dart';
import 'package:trace_mobile/common/classes/graphql_queries.dart';
import 'package:trace_mobile/features/accounts/classes/accounts_trial_balance_data_model.dart';

class AccountsTrialBalance extends StatelessWidget {
  const AccountsTrialBalance({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return Scaffold(
        appBar: AppBar(
            automaticallyImplyLeading: false,
            title: Row(
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
              ],
            )),
        body: const TrialBalanceBody());
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
        // return Text('xxx');
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
            List<TrialBalanceNode> trialBalanceNodeList = dataList.map((item) {
              var trialBalanceData = TrialBalanceData.fromJson(j: item['data']);
              return TrialBalanceNode(data: trialBalanceData, children: null);
            }).toList();
            widget = TrialBalanceBodyLayout(
                trialBalanceNodeList: trialBalanceNodeList);
            //   List<VouchersDataModel> dataListModel = dataList.map(((e) {
            //     e['tranType'] = vouchersTranTypesMap[e['tranTypeId']];
            //     return VouchersDataModel.fromJson(j: e);
            //   })).toList();
            //   vouchersState.initSummary();
            //   for (var element in dataListModel) {
            //     vouchersState.debits =
            //         vouchersState.debits + element.debit.toInt();
            //     vouchersState.credits =
            //         vouchersState.credits + element.credit.toInt();
          }
          //   Future.delayed(Duration.zero, (() {
          //     vouchersState.setRowCount(dataList.length);
          //   }));

          //   widget =
          //       VouchersListViewData(vouchersDataListModel: dataListModel);
          // }
        } else {
          widget = Text('No data', style: messageTheme);
        }
        return Center(
          child: widget,
        );

        // return Expanded(
        //     child: Center(
        //   child: widget,
        // ));
      },
    );
  }
}

class TrialBalanceBodyLayout extends StatelessWidget {
  const TrialBalanceBodyLayout({Key? key, required this.trialBalanceNodeList})
      : super(key: key);

  final List<TrialBalanceNode> trialBalanceNodeList;
  @override
  Widget build(BuildContext context) {
    return Column(
        children: getNodeLayoutWidgets(context, trialBalanceNodeList));
  }

  getNodeLayoutWidgets(
      BuildContext context, List<TrialBalanceNode> trialBalanceNodeList) {
    NumberFormat formatter = NumberFormat('###,###.00');
    return trialBalanceNodeList.map((node) {
      var opening =
          '${formatter.format(node.data.opening)} ${node.data.openingDC == 'D' ? 'Dr' : 'Cr'}';
      var closing =
          '${formatter.format(node.data.closing)} ${node.data.closingDC}';
      var debit = formatter.format(node.data.debit);
      var credit = formatter.format(node.data.credit);
      return ExpansionTile(
        title: Text(node.data.accName),
        subtitle: SingleChildScrollView(
            scrollDirection: Axis.horizontal,
            child: Row(
              children: [
                getFormattedNumberWidget(
                    context, node.data.opening, node.data.openingDC),
                // Container(
                //   width: 120,
                //   child: Text(opening),
                //   color: Colors.amber.shade100,
                //   alignment: Alignment.centerRight,
                // ),
                const SizedBox(width: 10),
                getFormattedNumberWidget(context, node.data.debit, null),
                const SizedBox(width: 10),
                getFormattedNumberWidget(context, node.data.credit, null),
                const SizedBox(width: 10),
                getFormattedNumberWidget(
                    context, node.data.closing, node.data.closingDC),
              ],
            )),
      );
    }).toList();
  }

  getFormattedNumberWidget(BuildContext context, double amount, String? drcr) {
    NumberFormat formatter = NumberFormat('###,###.00');
    var theme = Theme.of(context).textTheme;
    var formattedAmountWidget = Text(formatter.format(amount),
        style: theme.labelMedium?.copyWith(fontWeight: FontWeight.bold));
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
        width: 130,
        color: Colors.grey.shade200,
        alignment: Alignment.centerRight,
        child: Row(
          children: [
            formattedAmountWidget,
            const SizedBox(width: 2),
            drcrWidget
          ],
        ));
  }
}
