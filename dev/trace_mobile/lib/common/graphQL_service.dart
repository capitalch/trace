import 'package:flutter/material.dart';
import 'package:graphql_flutter/graphql_flutter.dart';

class GraphQLService {
  static final HttpLink httpLink = HttpLink(
    'http://10.0.2.2:5000/graphql',
  );

  static ValueNotifier<GraphQLClient> client = ValueNotifier(
    GraphQLClient(
      link: httpLink,
      cache: GraphQLCache(store: InMemoryStore()),
    ),
  );

  static GraphQLClient clientToQuery = GraphQLClient(
    link: httpLink,
    cache: GraphQLCache(store: InMemoryStore()),
  );
}

class TraceGraphQLClient extends ChangeNotifier {
  HttpLink _httpLink = HttpLink(
    'http://10.0.2.2:5000/graphql',
  );

  GraphQLClient get client {
    return GraphQLClient(
      link: _httpLink,
      cache: GraphQLCache(store: InMemoryStore()),
    );
  }
}
