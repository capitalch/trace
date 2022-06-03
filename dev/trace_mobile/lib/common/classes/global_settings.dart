import 'dart:convert';
import 'package:flutter/foundation.dart';
import 'package:flutter/material.dart';
import 'package:graphql_flutter/graphql_flutter.dart';
import 'package:trace_mobile/common/classes/data_store.dart';
import 'package:trace_mobile/common/classes/utils.dart';

class GlobalSettings extends ChangeNotifier {
  GlobalSettings() {
    // constructor loads loginData from secured storage
    loadLoginDataFromSecuredStorage();
    _initGraphQLLoginClient();
    finYearId = Utils.getCurrentFinYearId();
    if (kReleaseMode) {
      serverUrl = 'https://develop.cloudjiffy.net/graphql';
    } else {
      serverUrl = 'http://10.0.2.2:5000/graphql';
    }
  }

  int? clientId, finYearId, lastUsedBranchId;
  GraphQLClient? graphQLLoginClient, graphQLMainClient;
  String? lastUsedBuCode, token, uid, userType;
  String serverUrl = 'http://10.0.2.2:5000/graphql';
  List<dynamic>? buCodes = [];
  List<dynamic>? buCodesWithPermissions;
  Map<String, String> unitInfo = {};
  List<Map<String, dynamic>> allBranches = [];

  void _initGraphQLLoginClient() {
    graphQLLoginClient = GraphQLClient(
        link: HttpLink(
          serverUrl,
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
    graphQLMainClient = GraphQLClient(
        link: HttpLink(serverUrl, defaultHeaders: {
          'authorization': (token == null) ? '' : 'Bearer $token',
          'SELECTION-CRITERIA': selectionCriteria
        }),
        cache: GraphQLCache(store: InMemoryStore()));
  }

  String getLoginDataAsJson() {
    Map<String, dynamic> jsonObject = {
      'buCodes': buCodes,
      'buCodesWithPermissions': buCodesWithPermissions,
      'clientId': clientId,
      'lastUsedBranchId': lastUsedBranchId,
      'lastUsedBuCode': lastUsedBuCode,
      'token': token,
      'uid': uid,
      'userType': userType,
    };
    return json.encode(jsonObject);
  }

  bool isUserLoggedIn() {
    bool ret = (token == null) || (uid == null) || (clientId == null);
    return (!ret);
  }

  Future loadLoginDataFromSecuredStorage() async {
    String? jLoginData = await DataStore.getLoginDataFromSecuredStorage();
    if (Utils.isValidJson(jLoginData)) {
      setLoginDataFromJson(jLoginData);
      notifyListeners();
    }
  }

  void resetLoginData() async {
    buCodes = buCodesWithPermissions = clientId =
        lastUsedBranchId = lastUsedBuCode = token = uid = userType = null;
    await DataStore.setLoginDataInSecuredStorage(getLoginDataAsJson());
    notifyListeners();
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
    allBranches.add({'id': 1, 'branchName': 'Head office', 'branchCode': 'HD'});
    setLoginData(demoLoginData, isNotifyListeners: false);
    _initGraphQLMainClient();
  }

  void setLastUsedBuCode(String buCode) {
    lastUsedBuCode = buCode;
    notifyListeners();
  }

  void setLoginData(dynamic loginData, {bool isNotifyListeners = true}) async {
    buCodes = loginData['buCodes'];
    buCodesWithPermissions = loginData['buCodesWithPermissions'];
    clientId = loginData['clientId'];
    lastUsedBranchId = loginData['lastUsedBranchId'];
    lastUsedBuCode = loginData['lastUsedBuCode'];
    token = loginData['token'];
    uid = loginData['uid'];
    userType = loginData['userType'];
    _initGraphQLMainClient();
    await DataStore.setLoginDataInSecuredStorage(getLoginDataAsJson());
    isNotifyListeners ? notifyListeners() : null;
  }

  void setLoginDataFromJson(loginDataJson) {
    Map<String, dynamic> loginDataObject = json.decode(loginDataJson);
    setLoginData(loginDataObject);
  }

  void setUnitInfoAndBranches(dynamic ui, dynamic bchs) {
    unitInfo = Map<String, String>.from(ui);
    allBranches = List<Map<String, dynamic>>.from(bchs);
    notifyListeners();
  }
}
