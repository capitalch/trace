import 'package:flutter/material.dart';
import 'package:graphql_flutter/graphql_flutter.dart';
// import 'package:http/http.dart' as http;
import 'package:provider/provider.dart';

void main() {
  runApp(const MyApp());
}

class MyApp extends StatelessWidget {
  const MyApp({super.key});

  // This widget is the root of your application.
  @override
  Widget build(BuildContext context) {
    final HttpLink httpLink = HttpLink(
      'http://10.0.2.2:5000/graphql',
    );
    ValueNotifier<GraphQLClient> client = ValueNotifier(GraphQLClient(
        cache: GraphQLCache(store: InMemoryStore()), link: httpLink));
    return MaterialApp(
        title: 'Flutter Demo',
        theme: ThemeData(
          primarySwatch: Colors.blue,
        ),
        home:
            // MaterialApp(
            //     home:
            GraphQLProvider(
                client: client,
                child: const MyHomePage(
                  title: 'GraphQL demo',
                )));
    // home: const MyHomePage(title: 'Flutter Demo Home Page'),
    // );
  }
}

class MyHomePage extends StatefulWidget {
  const MyHomePage({super.key, required this.title});
  final String title;
  @override
  State<MyHomePage> createState() => _MyHomePageState();
}

class _MyHomePageState extends State<MyHomePage> {
  String query = '''query login {
   authentication {
   doLogin(credentials:"s:s")
  }}''';
  @override
  Widget build(BuildContext context) {
    return Scaffold(
        appBar: AppBar(
          title: Text(widget.title),
        ),
        body: Query(
          options: QueryOptions(
            document: gql(query),
          ),
          builder: (QueryResult result, {fetchMore, refetch}) {
            if (result.data == null) {
              return const Center(child: Text('Loading...'));
            } else {
              return const Text('Success');
            }
          },
        ));
  }
}
