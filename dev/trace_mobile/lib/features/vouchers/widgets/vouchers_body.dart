import 'package:flutter/material.dart';
import 'package:intl/intl.dart';
import 'package:provider/provider.dart';
import 'package:trace_mobile/common/classes/global_settings.dart';
import 'package:trace_mobile/common/classes/graphql_queries.dart';
import 'package:trace_mobile/features/vouchers/classes/vouchers_data_model.dart';
import 'package:trace_mobile/features/vouchers/classes/vouchers_state.dart';
import 'package:trace_mobile/features/vouchers/classes/vouchers_tran_types.dart';

class VouchersBody extends StatelessWidget {
  const VouchersBody({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    var globalSettings = context.read<GlobalSettings>();
    var vouchersState = context.read<VouchersState>();
    return Selector<VouchersState, String>(
      selector: (p0, p1) => p1.queryKey,
      builder: (context, value, child) {
        // var vouchersStateKey = value; //.queryKey;
        var no = vouchersState.getVouchersState(value)!.queryCount;
        // value.getVouchersState(vouchersStateKey)!.queryCount;
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
            dynamic widget = const Text('');
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
                vouchersState.initSummary();
                for (var element in dataListModel) {
                  vouchersState.debits =
                      vouchersState.debits + element.debit.toInt();
                  vouchersState.credits =
                      vouchersState.credits + element.credit.toInt();
                }
                Future.delayed(Duration.zero, (() {
                  vouchersState.setRowCount(dataList.length);
                }));

                widget =
                    VouchersListViewData(vouchersDataListModel: dataListModel);
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

class VouchersListViewData extends StatelessWidget {
  const VouchersListViewData({Key? key, required this.vouchersDataListModel})
      : super(key: key);

  final List<VouchersDataModel> vouchersDataListModel;

  @override
  Widget build(BuildContext context) {
    return ListView.builder(
      itemCount: vouchersDataListModel.length,
      itemBuilder: (context, index) {
        return VouchersCardListItem(
          itemModel: vouchersDataListModel[index],
        );
      },
    );
  }
}

class VouchersCardListItem extends StatelessWidget {
  const VouchersCardListItem({Key? key, required this.itemModel})
      : super(key: key);

  final VouchersDataModel itemModel;

  @override
  Widget build(BuildContext context) {
    return Center(
      child: Card(
          elevation: 2,
          child: Container(
            color: Colors.grey.shade200,
            child: Column(children: [
              getRowOne(context),
              getRowTwo(context),
            ]),
          )),
    );
  }

  getRowOne(BuildContext context) {
    var formatter = NumberFormat('#,##,###');
    var dateFormatter = DateFormat('dd/MM/yyyy');
    var labelLarge = Theme.of(context).textTheme.labelLarge;
    var labelLargeBold = labelLarge?.copyWith(fontWeight: FontWeight.bold);
    var labelMedium = Theme.of(context).textTheme.labelMedium;
    // var labelMediumBold = labelMedium?.copyWith(fontWeight: FontWeight.bold);
    var dateWidget = Text(
      dateFormatter.format(DateTime.parse(itemModel.tranDate)),
      style: labelLargeBold,
    );
    var autoRefNoWidget = Text(itemModel.autoRefNo, style: labelMedium);
    var debitAmountWidget = Text(
      '${formatter.format(itemModel.debit)} Dr',
      style: labelLargeBold,
    );
    var creditAmountWidget = Text(
      '${formatter.format(itemModel.credit)} Cr',
      style: labelLargeBold?.copyWith(color: Colors.amber.shade700),
    );
    Container ret = Container(
        padding: const EdgeInsets.only(left: 15, top: 10, right: 15),
        child: Row(
          crossAxisAlignment: CrossAxisAlignment.center,
          mainAxisAlignment: MainAxisAlignment.start,
          children: [
            dateWidget,
            const SizedBox(
              width: 10,
            ),
            autoRefNoWidget,
            const SizedBox(
              width: 10,
            ),
            Text(
              itemModel.tranType,
              style: labelLargeBold,
            ),
            const Spacer(),
            (itemModel.debit == 0) ? creditAmountWidget : debitAmountWidget
          ],
        ));
    return ret;
  }

  getRowTwo(BuildContext context) {
    var textTheme = Theme.of(context).textTheme;
    var indexWidget = Container(
        padding: const EdgeInsets.only(right: 20),
        child: Text(
          itemModel.index.toString(),
          style: textTheme.labelLarge?.copyWith(
              fontWeight: FontWeight.bold, color: Colors.indigo.shade500),
        ));
    var accNameWidget = Text(
      itemModel.accName,
      style: textTheme.labelLarge
          ?.copyWith(color: Colors.blue, fontWeight: FontWeight.bold),
    );
    var detailsString = [
      '(ID: ${itemModel.id.toString()}) ',
      (itemModel.remarks == null) ? '' : itemModel.remarks,
      (itemModel.userRefNo == null) ? '' : ' ${itemModel.userRefNo}',
      (itemModel.lineRefNo == null) ? '' : ' ${itemModel.lineRefNo}',
      (itemModel.lineRemarks == null) ? '' : ' ${itemModel.lineRemarks}',
      (itemModel.instrNo == null) ? '' : ' ${itemModel.instrNo} ',
      DateFormat(' hh:MM:ss a')
          .format(DateTime.parse(itemModel.timestamp).toLocal()),
    ].join();
    var detailsWidget = Text(
      detailsString,
      style: textTheme.labelMedium,
    );

    var retWidget = Container(
        padding: const EdgeInsets.only(left: 15, top: 5, right: 15, bottom: 15),
        child: Row(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            indexWidget,
            Expanded(
                child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                accNameWidget,
                detailsWidget,
                // const Text(
                //   'hhhhhhhhj jhhhhhh hhhhhhhh hsjhj fh dfhgdfhgdh dfgdfgdf 676777 tytuytuytt dfddf gdfddfd gkjhhfdg hj jkkj jkj 67 68 jkjuy ytuytt tyt yutt tyt re rtr',
                // )
              ],
            ))
          ],
        ));
    return retWidget;
  }
}