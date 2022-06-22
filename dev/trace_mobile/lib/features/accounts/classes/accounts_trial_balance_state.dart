import 'package:flutter/cupertino.dart';

class AccountsTrialBalanceState with ChangeNotifier {
  double opening = 0, debits = 0, credits = 0, closing = 0;
  String openingDC = 'Dr', closingDC = 'Cr';
  // AccountsTrialBalanceState(
  //     {required this.opening,
  //     required this.debits,
  //     required this.credits,
  //     required this.closing,
  //     required this.openingDC,
  //     required this.closingDC}) {
  //   notifyListeners();
  // }
  notify() {
    notifyListeners();
  }
}
