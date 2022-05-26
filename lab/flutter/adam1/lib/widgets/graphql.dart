import 'package:flutter/material.dart';
import 'package:graphql_flutter/graphql_flutter.dart';

class GraphQL extends StatelessWidget {
  const GraphQL({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    final HttpLink link = HttpLink('http://localhost:5000/graphql');
    ValueNotifier<GraphQLClient> client = ValueNotifier(
        GraphQLClient(cache: GraphQLCache(store: InMemoryStore()), link: link));

    return (GraphQLProvider(
      client: client,
      child: Scaffold(
        appBar: AppBar(title: const Text('GraphQL')),
        body: const Padding(
          padding: EdgeInsets.all(10),
          child: DisplayResults(),
        ),
      ),
    ));
  }
}

class DisplayResults extends StatelessWidget {
  const DisplayResults({Key? key}) : super(key: key);
  final loginQuery = '''
    query login {
        authentication {
        doLogin(credentials:"abc")
    }} ''';
  @override
  Widget build(BuildContext context) {
    return Query(
        options: QueryOptions(document: gql(loginQuery)),
        builder: (QueryResult result, {fetchMore, refetch}) {
          if (result.hasException) {
            return Text(result.exception.toString());
          }

          if (result.isLoading) {
            return const Center(
              child: CircularProgressIndicator(),
            );
          }
          final output = result.data;
          return (const Text('Data received...'));

        });
  }
}
