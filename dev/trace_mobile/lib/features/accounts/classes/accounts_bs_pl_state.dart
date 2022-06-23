import 'package:flutter/cupertino.dart';

class AccountsBsplState with ChangeNotifier {
  String _bsplType = '';
  String leftLabel = '';
  String rightLabel = '';
  bool _isSelectedLeftLabel = true;
  AccTypes _currentAccType = AccTypes.none;

  String get bsplType {
    return _bsplType;
  }

  set bsplType(String val) {
    _bsplType = val;
    if (val == 'bs') {
      leftLabel = 'Liabilities';
      rightLabel = 'Assets';
      _currentAccType = AccTypes.L;
    } else {
      leftLabel = 'Expenses';
      rightLabel = 'Income';
      _currentAccType = AccTypes.E;
    }
  }

  get bsPlType {
    return _bsplType;
  }

  AccTypes get currentAccType {
    return _currentAccType;
  }

  set currentAccType(AccTypes val) {
    _currentAccType = val;
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

enum AccTypes { none, L, A, E, I }
