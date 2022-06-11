import 'package:flutter/cupertino.dart';

class ProductsSummaryState extends ChangeNotifier {
  int _summaryCount = 0;
  double _summaryClos = 0, _summarySumGst = 0, _summarySum = 0;

  int get summaryCount {
    return _summaryCount;
  }

  set summaryCount(int val) {
    _summaryCount = val;
    notifyListeners();
  }

  double get summaryClos {
    return _summaryClos;
  }

  set summaryClos(double val) {
    _summaryClos = val;
    notifyListeners();
  }

  double get summarySumGst {
    return _summarySumGst;
  }

  set summarySumGst(double val) {
    _summarySumGst = val;
    notifyListeners();
  }

  double get summarySum {
    return _summarySum;
  }

  set summarySum(double val) {
    _summarySum = val;
    notifyListeners();
  }
}
