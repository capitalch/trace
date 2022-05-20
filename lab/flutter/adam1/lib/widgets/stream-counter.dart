import 'package:flutter/material.dart';
import 'dart:async';
import '../classes/global-stream.dart';

class StreamCounter extends StatelessWidget {
  const StreamCounter({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    // int count = 0;
    StreamController<String> streamController =
        GlobalStream.globalStreamController;
    MyChangable myChangable = MyChangable();
    return Scaffold(
        appBar: AppBar(
          title: const Text('Stream counter'),
        ),
        body: Column(
          children: [
            Padding(
              padding: const EdgeInsets.all(10),
              child: Row(children: [
                  ValueListenableBuilder(
                  valueListenable: myChangable,
                  builder: (context, value, child) {
                    return (Text('${myChangable.count}'));
                  }),
                SizedBox(
                  width: 10.0,
                ),
                FloatingActionButton(
                  onPressed: () {
                    streamController.add('1');
                  },
                  child: const Icon(Icons.add),
                ),
              ]),
            ),
          ],
        ),
      bottomNavigationBar: BottomNavigationBar(
        onTap: (_){
          print('abc');
        },
          type: BottomNavigationBarType.fixed,
        elevation: 10.0,
        items:[
          BottomNavigationBarItem(icon: Icon(Icons.search), label: 'Search',),
          BottomNavigationBarItem(icon: Icon(Icons.search), label: 'Search'),
          BottomNavigationBarItem(icon: Icon(Icons.search), label: 'Search'),
          BottomNavigationBarItem(icon: Icon(Icons.search), label: 'Search'),
          BottomNavigationBarItem(icon: Icon(Icons.search), label: 'Search'),
          BottomNavigationBarItem(icon: Icon(Icons.search), label: 'Search'),
          BottomNavigationBarItem(icon: Icon(Icons.search), label: 'Search'),
          BottomNavigationBarItem(icon: Icon(Icons.search), label: 'Search')
        ]
      ),
    );
  
  }
}

class MyChangable extends ValueNotifier {
  MyChangable() : super(null) {
    StreamController<String> streamController =
        GlobalStream.globalStreamController;
    streamController.stream.listen((event) {
      _count = _count + 1;
      notifyListeners();
    });
  }
  int _count = 0;
  int get count {
    return _count;
  }
}
