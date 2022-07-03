import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:trace_mobile/common/classes/global_settings.dart';
import 'package:trace_mobile/common/classes/graphql_queries.dart';
import 'package:trace_mobile/common/classes/utils.dart';
import 'package:trace_mobile/features/health/business_health_model.dart';

class BusinessHealth extends StatelessWidget {
  const BusinessHealth({Key? key}) : super(key: key);

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
                      'Business health',
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
      body: const BusinessHealthBody(),
    );
  }
}

class BusinessHealthBody extends StatelessWidget {
  const BusinessHealthBody({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    var globalSettings = context.read<GlobalSettings>();
    var businessHealthFuture = GraphQLQueries.genericView(
        globalSettings: globalSettings,
        sqlKey: 'get_business_health',
        entityName: 'accounts',
        isMultipleRows: false);
    return FutureBuilder(
      future: businessHealthFuture,
      builder: (context, snapshot) {
        var messageTheme = Theme.of(context).textTheme.headline6;
        dynamic widget = const Text('');
        if (snapshot.connectionState == ConnectionState.waiting) {
          widget = Text('Loading...', style: messageTheme);
        } else if (snapshot.hasData) {
          Map<String, dynamic>? jsonResult =
              snapshot.data?.data?['accounts']?['genericView']?['jsonResult'];
          if (jsonResult == null) {
            widget = Text('No data', style: messageTheme);
          } else {
            BusinessHealthModel businessHealth =
                BusinessHealthModel.fromJson(j: jsonResult);
            widget = BusinessHealthBodyContent(
              businessHealth: businessHealth,
            );
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

class BusinessHealthBodyContent extends StatelessWidget {
  const BusinessHealthBodyContent({Key? key, required this.businessHealth})
      : super(key: key);
  final BusinessHealthModel businessHealth;
  @override
  Widget build(BuildContext context) {
    var theme = Theme.of(context).textTheme;
    Map<int, dynamic>? trialBalanceMap =
        getTrialBalanceMap(businessHealth.trialBalance);
    return Container(
      // height: 300,
      padding: const EdgeInsets.symmetric(horizontal: 15),
      child: Column(children: [
        //Sundry creditors,id: 9
        Row(
          mainAxisAlignment: MainAxisAlignment.spaceBetween,
          children: [
            Text(
              trialBalanceMap![9]['accName'],
              style: theme.bodyText1,
            ),
            Text(Utils.toFormattedNumberInLaks(
                -double.parse(trialBalanceMap[9]['closing'].toString())))
          ],
        ),

        // Sundry debtors id: 22
        const SizedBox(
          height: 15,
        ),
        Row(
          mainAxisAlignment: MainAxisAlignment.spaceBetween,
          children: [
            Text(
              trialBalanceMap[22]['accName'],
              style: theme.bodyText1,
            ),
            Text(Utils.toFormattedNumberInLaks(
                double.parse(trialBalanceMap[22]['closing'].toString())))
          ],
        ),

        // Bank accounts id: 16
        const SizedBox(
          height: 15,
        ),
        Row(
          mainAxisAlignment: MainAxisAlignment.spaceBetween,
          children: [
            Text(
              trialBalanceMap[16]['accName'],
              style: theme.bodyText1,
            ),
            Text(Utils.toFormattedNumberInLaks(
                double.parse(trialBalanceMap[16]['closing'].toString())))
          ],
        ),

        // cash in hand id: 17
        const SizedBox(
          height: 15,
        ),
        Row(
          mainAxisAlignment: MainAxisAlignment.spaceBetween,
          children: [
            Text(
              trialBalanceMap[17]['accName'],
              style: theme.bodyText1,
            ),
            Text(Utils.toFormattedNumberInLaks(
                double.parse(trialBalanceMap[17]['closing'].toString())))
          ],
        ),

        // Purchases id: 26
        const SizedBox(
          height: 15,
        ),
        Row(
          mainAxisAlignment: MainAxisAlignment.spaceBetween,
          children: [
            Text(
              trialBalanceMap[26]['accName'],
              style: theme.bodyText1,
            ),
            Text(Utils.toFormattedNumberInLaks(
                double.parse(trialBalanceMap[26]['closing'].toString())))
          ],
        ),

        // Sales id: 30
        const SizedBox(
          height: 15,
        ),
        Row(
          mainAxisAlignment: MainAxisAlignment.spaceBetween,
          children: [
            Text(
              trialBalanceMap[30]['accName'],
              style: theme.bodyText1,
            ),
            Text(Utils.toFormattedNumberInLaks(
                -double.parse(trialBalanceMap[30]['closing'].toString())))
          ],
        ),

        //opening stock
        const SizedBox(
          height: 30,
        ),
        Row(
          mainAxisAlignment: MainAxisAlignment.spaceBetween,
          children: [
            Text(
              'Opening stock:',
              style: theme.bodyText1,
            ),
            Text(Utils.toFormattedNumberInLaks(
                businessHealth.openingClosingStock.openingValue.toDouble()))
          ],
        ),
        // Opening stock gst
        const SizedBox(
          height: 15,
        ),
        Row(
          mainAxisAlignment: MainAxisAlignment.spaceBetween,
          children: [
            Text(
              'Opening stock(Gst):',
              style: theme.bodyText1,
            ),
            Text(Utils.toFormattedNumberInLaks(businessHealth
                .openingClosingStock.openingValueWithGst
                .toDouble()))
          ],
        ),
        // Closing stock
        const SizedBox(
          height: 15,
        ),
        Row(
          mainAxisAlignment: MainAxisAlignment.spaceBetween,
          children: [
            Text(
              'Closing stock:',
              style: theme.bodyText1,
            ),
            Text(Utils.toFormattedNumberInLaks(
                businessHealth.openingClosingStock.closingValue.toDouble()))
          ],
        ),
        // Closing stock gst
        const SizedBox(
          height: 15,
        ),
        Row(
          mainAxisAlignment: MainAxisAlignment.spaceBetween,
          children: [
            Text(
              'Closing stock(Gst):',
              style: theme.bodyText1,
            ),
            Text(Utils.toFormattedNumberInLaks(businessHealth
                .openingClosingStock.closingValueWithGst
                .toDouble()))
          ],
        ),
        // Profit or loss
        const SizedBox(
          height: 45,
        ),
        Row(
          mainAxisAlignment: MainAxisAlignment.spaceBetween,
          children: [
            Text(
              '(a) Profit or loss as per balance sheet:',
              style: theme.bodyText1,
            ),
            Text(Utils.toFormattedNumberInLaks(
                businessHealth.profitLoss.toDouble()))
          ],
        ),
        //diff stock
        const SizedBox(
          height: 15,
        ),
        Row(
          mainAxisAlignment: MainAxisAlignment.spaceBetween,
          children: [
            const Text('Difference in stock:'),
            Text(Utils.toFormattedNumberInLaks(
                businessHealth.stockDiff.diff.toDouble()))
          ],
        ),
        //diff stock gst
        const SizedBox(
          height: 15,
        ),
        Row(
          mainAxisAlignment: MainAxisAlignment.spaceBetween,
          children: [
            const Text('(b) Difference in stock(Gst):'),
            Text(Utils.toFormattedNumberInLaks(
                businessHealth.stockDiff.diffGst.toDouble()))
          ],
        ),
        //Final
        const SizedBox(
          height: 45,
        ),
        Row(
          mainAxisAlignment: MainAxisAlignment.spaceBetween,
          children: [
            Text(
              'Net amount (a + b):',
              style: theme.headline6,
            ),
            Text(
              Utils.toFormattedNumberInLaks(
                  businessHealth.profitLoss.toDouble() +
                      businessHealth.stockDiff.diffGst.toDouble()),
              style: theme.headline6,
            )
          ],
        )
      ]),
    );
  }

  getTrialBalanceMap(List<dynamic> trialBalanceList) {
    Map<int, dynamic> map = {};
    for (var item in trialBalanceList) {
      map[item['id']] = {
        'accName': item['accName'],
        'closing': item['closing']
      };
    }
    return map;
  }
}
