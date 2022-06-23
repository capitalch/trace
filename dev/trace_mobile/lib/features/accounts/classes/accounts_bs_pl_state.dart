import 'package:flutter/cupertino.dart';

class AccountsBsplState with ChangeNotifier {
  String _bsplType = '';
  String leftLabel = '';
  String rightLabel = '';
  bool _isSelectedLeftLabel = true;
  AccType _currentItem = AccType.none;

  set bsplType(String val) {
    _bsplType = val;
    if (val == 'bs') {
      leftLabel = 'Liabilities';
      rightLabel = 'Assets';
      _currentItem = AccType.L;
    } else {
      leftLabel = 'Expenses';
      rightLabel = 'Income';
      _currentItem = AccType.A;
    }
  }

  get bsPlType {
    return _bsplType;
  }

  AccType get currentItem {
    return _currentItem;
  }

  set currentItem(AccType val) {
    _currentItem = val;
    notifyListeners();
  }

  init() {
    _isSelectedLeftLabel = true;
  }

  set isSelectedLeftLabel(bool val) {
    _isSelectedLeftLabel = val;

    notifyListeners();
  }

  bool get isSelectedLeftLabel {
    return _isSelectedLeftLabel;
  }
}

enum AccType { none, L, A, E, I }
