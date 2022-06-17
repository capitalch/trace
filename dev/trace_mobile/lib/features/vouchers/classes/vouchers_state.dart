import 'package:flutter/cupertino.dart';

class VouchersState with ChangeNotifier {
  String voucherState= '100';
  
  Map<String, VouchersStateModel> vouchersStateMap = {
    '100': VouchersStateModel(title: 'Last 100 rows', voucherStateValue: 100),
    '1000':
        VouchersStateModel(title: 'Last 1000 rows', voucherStateValue: 1000),
    '10000':
        VouchersStateModel(title: 'Last 10000 rows', voucherStateValue: 10000),
    'all': VouchersStateModel(title: 'all rows', voucherStateValue: null),
  };

  VouchersStateModel? getVouchersState(String voucherStateKey) {
    return vouchersStateMap[voucherStateKey];
  }

  setVouchersState(String val) {
    voucherState = val;
    notifyListeners();
  }

}

class VouchersStateModel {
  final String title;
  final int? voucherStateValue;

  VouchersStateModel({required this.title, required this.voucherStateValue});
}
