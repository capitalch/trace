import 'package:flutter/material.dart';
import 'package:intl/intl.dart';
import 'package:provider/provider.dart';
import 'package:trace_mobile/common/classes/global_settings.dart';
import 'package:trace_mobile/common/classes/graphql_queries.dart';
import 'package:trace_mobile/common/classes/utils.dart';
import 'package:trace_mobile/features/sales/classes/sales_item_model.dart';
import 'package:trace_mobile/features/sales/classes/sales_query_props.dart';
import 'package:trace_mobile/features/sales/classes/sales_state.dart';

/*
Initiallly I started with Consumer widget. Since there are two states in SalesState class which can change I shifted to Selector widget
for performance optimization. Selector widget can select to rebuild when a particular value changes
*/
class SalesPage extends StatelessWidget {
  const SalesPage({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return Scaffold(
        appBar: AppBar(
          automaticallyImplyLeading: false,
          title: const SalesAppBarTitle(),
        ),
        body: Column(
          children: const [
            SalesReportHeader(),
            SizedBox(
              height: 5,
            ),
            SalesReportBody(),
            SizedBox(
              height: 5,
            ),
            SalesReportSummary()
          ],
        ));
  }
}

class SalesReportHeader extends StatelessWidget {
  const SalesReportHeader({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    var selector = Selector<SalesState, String>(
        selector: (p0, p1) => p1.salesQueryKey,
        builder: (context, value, child) {
          String queryKey = value == '' ? 'today' : value;
          var props = QueryProps()
              .getSalesQueryPropsList()
              .firstWhere((element) => element.salesQueryKey == queryKey);
          return (Container(
              padding: const EdgeInsets.only(
                left: 15,
              ),
              alignment: Alignment.center,
              color: Colors.grey.shade200,
              height: 25,
              child: Text(
                'Sale ${props.labelName} (${Utils.toLocalDateString(props.startDate)} to ${Utils.toLocalDateString(props.endDate)})',
                style: Theme.of(context)
                    .textTheme
                    .subtitle2
                    ?.copyWith(fontWeight: FontWeight.bold),
              )));
        });
    return selector;
    // return Consumer<SalesState>(
    //   builder: (context, value, child) {
    //     String queryKey =
    //         value.salesQueryKey == '' ? 'today' : value.salesQueryKey;

    //     var props = QueryProps()
    //         .getSalesQueryPropsList()
    //         .firstWhere((element) => element.salesQueryKey == queryKey);
    //     return (Container(
    //         padding: const EdgeInsets.only(
    //           left: 15,
    //         ),
    //         alignment: Alignment.center,
    //         color: Colors.grey.shade200,
    //         child: Text(
    //           'Sale ${props.labelName} (${Utils.toLocalDateString(props.startDate)} to ${Utils.toLocalDateString(props.endDate)})',
    //           style: Theme.of(context)
    //               .textTheme
    //               .subtitle2
    //               ?.copyWith(fontWeight: FontWeight.bold),
    //         )));
    //   },
    // );
  }
}

class SalesReportBody extends StatelessWidget {
  const SalesReportBody({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    GlobalSettings globalSettings =
        Provider.of<GlobalSettings>(context, listen: false);
    // context.read<SalesState>().salesQueryKey = '';
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
                    // resolveSummary(context, dataList);
                    widget = ListViewSalesData(
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

class ListViewSalesData extends StatelessWidget {
  const ListViewSalesData({Key? key, required this.dataList}) : super(key: key);

  final List<dynamic> dataList;
  @override
  Widget build(BuildContext context) {
    resolveSalesSummary(context, dataList);
    return ListView.builder(
      itemCount: dataList.length,
      itemBuilder: (context, index) {
        return SalesCardItem(
            index: index + 1,
            indexedItem: SalesItemModel.fromJson(j: dataList[index]));
      },
    );
  }

  resolveSalesSummary(BuildContext context, List<dynamic> dataList) {
    double rows = dataList.length.toDouble(),
        qty = 0,
        sale = 0,
        aggr = 0,
        jakarQty = 0,
        jakarSale = 0,
        grossProfit = 0;

    for (var item in dataList) {
      var indexedItem = SalesItemModel.fromJson(j: item);
      qty = qty + indexedItem.qty;
      sale = sale + indexedItem.amount;
      aggr = aggr + indexedItem.aggrSale;
      jakarQty = jakarQty + ((indexedItem.age >= 360) ? indexedItem.qty : 0);
      jakarSale =
          jakarSale + ((indexedItem.age >= 360) ? indexedItem.amount : 0);
      grossProfit = grossProfit + indexedItem.grossProfit;
    }

    // Future.delayed is used to run the code as Future.
    // Since the parent widget is in building mode, if I don't do this it throws error. It's just like mimicking a code to be run as future.
    Future.delayed(Duration.zero, () {
      context.read<SalesState>().summaryMap = {
        'rows': rows,
        'qty': qty,
        'sale': sale,
        'aggr': aggr,
        'jakarQty': jakarQty,
        'jakarSale': jakarSale,
        'grossProfit': grossProfit,
      };
    });
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
      ' Accounts: ',
      indexedItem.accounts
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
                        'Price: ${formatter.format(indexedItem.price * (1 + indexedItem.gstRate / 100))}',
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
    // SalesState salesState = Provider.of<SalesState>(context, listen: false);
    List<SalesQueryProps> queryPropsList =
        QueryProps().getSalesQueryPropsList();
    var labelsLayout = queryPropsList.map(
      (props) => Container(
          padding: const EdgeInsets.symmetric(horizontal: 5),
          child: InkWell(
            splashColor: Theme.of(context).primaryColorLight,
            onTap: () {
              // salesState.salesQueryKey = props.salesQueryKey;
              context.read<SalesState>().salesQueryKey = props.salesQueryKey;
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

class SalesReportSummary extends StatelessWidget {
  const SalesReportSummary({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    var formatter = NumberFormat('#,##,000');
    var theme = Theme.of(context)
        .textTheme
        .subtitle2
        ?.copyWith(fontWeight: FontWeight.bold);
    return Selector<SalesState, Map<String, double>>(
      selector: (p0, p1) => p1.summaryMap,
      builder: (context, value, child) {
        return Container(
            width: double.infinity,
            height: 25,
            color: Colors.grey.shade300,
            padding: const EdgeInsets.only(left: 15, top: 2, bottom: 5),
            child: SingleChildScrollView(
              scrollDirection: Axis.horizontal,
              child: Row(children: [
                Text(
                  'Rows: ${formatter.format(value['rows'] ?? 0)}',
                  style: theme,
                ),
                const SizedBox(width: 15),
                Text('Qty: ${formatter.format(value['qty'] ?? 0)}',
                    style: theme),
                const SizedBox(width: 15),
                Text('GP: ${formatter.format(value['grossProfit'] ?? 0)}',
                    style: theme),
                const SizedBox(width: 15),
                Text('Sale: ${formatter.format(value['sale'] ?? 0)}',
                    style: theme),
                const SizedBox(width: 15),
                Text('Aggr: ${formatter.format(value['aggr'] ?? 0)}',
                    style: theme),
                const SizedBox(width: 15),
                Text('Jakar sale: ${formatter.format(value['jakarSale'] ?? 0)}',
                    style: theme),
                const SizedBox(width: 15),
                Text('Jakar qty: ${formatter.format(value['jakarQty'] ?? 0)}',
                    style: theme),
              ]),
            ));
      },
    );
  }
}
