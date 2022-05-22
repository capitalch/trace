import 'package:flutter/material.dart';

class LoginPage extends StatelessWidget {
  const LoginPage({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return
      SafeArea(
        child: Material(
      child: Center(
        child: Column(
          children: [
            Text('User name')
            // TextField()
          ],
        ),
      ),
    ));
  }
}
