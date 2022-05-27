import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:graphql_flutter/graphql_flutter.dart';
import 'package:trace_mobile/common/global_settings.dart';
import 'package:trace_mobile/common/graphql/graphql_service.dart';
import 'package:trace_mobile/features/authentication/screens/home_page.dart';
import 'package:trace_mobile/features/dashboard/dashboard.dart';

import 'features/authentication/screens/home_page.dart';
import 'features/authentication/screens/login_page.dart';

void main() {
  runApp(TraceApp());
}

class TraceApp extends StatelessWidget {
  TraceApp({super.key});

  @override
  Widget build(BuildContext context) {
    // final HttpLink httpLink = HttpLink(
    //   'http://10.0.2.2:5000/graphql',
    // );
    // ValueNotifier<GraphQLClient> client = ValueNotifier(GraphQLClient(
    //     cache: GraphQLCache(store: InMemoryStore()), link: httpLink));

    return (
        // GraphQLProvider(
        // client: GraphQLService.client,
        // child:
        MultiProvider(
          providers: [
            ChangeNotifierProvider(create: (context) {return GraphQLService();}),
            ChangeNotifierProvider(create: (context)=>GlobalSettings())
          ],
          child: MaterialApp(
            title: 'Trace',
            theme: getThemeData(),
            home: const HomePage(),
            routes: {
              'login': (BuildContext context) {
                return const LoginPage();
              },
              'dashBoard': (BuildContext context) => const DashBoard()
            },
          ),
        ));
  }

  ThemeData getThemeData() {
    const textStyle =
        TextStyle(color: Colors.indigo, fontWeight: FontWeight.w600);
    return ThemeData(
        backgroundColor: Colors.grey.shade300,
        primarySwatch: Colors.indigo,
        elevatedButtonTheme: ElevatedButtonThemeData(
            style: ButtonStyle(
          textStyle: const MaterialStatePropertyAll(TextStyle(
            fontSize: 18,
          )),
          shape: MaterialStateProperty.all<RoundedRectangleBorder>(
              RoundedRectangleBorder(
            borderRadius: BorderRadius.circular(10.0),
          )),
        )),
        textTheme: const TextTheme(
            headline4: textStyle,
            headline5: textStyle,
            headline6: textStyle));
  }
}
