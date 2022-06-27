import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:trace_mobile/common/classes/global_settings.dart';
import 'package:trace_mobile/common/classes/graphql_queries.dart';
import 'package:trace_mobile/common/classes/utils.dart';
import 'package:trace_mobile/common/widgets/bu_code_branch_header.dart';
import 'package:trace_mobile/features/accounts/classes/accounts_general_ledger_data_model.dart';

class AccountsGeneralLedger extends StatelessWidget {
  const AccountsGeneralLedger({Key? key}) : super(key: key);

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
            GeneralLedgerModel generalLedger =
                GeneralLedgerModel.fromJson(j: jsonResult);
            widget = GeneralLedgerBodyItems(generalLedger: generalLedger);
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

class GeneralLedgerBodyItems extends StatelessWidget {
  const GeneralLedgerBodyItems({Key? key, required this.generalLedger})
      : super(key: key);
  final GeneralLedgerModel generalLedger;
  @override
  Widget build(BuildContext context) {
    double opBalance = generalLedger.opBalance;
    double debits = generalLedger.sum.debits;
    double credits = generalLedger.sum.credits;
    double closBalance = opBalance + debits - credits;
    int index = 0;
    List<TransactionModel> transactions = generalLedger.transactions;
    return ListView(
      children: [
        ListTile(
          title: const Text('Opening balance'),
          trailing: Text(opBalance.toString()),
        ),
        ...transactions.map((
          e,
        ) =>
            GeneralLedgerBodyItem(transaction: e, index: ++index)),
      ],
    );
  }
}

class GeneralLedgerBodyItem extends StatelessWidget {
  const GeneralLedgerBodyItem(
      {Key? key, required this.transaction, required this.index})
      : super(key: key);
  final TransactionModel transaction;
  final int index;
  @override
  Widget build(BuildContext context) {
    var tranDate =
        Utils.toLocalDateString(DateTime.parse(transaction.tranDate));
    return Center(
      child:
          // Padding(
          //   padding: const EdgeInsets.symmetric(horizontal: 15, vertical: 0),
          //   child:
          Card(
              color: Colors.grey.shade100,
              elevation: 1,
              child: Padding(
                padding: const EdgeInsets.symmetric(horizontal: 15, vertical: 10),
                child: Column(children: [
                  Row(
                    children: [
                      Text(tranDate),
                      const SizedBox(
                        width: 10,
                      ),
                      Text(transaction.autoRefNo),
                      const Spacer(),
                      Text((transaction.debit == 0
                              ? transaction.credit
                              : transaction.debit)
                          .toString())
                    ],
                  ),
                  const SizedBox(height: 5,),
                  ListTile(leading: Text(index.toString()),dense: true,
                  title: Text(transaction.otherAccounts),
                  ),
                  // Text(index.toString())
                ]),
              )),
      // ),
    );
  }
}
