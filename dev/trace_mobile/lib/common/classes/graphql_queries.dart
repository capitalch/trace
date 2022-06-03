import 'dart:convert';

import 'package:graphql_flutter/graphql_flutter.dart';
import 'package:trace_mobile/common/classes/global_settings.dart';

class GraphQLQueries {

  static login(String credentials) {
    return gql('''query login {
         authentication {
         doLogin(credentials:"$credentials")
        }}''');
  }

  static Future<QueryResult<Object>>? genericView({
    required String sqlKey,
    bool isMultipleRows = false,
    Map<String, dynamic>? args,
    required GlobalSettings globalSettings,
    String entityName = 'accounts',
  }) {
    String value = GQLGenericViewValue(
      sqlKey: sqlKey,
      isMultipleRows: isMultipleRows,
      args: args,
    ).toString();
    var gq = gql('''
      query genericView {
        $entityName {
          genericView(value: "$value")
        }
      }
    ''');
    return globalSettings.graphQLMainClient?.query(
      QueryOptions(document: gq, operationName: 'genericView'),
    );
  }
}

class GQLGenericViewValue {
  GQLGenericViewValue(
      {required this.sqlKey, this.isMultipleRows = false, this.args});
  final String sqlKey;
  final bool isMultipleRows;
  final Map<String, dynamic>? args;

  @override
  String toString() {
    String str = json.encode(
        {"sqlKey": sqlKey, "isMultipleRows": isMultipleRows, "args": args});
    return Uri.encodeFull(str);
  }
}