import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:trace_mobile/common/classes/global_settings.dart';
import 'package:trace_mobile/common/classes/graphql_queries.dart';

class TrialBalance extends StatelessWidget {
  const TrialBalance({Key? key}) : super(key: key);

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
        body: TrialBalanceBody());
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

          List<dynamic> dataList =
              snapshot.data?.data?['accounts']?['trialBalance']?['trialBal'] ?? [];
          if (dataList.isEmpty) {
            widget = Text('No data', style: messageTheme);
          } else {
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
