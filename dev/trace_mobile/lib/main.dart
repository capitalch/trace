import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:trace_mobile/features/authentication/screens/home_page.dart';
import 'features/authentication/screens/trace_home.dart';

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
          theme: ThemeData(
            primarySwatch: Colors.indigo,
          ),
          home: const HomePage(),
          routes: {
            'login': (BuildContext context){
              return LoginPage();
            }
          },
        ));
  }
}