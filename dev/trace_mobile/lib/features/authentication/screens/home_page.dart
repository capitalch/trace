import 'package:flutter/material.dart';

class HomePage extends StatelessWidget {
  const HomePage({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    var theme = Theme.of(context);
    doLogin(){
      Navigator.pushNamed(context, 'login');
    }
    return SafeArea(
        child: Material(
            child: Padding(
      padding: EdgeInsets.all(20),
      child: Column(children: <Widget>[
        SizedBox(height: 10.0),
        Text('Trace', style: TextStyle(color:Colors.indigo, fontWeight: FontWeight.w700, fontSize: 25) ),
        SizedBox(height: 150.0),
        Image.asset('assets/images/reports1.jpg',),
        // Image.asset('assets/images/accounts1.png',),
        SizedBox(height: 160.0),
        Row(
          mainAxisAlignment: MainAxisAlignment.spaceBetween,
          children: [
            ElevatedButton.icon(onPressed: (){Navigator.pushNamed(context, 'login');}, icon: const Icon(Icons.account_tree), label: const Text('Demo')),
            ElevatedButton.icon(onPressed: (){}, icon: const Icon(Icons.login), label: const Text('Login')),
            ElevatedButton.icon(onPressed: (){}, icon: const Icon(Icons.next_plan), label: const Text('Next')),
          ],
        )
      ]),
    )));
  }
}
