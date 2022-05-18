import 'package:flutter/material.dart';
class Counter extends ChangeNotifier {
  int _count = 0;
  void incrCounter() {
    _count+=1;
    // print(_count);
    notifyListeners();
  }
}