import 'package:flutter/cupertino.dart';

class SalesState with ChangeNotifier {
  String _salesQueryKey = '';
  Map<String, double> _summaryMap = {};

  String get salesQueryKey => _salesQueryKey;

  set salesQueryKey(String val) {
    _salesQueryKey = val;
    notifyListeners();
  }

  Map<String, double> get summaryMap => _summaryMap;

  set summaryMap(Map<String, double> val) {
    _summaryMap = val;
    notifyListeners();
  }
}
