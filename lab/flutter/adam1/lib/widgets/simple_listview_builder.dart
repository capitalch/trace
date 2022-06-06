import 'package:flutter/material.dart';

class SimpleListviewBuilder extends StatelessWidget {
  const SimpleListviewBuilder({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Simple List view builder')),
      body: ListView.builder(
        shrinkWrap: true,
        itemCount: 10,
        itemBuilder: (context, index) {
          return ListTile(
            dense: true,
            leading: const Icon(
              Icons.fork_right,
              color: Colors.indigo,
            ),
            title: Text('Item number $index'),
          );
        },
      ),
    );
  }
}
