import 'package:flutter/material.dart';
import 'package:graphql_flutter/graphql_flutter.dart';
import 'package:provider/provider.dart';
import 'package:trace_mobile/common/classes/global_settings.dart';
import 'package:trace_mobile/common/classes/graphql_queries.dart';
import 'package:trace_mobile/common/classes/utils.dart';
import 'package:trace_mobile/features/sales/classes/sales_query_props.dart';
import 'package:trace_mobile/features/sales/classes/sales_state.dart';

class SalesPage extends StatelessWidget {
  const SalesPage({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    // SalesState salesState = Provider.of<SalesState>(context, listen: true);
    // get future
    // create body as future builder
    return Scaffold(
        appBar: AppBar(
          automaticallyImplyLeading: false,
          title: const SalesAppBarTitle(),
        ),
        body: Column(
          children: const [SalesReportHeader(), SalesReportBody()],
        ));
  }
}

// Future getFuture(String salesKey) {
//   Map<String, dynamic>? dataMap = StartDateEndDateTitle.decoder[salesKey];
//   return
// }

class SalesReportHeader extends StatelessWidget {
  const SalesReportHeader({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return Consumer<SalesState>(
      builder: (context, value, child) {
        String queryKey =
            value.salesQueryKey == '' ? 'today' : value.salesQueryKey;

        var props = QueryProps()
            .getSalesQueryPropsList()
            .firstWhere((element) => element.salesQueryKey == queryKey);
        return (Container(
            padding: const EdgeInsets.only(left: 15),
            alignment: Alignment.center,
            child: Text(
              'Sale ${props.labelName} (${Utils.toLocalDateString(props.startDate)} to ${Utils.toLocalDateString(props.endDate)})',
              style: Theme.of(context).textTheme.subtitle2,
            )));
      },
    );
  }
}

class SalesReportBody extends StatelessWidget {
  const SalesReportBody({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    GlobalSettings globalSettings =
        Provider.of<GlobalSettings>(context, listen: false);
    return Consumer<SalesState>(
      builder: (context, value, child) {
        String queryKey =
            value.salesQueryKey == '' ? 'today' : value.salesQueryKey;
        var props = QueryProps()
            .getSalesQueryPropsList()
            .firstWhere((element) => element.salesQueryKey == queryKey);

        var salesFuture = GraphQLQueries.genericView(
            globalSettings: globalSettings,
            isMultipleRows: true,
            sqlKey: 'get_sale_report',
            args: {
              'startDate': Utils.toIsoDateString(props.startDate),
              'endDate': Utils.toIsoDateString(props.endDate),
              'tagId': '1'
            });
        return FutureBuilder(
          future: salesFuture,
          builder: (context, snapshot) {
            var widget = const Text('');
            if (snapshot.connectionState == ConnectionState.waiting) {
              widget = Text('Loading...',
                  style: Theme.of(context).textTheme.headline6);
            } else {
              if (snapshot.hasError) {
                widget = const Text('Data error');
              } else if (snapshot.hasData) {
                List<dynamic> dataList =
                    snapshot.data?.data?['accounts']?['genericView'] ?? [];
                if (dataList.isEmpty) {
                  return Center(
                    child: Text(
                      'No data',
                      style: Theme.of(context).textTheme.headline6,
                    ),
                  );
                } else {
                  return ListViewSalesData(
                    dataList: dataList,
                  );
                }
                // widget = const Text('Data available');
              } else {
                widget = const Text('No data');
              }
            }
            return Expanded(
                child: Center(
              child: widget,
            ));
          },
        );

        // Expanded(
        //     child: ListView.builder(
        //   itemCount: 1,
        //   itemBuilder: (context, index) {
        //     return Text('Test');
        //   },
        // ));
      },
    );
  }
}

class ListViewSalesData extends StatelessWidget {
  ListViewSalesData({Key? key, required dataList}) : super(key: key);

  final List<dynamic> dataList = [];
  @override
  Widget build(BuildContext context) {
    return ListView.builder(
      itemCount: dataList.length,
      itemBuilder: (context, index) {},
    );
  }
}

class SalesCardItem extends StatelessWidget {
  const SalesCardItem({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    var theme = Theme.of(context);
    
    return Container();
  }
}

class SalesAppBarTitle extends StatelessWidget {
  const SalesAppBarTitle({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return SizedBox(
        width: double.maxFinite,
        // height: 25,
        child: SingleChildScrollView(
          scrollDirection: Axis.horizontal,
          child: Row(crossAxisAlignment: CrossAxisAlignment.center, children: [
            // back icon
            InkWell(
              child: Row(
                children: [
                  const Icon(
                    Icons.chevron_left,
                    size: 30,
                    color: Colors.indigo,
                  ),
                  Text(
                    'Sales',
                    style: Theme.of(context).textTheme.headline6,
                  ),
                ],
              ),
              onTap: () {
                Navigator.pop(context);
              },
            ),
            const SizedBox(
              width: 5,
            ),
            ...getLabelsLayout(context)
          ]),
        ));
  }

  getLabelsLayout(BuildContext context) {
    SalesState salesState = Provider.of<SalesState>(context, listen: false);
    List<SalesQueryProps> queryPropsList =
        QueryProps().getSalesQueryPropsList();
    var labelsLayout = queryPropsList.map(
      (props) => Container(
          padding: const EdgeInsets.symmetric(horizontal: 5),
          child: InkWell(
            splashColor: Theme.of(context).primaryColorLight,
            onTap: () {
              salesState.salesQueryKey = props.salesQueryKey;
            },
            borderRadius: BorderRadius.circular(5),
            child: Ink(
                height: 30,
                decoration: BoxDecoration(
                  borderRadius: BorderRadius.circular(5),
                  color: Colors.amber.shade200,
                ),
                padding: const EdgeInsets.only(top: 8, left: 10, right: 10),
                child: Text(
                  props.labelName,
                  style: Theme.of(context).textTheme.labelLarge,
                )
                // ),
                ),
          )),
    );

    return labelsLayout;
  }
}
