import 'package:adam1/main.dart';
import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../classes/counter.dart';

class ProviderCounter extends StatelessWidget {
  const ProviderCounter({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return (Scaffold(
      appBar: AppBar(
        title: const Text('Provider counter'),
      ),
      body: Padding(
          padding: const EdgeInsets.all(10.0),
          child: Builder(builder: (BuildContext context) {
            var pro = Provider.of<Counter>(
              context,
            );
            return Text('${pro.count}');
          })
          ),
      floatingActionButton: FloatingActionButton(
          onPressed: () {
            Provider.of<Counter>(context, listen: false).incrCounter();
          },
          child: const Icon(Icons.add)),
    ));
  }
}
