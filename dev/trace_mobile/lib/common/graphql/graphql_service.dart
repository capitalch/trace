import 'package:flutter/material.dart';
import 'package:graphql_flutter/graphql_flutter.dart';

class GraphQLService extends ChangeNotifier {
  final HttpLink _httpLink = HttpLink(
    'http://10.0.2.2:5000/graphql',
  );

  GraphQLClient get client {
    return GraphQLClient(
      link: _httpLink,
      cache: GraphQLCache(store: InMemoryStore()),
    );
  }
}
