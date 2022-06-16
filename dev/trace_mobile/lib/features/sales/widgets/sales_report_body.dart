import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:trace_mobile/common/classes/global_settings.dart';
import 'package:trace_mobile/common/classes/graphql_queries.dart';
import 'package:trace_mobile/common/classes/utils.dart';
import 'package:trace_mobile/features/sales/classes/sales_query_props.dart';
import 'package:trace_mobile/features/sales/classes/sales_state.dart';
import 'package:trace_mobile/features/sales/widgets/sales_list_view_data.dart';

class SalesReportBody extends StatelessWidget {
  const SalesReportBody({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    GlobalSettings globalSettings =
        Provider.of<GlobalSettings>(context, listen: false);
    return Selector<SalesState, String>(
        selector: (p0, p1) => p1.salesQueryKey,
        builder: (context, value, child) {
          String queryKey = value == '' ? 'today' : value;
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
                'tagId': '0'
              });
          return FutureBuilder(
            future: salesFuture,
            builder: (context, snapshot) {
              dynamic widget = const Text('');
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
                    widget = Center(
                      child: Text(
                        'No data',
                        style: Theme.of(context).textTheme.headline6,
                      ),
                    );
                  } else {
                    widget = SalesListViewData(
                      dataList: dataList,
                    );
                  }
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
        });
  }
}