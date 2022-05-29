import 'package:flutter/material.dart';
// import 'package:flutter_secure_storage/flutter_secure_storage.dart';
// import 'package:graphql_flutter/graphql_flutter.dart';
// import 'package:localstorage/localstorage.dart';
import 'package:provider/provider.dart';
import 'package:trace_mobile/common/global_settings.dart';
import 'package:trace_mobile/common/graphql/graphql_service.dart';
import '../../../common/routes.dart';

class HomePage extends StatelessWidget {
  const HomePage({Key? key}) : super(key: key);
  // final LocalStorage localStorage = LocalStorage('trace');

  @override
  Widget build(BuildContext context) {
    // var loginData = localStorage.getItem('loginData');
    // var theme = Theme.of(context);
    // doInit();
    // var globalSettings = Provider.of<GlobalSettings>(context, listen: false);
    // bool isNextButtonDisabled = !globalSettings.isUserLoggedIn();
    return SafeArea(
        child: Material(
            color: Colors.grey[300],
            child: Padding(
              padding: const EdgeInsets.all(20),
              child: Column(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: <Widget>[
                    Text('Trace', style: Theme.of(context).textTheme.headline5),
                    Image.asset(
                      'assets/images/reports1.jpg',
                    ),
                    Row(
                        mainAxisAlignment: MainAxisAlignment.spaceBetween,
                        children: [
                          // Demo
                          ElevatedButton.icon(
                              onPressed: () {
                                // Navigator.pushNamed(context, 'login');
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
            )));
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

// class NextButton extends StatefulWidget {
//   const NextButton({Key? key}) : super(key: key);

//   @override
//   State<NextButton> createState() => _NextButtonState();
// }

// class _NextButtonState extends State<NextButton> {
//   bool isUserLoggedIn = false;
//   @override
//   void initState() {
//     super.initState();
//     var globalSettings = Provider.of<GlobalSettings>(context, listen: false);
//     globalSettings.loadLoginDataFromSecuredStorage().then((value) => {
//           // print('Async fired');
//           if (globalSettings.isUserLoggedIn())
//             {
//               setState(
//                 () {
//                   isUserLoggedIn = true;
//                 },
//               )
//             }
//         });
//   }

//   @override
//   Widget build(BuildContext context) {
//     return ElevatedButton.icon(
//         onPressed: isUserLoggedIn ? () {} : null,
//         icon: const Icon(Icons.next_plan),
//         label: const Text('Next'));
//   }
// }
