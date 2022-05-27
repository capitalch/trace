import 'package:flutter/material.dart';

class GlobalSettings extends ChangeNotifier {
  int? _clientId, _lastUsedBranchId;
  String?
      _lastUsedBuCode,
      _token,
      _uid,
      _userType;
  List<String>? _buCodes = [];
  List<Map<String, dynamic>>? _buCodesWithPermissions;

  void resetLoginData() {
    _buCodes = _buCodesWithPermissions = _clientId =
        _lastUsedBranchId = _lastUsedBuCode = _token = _uid = _userType = null;
  }

  void setLoginData(
    dynamic loginData,
  ) {
    _buCodes = loginData['buCodes'];
    _buCodesWithPermissions = loginData['buCodesWithPermissions'];
    _clientId = loginData['clientId'];
    _lastUsedBranchId = loginData['lastUsedBranchId'];
    _lastUsedBuCode = loginData['lastUsedBuCode'];
    _token = loginData['token'];
    _uid = loginData['uid'];
    _userType = loginData['userType'];
  }

  List<String>? get buCodes => _buCodes;
  List<Map<String, dynamic>>? get buCodesWithPermissions => _buCodesWithPermissions;
  int? get clientId => _clientId;
  int? get lastUsedBranchId => _lastUsedBranchId;
  String? get lastUsedBuCode => _lastUsedBuCode;
  String? get token => _token;
  String? get uid => _uid;
  String? get userType => _userType;
}
