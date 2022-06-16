import 'package:flutter/cupertino.dart';

class ProductsSummaryState extends ChangeNotifier {
  int _summaryCount = 0;
  double _summaryClos = 0,
      _summarySumGst = 0,
      _summarySum = 0,
      _summaryJakarQty = 0,
      _summaryJakarValue = 0,
      _summaryJakarValueGst = 0;

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

  double get summaryJakarQty => _summaryJakarQty;
  set summaryJakarQty(double val) {
    _summaryJakarQty = val;
    notifyListeners();
  }

  double get summaryJakarValue => _summaryJakarValue;
  set summaryJakarValue(double val) {
    _summaryJakarValue = val;
    notifyListeners();
  }

  double get summaryJakarValueGst => _summaryJakarValueGst;
  set summaryJakarValueGst(double val) {
    _summaryJakarValueGst = val;
    notifyListeners();
  }
}
