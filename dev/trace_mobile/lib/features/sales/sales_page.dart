import 'package:flutter/material.dart';
import 'package:graphql_flutter/graphql_flutter.dart';
import 'package:intl/intl.dart';
import 'package:provider/provider.dart';
import 'package:trace_mobile/common/classes/global_settings.dart';
import 'package:trace_mobile/common/classes/graphql_queries.dart';
import 'package:trace_mobile/common/classes/utils.dart';
import 'package:trace_mobile/features/sales/classes/sales_item_model.dart';
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
              style: Theme.of(context).textTheme.subtitle2?.copyWith(fontWeight: FontWeight.bold),
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
                  widget = ListViewSalesData(
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
      },
    );
  }
}

class ListViewSalesData extends StatelessWidget {
  const ListViewSalesData({Key? key, required this.dataList}) : super(key: key);

  final List<dynamic> dataList;
  @override
  Widget build(BuildContext context) {
    return ListView.builder(
      itemCount: dataList.length,
      itemBuilder: (context, index) {
        return SalesCardItem(
            index: index + 1,
            indexedItem: SalesItemModel.fromJson(j: dataList[index]));
      },
    );
  }
}

class SalesCardItem extends StatelessWidget {
  const SalesCardItem(
      {Key? key, required this.index, required this.indexedItem})
      : super(key: key);

  final int index;
  final SalesItemModel indexedItem;

  @override
  Widget build(BuildContext context) {
    var theme = Theme.of(context);
    double stock = indexedItem.stock;
    var title = [
      indexedItem.brandName,
      ' ',
      indexedItem.catName,
      ' ',
      indexedItem.label
    ].join();
    // var subTitle1 = indexedItem.info;
    var subTitle = [
      indexedItem.info,
      ' ',
      'Sale type: ',
      indexedItem.saleType,
      ' Accounts: ', indexedItem.accounts
    ].join();
    var formatter = NumberFormat('#,##,000');
    return Center(
        child: Card(
            elevation: 1,
            color: ((indexedItem.age) >= 360)
                ? Colors.pink.shade100
                : Colors.grey.shade100,
            child: Column(children: [
              Container(
                padding: const EdgeInsets.only(top: 15),
                child: Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    crossAxisAlignment: CrossAxisAlignment.center,
                    children: [
                      Container(
                        padding: const EdgeInsets.only(left: 70),
                        child: Text(
                          'AGE: ${indexedItem.age.toStringAsFixed(0)}',
                          style: const TextStyle(fontWeight: FontWeight.w900),
                        ),
                      ),
                      Text(indexedItem.autoRefNo),
                      Container(
                        padding: const EdgeInsets.only(right: 15),
                        child: Text(
                            'GP: ${indexedItem.grossProfit.toStringAsFixed(0)}',
                            style:
                                const TextStyle(fontWeight: FontWeight.w900)),
                      )
                    ]),
              ),
              ListTile(
                  leading: Text(
                    index.toString(),
                    style: theme.textTheme.subtitle1
                        ?.copyWith(color: Colors.brown),
                  ),
                  title: Text(
                    title,
                    style: theme.textTheme.bodyLarge?.copyWith(
                      color: Colors.blue.shade700,
                      fontWeight: FontWeight.w900,
                    ),
                  ),
                  subtitle: Text(
                    subTitle,
                    style: theme.textTheme.bodyText1,
                  ),
                  dense: true,
                  trailing: CircleAvatar(
                      radius: 20,
                      backgroundColor: (indexedItem.stock == 0)
                          ? Colors.white
                          : Colors.grey.shade800,
                      child: Text(
                        stock.toStringAsFixed(0),
                        style: theme.textTheme.subtitle2?.copyWith(
                            color: (indexedItem.stock == 0)
                                ? Colors.black
                                : Colors.white),
                      ))),
              const SizedBox(
                height: 5,
              ),
              Container(
                padding: const EdgeInsets.only(bottom: 15),
                child: Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  crossAxisAlignment: CrossAxisAlignment.center,
                  children: [
                    Container(
                      padding: const EdgeInsets.only(left: 70),
                      child: Text(
                        'Price: ${formatter.format(indexedItem.price * (1 + indexedItem.gstRate/100))}',
                        style: const TextStyle(fontWeight: FontWeight.w900),
                      ),
                    ),
                    Text(
                      'Qty: ${formatter.format(indexedItem.qty)}',
                      // style: const TextStyle(fontWeight: FontWeight.w900),
                    ),
                    Container(
                      padding: const EdgeInsets.only(right: 15),
                      child: Text(
                        'Amount: ${formatter.format(indexedItem.amount)}',
                        style: const TextStyle(fontWeight: FontWeight.w900),
                      ),
                    )
                  ],
                ),
              )

              // Container(
              //   padding: const EdgeInsets.only(bottom: 15),
              //   child: Row(
              //       mainAxisAlignment: MainAxisAlignment.spaceBetween,
              //       crossAxisAlignment: CrossAxisAlignment.center,
              //       children: [
              //         Container(
              //           padding: const EdgeInsets.only(left: 70),
              //           child: Text(
              //             'PUR(GST): ${formatter.format(indexedItem.purGst)}',
              //             style: const TextStyle(fontWeight: FontWeight.w900),
              //           ),
              //         ),
              //         Container(
              //           padding: const EdgeInsets.only(right: 15),
              //           child: Text(
              //             'SAL(GST): ${formatter.format(indexedItem.salGst)}',
              //             style: const TextStyle(fontWeight: FontWeight.w900),
              //           ),
              //         )
              //       ]),
              // ),
            ])));
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
