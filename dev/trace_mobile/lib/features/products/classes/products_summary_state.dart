import 'package:flutter/cupertino.dart';

class ProductsSummaryState extends ChangeNotifier {
  int _summaryCount = 0;
  double _summaryClos = 0,
      _summarySumGst = 0,
      _summarySum = 0,
      _summaryAge360Qty = 0,
      _summaryAge360Value = 0,
      _summaryAge360ValueGst = 0;

  int get summaryCount => _summaryCount;

  set summaryCount(int val) {
    _summaryCount = val;
    notifyListeners();
  }

  double get summaryClos => _summaryClos;

  set summaryClos(double val) {
    _summaryClos = val;
    notifyListeners();
  }

  double get summarySumGst => _summarySumGst;

  set summarySumGst(double val) {
    _summarySumGst = val;
    notifyListeners();
  }

  double get summarySum => _summarySum;

  set summarySum(double val) {
    _summarySum = val;
    notifyListeners();
  }

  double get summaryAge360Qty => _summaryAge360Qty;
  set summaryAge360Qty(double val) {
    _summaryAge360Qty = val;
    notifyListeners();
  }

  double get summaryAge360Value => _summaryAge360Value;
  set summaryAge360Value(double val) {
    _summaryAge360Value = val;
    notifyListeners();
  }

  double get summaryAge360ValueGst => _summaryAge360ValueGst;
  set summaryAge360ValueGst(double val) {
    _summaryAge360ValueGst = val;
    notifyListeners();
  }
}
