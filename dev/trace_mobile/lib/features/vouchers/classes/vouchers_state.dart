import 'package:flutter/cupertino.dart';

class VouchersState with ChangeNotifier {
  String queryKey = '100';
  int rowCount = 0, debits = 0, credits = 0;

  init() {
    queryKey = '100';
    rowCount = 0;
    debits = 0;
    credits = 0;
  }

  initSummary() {
    rowCount = 0;
    debits = 0;
    credits = 0;
  }

  Map<String, VouchersStateModel> vouchersStateMap = {
    '100': VouchersStateModel(
        label: 'Last 100', title: 'Last 100 rows', queryCount: 100),
    '1000': VouchersStateModel(
        label: 'Last 1000', title: 'Last 1000 rows', queryCount: 1000),
    '5000': VouchersStateModel(
        label: 'Last 5000', title: 'Last 1000 rows', queryCount: 5000),
    '10000': VouchersStateModel(
        label: 'Last 10000', title: 'Last 10000 rows', queryCount: 10000),
    'all':
        VouchersStateModel(label: 'All', title: 'All rows', queryCount: null),
  };

  VouchersStateModel? getVouchersState(String voucherStateKey) {
    return vouchersStateMap[voucherStateKey];
  }

  List<String> getAlllVoucherLabels() {
    return vouchersStateMap.keys.map((var key) {
      return vouchersStateMap[key]!.label;
    }).toList();
  }

  setQueryKey(String val) {
    queryKey = val;
    notifyListeners();
  }

  setRowCount(int count) {
    rowCount = count;
    notifyListeners();
  }
}

class VouchersStateModel {
  final String title;
  final String label;
  final int? queryCount;

  VouchersStateModel(
      {required this.label, required this.title, required this.queryCount});
}
