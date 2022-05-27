import 'package:flutter/material.dart';
import 'package:graphql_flutter/graphql_flutter.dart';
import 'package:provider/provider.dart';
import 'package:trace_mobile/common/global_settings.dart';
import '../../../common/routes.dart';

class HomePage extends StatelessWidget {
  const HomePage({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    var theme = Theme.of(context);
    doLogin() {
      Navigator.pushNamed(context, 'login');
    }

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
                        ElevatedButton.icon(
                            onPressed: () {
                              var globalSettings = Provider.of<GlobalSettings>(context, listen:false);

                              // var token1 = globalSettings.getValue(propName: 'token');
                              print(globalSettings.token);
                            },
                            icon: const Icon(Icons.next_plan),
                            label: const Text('Next')),
                      ],
                    ),
                  ]),
            )));
  }
}
