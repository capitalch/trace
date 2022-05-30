import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:provider/provider.dart';
import 'package:trace_mobile/common/global_settings.dart';
import '../../../common/routes.dart';

class HomePage extends StatelessWidget {
  const HomePage({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    var globalSettings = Provider.of<GlobalSettings>(context);
    return 
        Scaffold(
            backgroundColor: Theme.of(context).backgroundColor,
            body: Padding(
              padding: const EdgeInsets.all(20),
              child: Column(
                  mainAxisAlignment: MainAxisAlignment.spaceEvenly,
                  children: <Widget>[
                    Text('Trace', style: Theme.of(context).textTheme.headline4, ),
                    Text('Accounting on cloud', style: Theme.of(context).textTheme.headline5,),
                    // Text('This line is in Lato font', style: GoogleFonts.lato(textStyle: Theme.of(context).textTheme.headline5),),
                    Image.asset(
                      'assets/images/reports1.jpg',
                    ),
                    Row(
                        mainAxisAlignment: MainAxisAlignment.spaceBetween,
                        children: [
                          // Demo
                          ElevatedButton.icon(
                              onPressed: () {
                                globalSettings.setDemoLoginData();
                                Navigator.pushNamed(context, Routes.dashBoard);
                              },
                              icon: const Icon(Icons.account_tree),
                              label: const Text('Demo')),
                          // Login
                          ElevatedButton.icon(
                              onPressed: () {
                                // no back
                                Navigator.pushNamed(context, Routes.login);
                              },
                              icon: const Icon(Icons.login),
                              label: const Text('Login')),
                          // Next
                          const NextButton()
                        ])
                  ]),
            ));
  }
}

class NextButton extends StatelessWidget {
  const NextButton({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    var globalSettings = Provider.of<GlobalSettings>(context);
    bool isUserLoggedIn = globalSettings.isUserLoggedIn();
    return ElevatedButton.icon(
        onPressed: isUserLoggedIn
            ? () {
                Navigator.pushNamed(context, Routes.dashBoard);
              }
            : null,
        icon: const Icon(Icons.next_plan),
        label: const Text('Next'));
  }
}