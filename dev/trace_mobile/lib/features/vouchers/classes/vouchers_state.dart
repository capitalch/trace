import 'package:flutter/cupertino.dart';

class VouchersState with ChangeNotifier {
  String voucherState = '100';

  Map<String, VouchersStateModel> vouchersStateMap = {
    '100': VouchersStateModel(
        label: 'Last 100', title: 'Last 100 rows', voucherStateValue: 100),
    '1000': VouchersStateModel(
        label: 'Last 1000', title: 'Last 1000 rows', voucherStateValue: 1000),
    '5000': VouchersStateModel(
        label: 'Last 5000', title: 'Last 1000 rows', voucherStateValue: 5000),
    '10000': VouchersStateModel(
        label: 'Last 10000',
        title: 'Last 10000 rows',
        voucherStateValue: 10000),
    'all': VouchersStateModel(
        label: 'All', title: 'all rows', voucherStateValue: null),
  };

  VouchersStateModel? getVouchersState(String voucherStateKey) {
    return vouchersStateMap[voucherStateKey];
  }

  List<String> getAlllVoucherLabels() {
    return vouchersStateMap.keys.map((var key) {
      return vouchersStateMap[key]!.label;
    }).toList();
  }

  setVouchersState(String val) {
    voucherState = val;
    notifyListeners();
  }
}

class VouchersStateModel {
  final String title;
  final String label;
  final int? voucherStateValue;

  VouchersStateModel(
      {required this.label,
      required this.title,
      required this.voucherStateValue});
}
