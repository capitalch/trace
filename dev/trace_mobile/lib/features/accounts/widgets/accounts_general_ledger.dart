import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:trace_mobile/common/classes/global_settings.dart';
import 'package:trace_mobile/common/classes/graphql_queries.dart';
import 'package:trace_mobile/common/widgets/bu_code_branch_header.dart';
import 'package:trace_mobile/features/accounts/classes/accounts_general_ledger_data_model.dart';

class AccountsGeneralLedger extends StatelessWidget {
  const AccountsGeneralLedger({Key? key}) : super(key: key);
  // final int accId;
  // final String accName;
  @override
  Widget build(BuildContext context) {
    dynamic args = ModalRoute.of(context)!.settings.arguments;

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
                        'General ledger',
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
        children: [
          GeneralLedgerHeader(accName: (args!['accName'])),
          Expanded(
            child: GeneralLedgerBody(accId: args['accId']),
          ),
          // TrialBalanceFooter()
        ],
      ),
    );
  }
}

class GeneralLedgerHeader extends StatelessWidget {
  const GeneralLedgerHeader({Key? key, required this.accName})
      : super(key: key);
  final String accName;
  @override
  Widget build(BuildContext context) {
    var theme = Theme.of(context).textTheme;
    return Container(
      padding: const EdgeInsets.only(left: 15),
      alignment: Alignment.centerLeft,
      child: Text(
        accName,
        style: theme.subtitle2,
      ),
    );
  }
}

class GeneralLedgerBody extends StatelessWidget {
  const GeneralLedgerBody({Key? key, required this.accId}) : super(key: key);
  final int accId;
  @override
  Widget build(BuildContext context) {
    var globalSettings = context.read<GlobalSettings>();
    var generalLedgerFuture = GraphQLQueries.genericView(
        globalSettings: globalSettings,
        sqlKey: 'get_accountsLedger',
        args: {'id': accId},
        entityName: 'accounts',
        isMultipleRows: false);
    return FutureBuilder(
      future: generalLedgerFuture,
      builder: (context, snapshot) {
        var messageTheme = Theme.of(context).textTheme.headline6;
        dynamic widget = const Text('');
        if (snapshot.connectionState == ConnectionState.waiting) {
          widget = Text('Loading...', style: messageTheme);
        } else if (snapshot.hasData) {
          dynamic jsonResult = snapshot.data?.data?['accounts']?['genericView']
                  ?['jsonResult'] ??
              [];
          if (jsonResult == null) {
            widget = Text('No data', style: messageTheme);
          } else {
            widget = const Text('Has data');
            GeneralLedgerModel generalLedger = GeneralLedgerModel.fromJson(j: jsonResult);
            print(generalLedger);
            // widget = ListView(
            //   children: getChildListOfWidgets(context, dataList),
            // );

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
            // var trialBalanceState = context.read<AccountsTrialBalanceState>();
            // trialBalanceState.summary = Summary(
            //     opening: opening,
            //     closing: closing,
            //     debits: debits,
            //     credits: credits,
            //     openingDC: openingDC,
            //     closingDC: closingDC);

            // Future.delayed(Duration.zero, () {
            //   trialBalanceState.notify();
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
}
