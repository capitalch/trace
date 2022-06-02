import 'dart:convert';

import 'package:graphql_flutter/graphql_flutter.dart';
import 'package:trace_mobile/common/classes/graphql_queries.dart';
import 'package:trace_mobile/common/classes/graphql_queries.dart';

class GraphQLQueries {
  static var queries = {
    'login': (String credentials) => '''query login {
         authentication {
         doLogin(credentials:"$credentials")
        }}''',
  };

  static login(String credentials) {
    return gql('''query login {
         authentication {
         doLogin(credentials:"$credentials")
        }}''');
  }

  static genericView(dynamic value, String entityName) {
    return gql('''
      query genericView {
        $entityName {
          genericView(value: "$value")
        }
      }
''');
  }

  static dynamic getGraphQLQuery(
      String queryName, dynamic queryArgs, String operationName) {
    return (QueryOptions(
        document: gql(queries['login']!(queryArgs)),
        operationName: operationName));
  }
}

class GenericViewValues {
  GenericViewValues(
      {required this.sqlKey, this.isMultipleRows = false, this.args}) {}
  final String sqlKey;
  bool isMultipleRows;
  dynamic args = [];

  Map<String, dynamic> toJson() {
    return {"sqlKey": sqlKey, "isMultipleRows": isMultipleRows, "args": args};
  }

  @override
  String toString() {
    return json.encode(
        {"sqlKey": sqlKey, "isMultipleRows": isMultipleRows, "args": args});
  }
}
