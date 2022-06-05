import 'dart:io';

import 'package:flutter/foundation.dart';
import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:trace_mobile/common/classes/global_settings.dart';
import 'package:trace_mobile/features/authentication/screens/home_page.dart';
import 'package:trace_mobile/features/dashboard/dashboard_page.dart';
import 'package:trace_mobile/features/dashboard/stock.dart';
import 'package:trace_mobile/features/products/products_page.dart';
import 'features/authentication/screens/login_page.dart';

void main() {
  FlutterError.onError = ((FlutterErrorDetails details) {
    FlutterError.presentError(details);
    if (kReleaseMode) {
      exit(1);
    }
  });
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
          'dashboard': (BuildContext context) => const DashBoardPage(),
          'login': (BuildContext context) {
            return const LoginPage();
          },
          'products': (BuildContext context) => const ProductsPage(),
          'sales': (BuildContext context) => const DashBoardPage(),
          'stock': (BuildContext context) => const Stock(),
          
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
          backgroundColor: Colors.indigo,
          elevation: 0.0,
          titleTextStyle: TextStyle(color: Colors.white),
          iconTheme: IconThemeData(color: Colors.white, size: 24.0),
          // backgroundColor: Colors.white,
          // elevation: 0.0,
          // titleTextStyle: TextStyle(color: Colors.black),
          // iconTheme: IconThemeData(color: Colors.black, size: 24.0),
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
          headline1: TextStyle(
              fontSize: 28,
              fontWeight: FontWeight.w600,
              color: Colors.white),
          headline2: TextStyle(
              fontSize: 26,
              fontWeight: FontWeight.w600,
              color: Colors.white),
          headline3: TextStyle(
              fontSize: 24,
              fontWeight: FontWeight.w600,
              color: Colors.white),
          headline4: TextStyle(
              fontSize: 22,
              fontWeight: FontWeight.w600,
              color: Colors.white),
          headline5: TextStyle(
              fontSize: 20,
              fontWeight: FontWeight.w600,
              color: Colors.white),
          headline6: TextStyle(
              fontSize: 18,
              fontWeight: FontWeight.w700,
              color: Colors.white),
        ));
  }
}
