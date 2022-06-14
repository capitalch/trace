import 'package:flutter/cupertino.dart';

class SalesState with ChangeNotifier {
  String _salesQueryKey = '';

  String get salesQueryKey {
    return _salesQueryKey;
  }

  set salesQueryKey(String val) {
    _salesQueryKey = val;
    notifyListeners();
  }
}
