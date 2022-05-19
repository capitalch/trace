import 'package:flutter/material.dart';

class Counter extends ChangeNotifier {
  int _count = 0;
  get count {
    return _count;
  }
  void incrCounter() {
    _count += 1;
    notifyListeners();
  }
}
