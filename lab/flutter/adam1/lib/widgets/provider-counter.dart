import 'package:adam1/main.dart';
import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../classes/counter.dart';

class ProviderCounter extends StatelessWidget {
  const ProviderCounter({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    int counter = 0;
    return (Column(
      children: [
        Padding(
          padding: const EdgeInsets.all(10.0),
          child: Text('Counter is: $counter'),
        ),
        FloatingActionButton(
            onPressed: () {
              Provider.of<Counter>(context, listen: false).incrCounter();
            },
            child: const Icon(Icons.add))
      ],
    ));
  }
}
