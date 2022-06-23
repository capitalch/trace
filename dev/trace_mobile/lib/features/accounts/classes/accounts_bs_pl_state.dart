import 'package:flutter/cupertino.dart';

class AccountsBsplState with ChangeNotifier {
  String _bsplType = '';
  String leftLabel = '';
  String rightLabel = '';
  bool _isSelectedLeftLabel = true;

  set bsplType(String val) {
    _bsplType = val;
    if (val == 'bs') {
      leftLabel = 'Liabilities';
      rightLabel = 'Assets';
    } else {
      leftLabel = 'Expenses';
      rightLabel = 'Income';
    }
  }

  get bsPlType {
    return _bsplType;
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
