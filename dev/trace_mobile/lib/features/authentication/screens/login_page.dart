import 'package:flutter/material.dart';

class LoginPage extends StatelessWidget {
  const LoginPage({Key? key}) : super(key: key);

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
              padding: EdgeInsets.only(top: 40),
              child: Text('Login', style: Theme.of(context).textTheme.headline5,),
            ),
            Container(
              alignment: Alignment.center,
              padding: EdgeInsets.only(top: 20),
              child: TextField(
                controller: nameController,
                decoration: InputDecoration(border: OutlineInputBorder(), labelText: 'User name'),
                style: TextStyle(fontSize: 22)
              )
            ),
            Container(
                alignment: Alignment.center,
                padding: EdgeInsets.only(top: 20),
                child: TextField(
                    obscureText: true,
                    controller: passwordController,
                    decoration: InputDecoration(border: OutlineInputBorder(), labelText: 'Password'),
                    style: TextStyle(fontSize: 22)
                )
            ),
            Container(
                height: 50,
                // padding: const EdgeInsets.only(top: 40),
                margin: EdgeInsets.only(top:30),
                child: ElevatedButton(
                  child: const Text('Login'),
                  onPressed: () {
                    print(nameController.text);
                    print(passwordController.text);
                  },
                )
            ),
          ]),
        ),
      ),
    );
  }
}
