import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
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
          children: const [SalesReportHeader()],
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
        String queryKey = value.salesQueryKey;
        if (queryKey == '') {
          return Text('');
        }
        var props = PropsList()
            .getSalesQueryPropsList()
            .firstWhere((element) => element.salesQueryKey == queryKey);
        return (Text('Sale ${props.labelName} (from ${props.startDate} to ${props.endDate})'));
      },
    );
  }
}

class SalesAppBarTitle extends StatelessWidget {
  const SalesAppBarTitle({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return SizedBox(
        width: double.maxFinite,
        height: 40,
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
    List<SalesQueryProps> queryPropsList = PropsList().getSalesQueryPropsList();
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
