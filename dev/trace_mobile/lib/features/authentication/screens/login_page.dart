import 'package:flutter/material.dart';
import 'package:graphql_flutter/graphql_flutter.dart';
import 'package:provider/provider.dart';
import 'package:trace_mobile/common/graphql_service.dart';
import 'dart:convert' show utf8, base64;
import 'dart:convert';

class LoginPage extends StatelessWidget {
  const LoginPage({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    TextEditingController nameController = TextEditingController();
    TextEditingController passwordController = TextEditingController();
    final HttpLink httpLink = HttpLink(
      'http://10.0.2.2:5000/graphql',
    );

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
              padding: EdgeInsets.only(top: 40),
              child: Text(
                'Login',
                style: Theme.of(context).textTheme.headline5,
              ),
            ),
            Container(
                alignment: Alignment.center,
                padding: EdgeInsets.only(top: 20),
                child: TextField(
                    controller: nameController,
                    decoration: InputDecoration(
                        border: OutlineInputBorder(), labelText: 'User name'),
                    style: TextStyle(fontSize: 22))),
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
                  onPressed: () async {
                    var service =
                        Provider.of<TraceGraphQLClient>(context, listen: false);
                    var creds = [
                      nameController.value.text,
                      ':',
                      passwordController.value.text
                    ];
                    var credentials =
                        base64.encode(utf8.encode(creds.join()));
                    // AuthLink authLink = AuthLink(headerKey: '')
                    // String login = '''query login {
                    //  authentication {
                    //  doLogin(credentials:"$base54Cred")
                    // }}''';
                    var result = await service.client
                        .query(QueryOptions(document: gql(GraphQLQuery.login(credentials))));
                    var login = result?.data?['authentication']['doLogin'];
                    String? token = login?['token'];
                    Object? buCodesWithPermissions = login?['buCodesWithPermissions'];
                    // var login = entries?.elementAt(1);
                    if(result.data != null){
                      print(result.data);
                    } else {
                      print('Error');
                    }
                  },
                )),
            // Query(
            //     options: QueryOptions(
            //       document: gql(query),
            //     ),
            //     builder: (QueryResult result, {fetchMore, refetch}) {
            //       if (result.data == null) {
            //         return const Center(child: Text('Loading...'));
            //       } else {
            //         return const Text('Success');
            //       }
            //     })
          ]),
        ),
      ),
    );
  }
}
