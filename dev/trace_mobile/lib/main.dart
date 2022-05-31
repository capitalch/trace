import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
// import 'package:flutter_secure_storage/flutter_secure_storage.dart';
// import 'package:flutter_secure_storage/flutter_secure_storage.dart';
import 'package:provider/provider.dart';
// import 'package:graphql_flutter/graphql_flutter.dart';
import 'package:trace_mobile/common/global_settings.dart';
// import 'package:trace_mobile/common/graphql/graphql_service.dart';
import 'package:trace_mobile/features/authentication/screens/home_page.dart';
import 'package:trace_mobile/features/dashboard/dashboard.dart';
import 'package:trace_mobile/features/dashboard/jakar.dart';

// import 'features/authentication/screens/home_page.dart';
import 'features/authentication/screens/login_page.dart';

void main() async {
  runApp(const TraceApp());
}

class TraceApp extends StatelessWidget {
  const TraceApp({Key? key}) : super(key: key);
  @override
  Widget build(BuildContext context) {
    return (
        // GraphQLProvider(
        // client: GraphQLService.client,
        // child:
        MultiProvider(
      providers: [
        // ChangeNotifierProvider(create: (context) {
        //   return GraphQLService();
        // }),
        ChangeNotifierProvider(create: (context) => GlobalSettings())
      ],
      child: MaterialApp(
        title: 'Trace',
        theme: getThemeData(),
        home: const HomePage(),
        routes: {          
          'dashBoard': (BuildContext context) => const DashBoard(),
          'jakar':(BuildContext context) => const Jakar(),
          'login': (BuildContext context) {
            return const LoginPage();
          },
        },
      ),
    ));
  }

  ThemeData getThemeData() {
    const textStyle =
        TextStyle(color: Colors.indigo, fontWeight: FontWeight.w600);
    return ThemeData(
        backgroundColor: Colors.white,
        appBarTheme: const AppBarTheme(
          backgroundColor: Colors.white,
          elevation: 0.0,
          titleTextStyle: TextStyle(color: Colors.black),
          iconTheme: IconThemeData(color: Colors.black, size: 24.0),
        ),
        elevatedButtonTheme: ElevatedButtonThemeData(
            style: ButtonStyle(
          textStyle: const MaterialStatePropertyAll(TextStyle(
            fontSize: 18,
          )),
          shape: MaterialStateProperty.all<RoundedRectangleBorder>(
              RoundedRectangleBorder(
            borderRadius: BorderRadius.circular(4.0),
          )),
        )),
        primarySwatch: Colors.indigo,
        scaffoldBackgroundColor: Colors.white,
        textTheme: const TextTheme(
            headline4: textStyle, headline5: textStyle, headline6: textStyle, ));
  }
}
