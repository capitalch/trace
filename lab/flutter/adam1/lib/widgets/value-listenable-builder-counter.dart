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
                      return Text('${value}');
                    }),
                const SizedBox(
                  width: 10.0,
                ),
                ElevatedButton(
                  onPressed: () {
                    myChangable.count = myChangable.count + 1;
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
  int count = 0;
}

// ValueListenableBuilder(
//     valueListenable: count,
//     builder: (context, value, child) {
//       return Text('$value');
//     }),
// const SizedBox(width: 10.0,),
// FloatingActionButton(
//   onPressed: () {
//     count.value = count.value + 1;
//   },
//   child: const Icon(Icons.add),
// ),
