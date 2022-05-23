import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:trace_mobile/features/authentication/screens/home_page.dart';

import 'features/authentication/screens/home_page.dart';
import 'features/authentication/screens/login_page.dart';

void main() {
  runApp(const TraceApp());
}

class TraceApp extends StatelessWidget {
  const TraceApp({super.key});

  @override
  Widget build(BuildContext context) {
    return ChangeNotifierProvider(
        create: (context) {},
        child: MaterialApp(
          title: 'Trace',
          theme: getThemeData(),
          home: const HomePage(),
          routes: {
            'login': (BuildContext context) {
              return const LoginPage();
            }
          },
        ));
  }

  ThemeData getThemeData() {
    const _textStyle = TextStyle(color: Colors.indigo, fontWeight: FontWeight.w600);
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
          headline4:_textStyle,
          headline5:_textStyle,
          headline6: _textStyle

        ));
  }
}
