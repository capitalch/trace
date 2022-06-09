import 'package:flutter/material.dart';

class ValueListenableBuilderCounter extends StatelessWidget {
  const ValueListenableBuilderCounter({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    ValueNotifier count = ValueNotifier(0);
    MyChangable myChangable = MyChangable();
    return Scaffold(
        appBar: AppBar(
          title: const Text('ValueListenableBuilder'),
        ),
        body: Column(
          children: [
            Padding(
              padding: const EdgeInsets.all(10),
              child: Row(children: [
                ValueListenableBuilder(
                    valueListenable: count,
                    builder: (context, value, child) {
                      return Text('$value');
                    }),
                const SizedBox(
                  width: 10.0,
                ),
                FloatingActionButton(
                  onPressed: () {
                    count.value = count.value + 1;
                  },
                  child: const Icon(Icons.add),
                ),
              ]),
            ),
            Padding(
              padding: const EdgeInsets.all(10),
              child: Row(children: [
                ValueListenableBuilder(
                    valueListenable: myChangable,
                    builder: (context, value, child) {
                      return Text('${myChangable.count}');
                    },
                    ),
                const SizedBox(
                  width: 10.0,
                ),
                ElevatedButton(
                  onPressed: () {
                    myChangable.incrementCount();
                  },
                  child: const Icon(Icons.add),
                ),
              ]),
            ),
          ],
        ));
  }
}

class MyChangable extends ValueNotifier {
  MyChangable() : super(null);
  int _count = 0;
  int get count {
    return _count;
  }

  void incrementCount() {
    _count = _count + 1;
    notifyListeners();
  }
}
