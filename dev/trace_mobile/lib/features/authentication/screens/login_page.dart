import 'package:flutter/material.dart';
import 'package:flutter_secure_storage/flutter_secure_storage.dart';
import 'package:graphql_flutter/graphql_flutter.dart';
// import 'package:localstorage/localstorage.dart';
import 'package:provider/provider.dart';
import 'package:trace_mobile/common/data_store.dart';
import 'package:trace_mobile/common/global_settings.dart';
import 'package:trace_mobile/common/graphql/graphql_queries.dart';
import 'package:trace_mobile/common/graphql/graphql_service.dart';
import 'dart:convert' show utf8, base64;
import 'dart:convert';

import 'package:trace_mobile/common/routes.dart';

class LoginPage extends StatelessWidget {
  LoginPage({Key? key}) : super(key: key);
  // final LocalStorage localStorage = LocalStorage('trace');

  @override
  Widget build(BuildContext context) {
    TextEditingController nameController = TextEditingController();
    TextEditingController passwordController = TextEditingController();

    return SafeArea(
      child: Scaffold(
        backgroundColor: Theme.of(context).backgroundColor,
        // appBar: AppBar(title: Text('Trace login'),),
        body: Padding(
          padding: const EdgeInsets.all(20.0),
          child: ListView(children: <Widget>[
            Container(
                alignment: Alignment.center,
                child: Text(
                  'Trace',
                  style: Theme.of(context).textTheme.headline4,
                )),
            Container(
              alignment: Alignment.center,
              padding: const EdgeInsets.only(top: 40),
              child: Text(
                'Login',
                style: Theme.of(context).textTheme.headline5,
              ),
            ),
            Container(
                alignment: Alignment.center,
                padding: const EdgeInsets.only(top: 20),
                child: TextField(
                    controller: nameController,
                    decoration: const InputDecoration(
                        border: OutlineInputBorder(), labelText: 'User name'),
                    style: const TextStyle(fontSize: 22))),
            Container(
                alignment: Alignment.center,
                padding: const EdgeInsets.only(top: 20),
                child: TextField(
                    obscureText: true,
                    controller: passwordController,
                    decoration: const InputDecoration(
                        border: OutlineInputBorder(), labelText: 'Password'),
                    style: const TextStyle(fontSize: 22))),
            Container(
                height: 60,
                // padding: const EdgeInsets.only(top: 40),
                margin: const EdgeInsets.only(top: 50),
                child: ElevatedButton(
                    child: const Text('Login'),
                    onPressed: () => onLoginPressed(
                        context, nameController, passwordController))),
          ]),
        ),
      ),
    );
  }

  void onLoginPressed(context, nameController, passwordController) async {
    var service = Provider.of<GraphQLService>(context, listen: false);
    var creds = [nameController.value.text, ':', passwordController.value.text];
    var credentials = base64.encode(utf8.encode(creds.join()));
    var result = await service.client
        .query(QueryOptions(document: gql(GraphQLQueries.login(credentials))));
    var loginData = result?.data?['authentication']['doLogin'];
    var globalSettings = Provider.of<GlobalSettings>(context,
        listen: false); // global variable from provider

    if (loginData == null) {
      globalSettings.resetLoginData();
      showSnackBar(context);
      // Navigator.pop(context);
      return;
    }

    List<dynamic>? buCodesWithPermissionsTemp =
        loginData['buCodesWithPermissions'];
    List<Map<String, dynamic>>? buCodesWithPermissions =
        buCodesWithPermissionsTemp?.cast<Map<String, dynamic>>().toList();
    Iterable? bues = buCodesWithPermissions?.map((e) => e['buCode']);
    List<String>? buCodes = bues?.cast<String>()?.toList();
    loginData['buCodes'] = buCodes;
    loginData['buCodesWithPermissions'] = buCodesWithPermissions;
    // localStorage.setItem('loginData', loginData);
    globalSettings.setLoginData(loginData);
    await DataStore.setLoginData('test');
    Navigator.pushReplacementNamed(context, Routes.dashBoard);
  }

  void showSnackBar(context) {
    final snackBar = SnackBar(
      content: const Text('Invalid login'),
      backgroundColor: Theme.of(context).errorColor,
      duration: const Duration(seconds: 5),
      action: SnackBarAction(
        label: 'dismiss',
        onPressed: () {
          Navigator.pop(context);
        },
      ),
    );
    ScaffoldMessenger.of(context).showSnackBar(snackBar);
  }
}
