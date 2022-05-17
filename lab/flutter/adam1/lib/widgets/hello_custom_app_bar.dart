import 'package:flutter/material.dart';

class HelloWithCustomAppbar extends StatelessWidget {
  const HelloWithCustomAppbar({Key? key}) : super(key: key);
  @override
  Widget build(BuildContext context) {
    return const MyScaffold();
  }
}

class MyScaffold extends StatelessWidget {
  const MyScaffold({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    String myName = '';
    return Material(
        child: Scaffold(
            appBar: AppBar(title: Text('Hello app bar')),
            body: Column(
              children: [
                const MyAppBar(),
                AppBar(
                  backgroundColor: Colors.cyan,
                  title: const Text('App bar'),
                  leading: const IconButton(
                    icon: Icon(Icons.ac_unit),
                    onPressed: null,
                  ),
                  actions: [
                    IconButton(onPressed: () {}, icon: Icon(Icons.add)),
                    IconButton(onPressed: null, icon: Icon(Icons.account_box)),
                    IconButton(onPressed: null, icon: Icon(Icons.account_box)),
                    IconButton(onPressed: null, icon: Icon(Icons.account_box)),
                  ],
                  centerTitle: true,
                ),
                const Expanded(
                    child: Center(
                  child: Text('Test'),
                )),
                const MyStateful()
              ],
            )));
  }
}

class MyAppBar extends StatelessWidget {
  const MyAppBar({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return Container(
      height: 56,
      color: Colors.amber[200],
      padding: const EdgeInsets.symmetric(horizontal: 8),
      // decoration: BoxDecoration(color: Colors.blue[300]),
      child: Row(
        children: const [
          IconButton(onPressed: null, icon: Icon(Icons.menu)),
          Expanded(
            child: Text('Trace'),
          ),
          IconButton(onPressed: null, icon: Icon(Icons.search))
        ],
      ),
    );
  }
}

class MyStateful extends StatefulWidget {
  const MyStateful({Key? key}) : super(key: key);

  @override
  State<MyStateful> createState() => _MyStatefulState();
}

class _MyStatefulState extends State<MyStateful> {
  int counter = 1;
  @override
  Widget build(BuildContext context) {
    return Row(
      children: [
        TextButton(
            onPressed: () {
              print('ac');
              setState(() {
                counter = counter + 1;
              });
            },
            child: const Text('My button')),
        Text('Counter: $counter')
      ],
    );
  }
}
