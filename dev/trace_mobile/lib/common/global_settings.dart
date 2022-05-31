import 'dart:convert';
import 'package:flutter/material.dart';
import 'package:graphql_flutter/graphql_flutter.dart';
import 'package:trace_mobile/common/data_store.dart';
import 'package:trace_mobile/common/utils.dart';

class GlobalSettings extends ChangeNotifier {
  GlobalSettings() {
    // constructor loads loginData from secured storage
    loadLoginDataFromSecuredStorage();
    _initGraphQLLoginClient();
    _finYearId = Utils.getCurrentFinYearId();
  }
  int? _clientId, _finYearId, _lastUsedBranchId;
  GraphQLClient? _graphQLLoginClient, _graphQLMainClient;
  String? _lastUsedBuCode, _token, _uid, _userType;
  final String _serverUrl = 'http://10.0.2.2:5000/graphql';
  List<dynamic>? _buCodes = [];
  List<dynamic>? _buCodesWithPermissions;

  void _initGraphQLLoginClient() {
    _graphQLLoginClient = GraphQLClient(
        link: HttpLink(
          _serverUrl,
        ),
        cache: GraphQLCache(store: InMemoryStore()));
  }

  void _initGraphQLMainClient() {
    String selectionCriteria = [
      (lastUsedBuCode ?? ''),
      ':',
      Utils.getCurrentFinYearId(),
      ':',
      (lastUsedBranchId ?? '1')
    ].join();
    _graphQLMainClient = GraphQLClient(
        link: HttpLink(_serverUrl, defaultHeaders: {
          'authorization': (_token == null) ? '' : 'Bearer $_token',
          'SELECTION-CRITERIA': selectionCriteria
        }),
        cache: GraphQLCache(store: InMemoryStore()));
  }

  void resetLoginData() async {
    _buCodes = _buCodesWithPermissions = _clientId =
        _lastUsedBranchId = _lastUsedBuCode = _token = _uid = _userType = null;
    DataStore.setLoginDataInSecuredStorage(getLoginDataAsJson());
  }

  void setDemoLoginData() {
    var demoLoginData = {
      'buCodes': ['demoUnit1'],
      "buCodesWithPermissions": [],
      'clientId': 2,
      'lastUsedBranchId': 1,
      'lastUsedBuCode': 'demoUnit1',
      'token':
          'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ1aWQiOiJkIiwidXNlclR5cGUiOiJhIiwiaWQiOjIsImNsaWVudElkIjoyfQ.rZd0cUhxNqIHrl8Pp2pylYm0DLZA5kPRP6xx61xgkNw',
      'uid': 'd',
      'userType': 'a',
      // id: 2,
      // entityNames: ['accounts'],
    };
    setLoginData(demoLoginData);
    _initGraphQLMainClient();
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
    _initGraphQLMainClient();
  }

  void setLoginDataFromJson(loginDataJson) {
    Map<String, dynamic> loginDataObject = json.decode(loginDataJson);
    setLoginData(loginDataObject);
  }

  String getLoginDataAsJson() {
    Map<String, dynamic> jsonObject = {
      'buCodes': _buCodes,
      'buCodesWithPermissions': _buCodesWithPermissions,
      'clientId': _clientId,
      'lastUsedBranchId': _lastUsedBranchId,
      'lastUsedBuCode': _lastUsedBuCode,
      'token': _token,
      'uid': _uid,
      'userType': _userType,
    };
    return json.encode(jsonObject);
  }

  bool isUserLoggedIn() {
    bool ret = (_token == null) || (_uid == null) || (_clientId == null);
    return (!ret);
  }

  Future loadLoginDataFromSecuredStorage() async {
    String? jLoginData = await DataStore.getLoginDataFromSecuredStorage();
    if (Utils.isValidJson(jLoginData)) {
      setLoginDataFromJson(jLoginData);
      notifyListeners();
    }
  }

  List<dynamic>? get buCodes => _buCodes;
  List<dynamic>? get buCodesWithPermissions => _buCodesWithPermissions;
  int? get clientId => _clientId;
  int? get finYearId => _finYearId;
  GraphQLClient? get graphQlLoginClient => _graphQLLoginClient;
  GraphQLClient? get graphQLMainClient => _graphQLMainClient;
  int? get lastUsedBranchId => _lastUsedBranchId;
  String? get lastUsedBuCode => _lastUsedBuCode;
  String? get token => _token;
  String? get uid => _uid;
  String? get userType => _userType;
}
