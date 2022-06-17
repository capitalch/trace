import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:trace_mobile/common/classes/global_settings.dart';
import 'package:trace_mobile/common/classes/graphql_queries.dart';
import 'package:trace_mobile/features/vouchers/classes/vouchers_data_model.dart';
import 'package:trace_mobile/features/vouchers/classes/vouchers_state.dart';
import 'package:trace_mobile/features/vouchers/classes/vouchers_tran_types.dart';

class VouchersPage extends StatelessWidget {
  const VouchersPage({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        automaticallyImplyLeading: false,
        title: const VouchersAppBarTitle(),
      ),
      body: Column(children: const [
        // VouchersHeader(),
        SizedBox(
          height: 5,
        ),
        VouchersBody()
      ]),
    );
  }
}

class VouchersAppBarTitle extends StatelessWidget {
  const VouchersAppBarTitle({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return SizedBox(
      width: double.maxFinite,
      height: 40,
      child: SingleChildScrollView(
        scrollDirection: Axis.horizontal,
        child: Row(
            mainAxisAlignment: MainAxisAlignment.start,
            crossAxisAlignment: CrossAxisAlignment.center,
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
                      'Vouchers',
                      style: Theme.of(context).textTheme.headline6,
                    ),
                  ],
                ),
                onTap: () {
                  Navigator.pop(context);
                },
              ),
              const SizedBox(width: 5),
              ...getLabelsLayout(context)
            ]),
      ),
    );
  }

  List<Widget> getLabelsLayout(BuildContext context) {
    // var labels = context.read<VouchersState>().getAlllVoucherLabels();
    var vouchersStateMap = context.read<VouchersState>().vouchersStateMap;
    var getVouchersState = context.read<VouchersState>().getVouchersState;
    var keys = vouchersStateMap.keys.toList();
    var labelsLayout = keys.map(
      (String key) {
        return Material(
          child: Container(
            padding: const EdgeInsets.symmetric(horizontal: 5),
            child: InkWell(
              splashColor: Theme.of(context).primaryColorLight,
              onTap: () {
                context.read<VouchersState>().setVouchersState(key);
              },
              borderRadius: BorderRadius.circular(15),
              child: Ink(
                  height: 30,
                  decoration: BoxDecoration(
                    borderRadius: BorderRadius.circular(15),
                    color: Colors.amber.shade100,
                  ),
                  padding: const EdgeInsets.symmetric(horizontal: 10),
                  child: Center(
                    child: Text(
                      getVouchersState(key)!.label,
                      style: Theme.of(context).textTheme.labelLarge,
                    ),
                  )),
            ),
          ),
        );
      },
    ).toList();
    return labelsLayout;
  }
}

class VouchersBody extends StatelessWidget {
  const VouchersBody({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    var globalSettings = context.read<GlobalSettings>();
    return Consumer<VouchersState>(
      builder: (context, value, child) {
        var vouchersStateKey = value.voucherState;
        var no = value.getVouchersState(vouchersStateKey)!.voucherStateValue;
        var vouchersFuture = GraphQLQueries.genericView(
            globalSettings: globalSettings,
            isMultipleRows: true,
            sqlKey: 'get_allTransactions',
            args: {
              'dateFormat': 'dd/mm/yyyy',
              'no': no,
            });
        return FutureBuilder(
          future: vouchersFuture,
          builder: (context, snapshot) {
            var messageTheme = Theme.of(context).textTheme.headline6;
            var widget = const Text('');
            if (snapshot.connectionState == ConnectionState.waiting) {
              widget = Text('Loading...', style: messageTheme);
            } else if (snapshot.hasData) {
              List<dynamic> dataList =
                  snapshot.data?.data?['accounts']?['genericView'] ?? [];
              if (dataList.isEmpty) {
                widget = Text('No data', style: messageTheme);
              } else {
                List<VouchersDataModel> dataListModel = dataList.map(((e) {
                  e['tranType'] = vouchersTranTypesMap[e['tranTypeId']];
                  return VouchersDataModel.fromJson(j: e);
                })).toList();

                widget = Text('Has data', style: messageTheme);
              }
            } else {
              widget = Text('No data', style: messageTheme);
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
