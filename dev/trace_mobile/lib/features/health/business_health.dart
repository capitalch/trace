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
          Map<String, dynamic> jsonResult =
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
    return Container(
      height: 300,
      padding: const EdgeInsets.symmetric(horizontal: 15),
      child: Column(children: [
        Row(
          mainAxisAlignment: MainAxisAlignment.spaceBetween,
          children: [
            Text(
              'Profit or loss as per balance sheet:',
              style: theme.bodyText1,
            ),
            Text(Utils.toFormattedNumber(businessHealth.profitLoss.toDouble()))
          ],
        ),
        const SizedBox(
          height: 15,
        ),
        Row(
          mainAxisAlignment: MainAxisAlignment.spaceBetween,
          children: [
            const Text('Difference in stock with Gst:'),
            Text(Utils.toFormattedNumber(
                businessHealth.stockDiff.diffGst.toDouble()))
          ],
        ),
        const SizedBox(
          height: 20,
        ),
        Row(
          mainAxisAlignment: MainAxisAlignment.spaceBetween,
          children: [
            Text(
              'Net amount:',
              style: theme.headline6,
            ),
            Text(Utils.toFormattedNumber(businessHealth.profitLoss.toDouble() +
                businessHealth.stockDiff.diffGst.toDouble()), style: theme.headline6,)
          ],
        )
      ]),
    );
  }
}
