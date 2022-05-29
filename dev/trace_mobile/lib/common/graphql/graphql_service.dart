import 'package:flutter/material.dart';
import 'package:graphql_flutter/graphql_flutter.dart';

class GraphQLService extends ChangeNotifier {
  HttpLink httpLink = HttpLink(
    'http://10.0.2.2:5000/graphql',
  );

  GraphQLClient get client {
    return GraphQLClient(
      link: httpLink,
      cache: GraphQLCache(store: InMemoryStore()),
    );
  }

  GraphQLClient getClientWithHeaders(Map<String, String> headers) {
    HttpLink otherHttpLink =
        HttpLink(httpLink.uri.toString(), defaultHeaders: headers);
    GraphQLClient client = GraphQLClient(
        link: otherHttpLink, cache: GraphQLCache(store: InMemoryStore()));
    return (client);
  }
}
