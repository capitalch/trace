import 'package:flutter/cupertino.dart';

class SalesState with ChangeNotifier {
  // DateTime _startDate = DateTime.now(), _endDate = DateTime.now();
  String _salesQueryKey = '';

  // DateTime get startDate {
  //   return _startDate;
  // }

  // DateTime get endDate {
  //   return _endDate;
  // }

  String get salesQueryKey {
    return _salesQueryKey;
  }

  // set startDate(DateTime val) {
  //   _startDate = val;
  //   notifyListeners();
  // }

  // set endDate(DateTime val) {
  //   _endDate = val;
  //   notifyListeners();
  // }

  set salesQueryKey(String val) {
    _salesQueryKey = val;
    notifyListeners();
  }
}
