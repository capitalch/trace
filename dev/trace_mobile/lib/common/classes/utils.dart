import 'dart:convert';

import 'package:trace_mobile/common/classes/graphql_queries.dart';

class Utils {

  static void execDataCache(context, globalSettings) async {
    var result = await GraphQLQueries.genericView(
        sqlKey: 'getJson_datacache_mobile', globalSettings: globalSettings);
  
    Map<String, dynamic> jsonResult =
        (result?.data?['accounts']?['genericView']?['jsonResult']);

    globalSettings.setUnitInfoAndBranches(
        jsonResult['unitInfo'], jsonResult['allBranches']);
    
  }

  static int getCurrentFinYearId() {
    int month = DateTime.now().month;
    int year = DateTime.now().year;
    if ([1, 2, 3].contains(month)) {
      year = year - 1;
    }
    return (year);
  }

  static bool isValidJson(String? j) {
    bool ret = true;
    if (j == null) {
      ret = false;
    } else {
      try {
        json.decode(j);
      } catch (e) {
        ret = false;
      }
    }
    return (ret);
  }
}
