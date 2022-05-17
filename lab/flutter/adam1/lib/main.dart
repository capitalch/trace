import 'package:english_words/english_words.dart';
import 'package:flutter/material.dart';

void main() {
  // runApp(const MyApp());
  runApp(const MaterialApp(
    home: SafeArea(
      child: HelloWithCustomAppbar(),
    ),
  ));
}

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
      child: Column(
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
              IconButton(
                  onPressed: () {
                  },
                  icon: Icon(Icons.add)),
              IconButton(onPressed: null, icon: Icon(Icons.account_box)),
              IconButton(onPressed: null, icon: Icon(Icons.account_box)),
              IconButton(onPressed: null, icon: Icon(Icons.account_box)),
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
          MyConstWidget(myName: 'This is a boy'),
          MyConstWidget(myName:'Kamal'),
          const MyStateful()
        ],
      ),
    );
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

class MyApp extends StatelessWidget {
  const MyApp({super.key});
  // const MyApp({Key? key}): super(key: key);

  @override
  Widget build(BuildContext context) {
    return (MaterialApp(
      title: 'My first',
      home: Scaffold(
          appBar: AppBar(
            title: const Text('My app bar'),
          ),
          body: const Center(
            child: RandomWords(),
          )),
    ));
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
    return
      Row(
        children:  [
          TextButton(
              onPressed: () {
                print('ac');
                setState(() {
                  counter = counter + 1;
                });
              }
          , child: const Text('My button')),
          Text('Counter: $counter')
        ],
      );
  }
}

class MyConstWidget extends StatelessWidget {
  const MyConstWidget({Key? key, this.myName}) : super(key: key);

  final String? myName;

  @override
  Widget build(BuildContext context) {
    return Text('$myName');
  }
}







class RandomWords extends StatefulWidget {
  const RandomWords({Key? key}) : super(key: key);

  @override
  State<RandomWords> createState() => _RandomWordsState();
}

class _RandomWordsState extends State<RandomWords> {
  final _suggestions = <WordPair>[];
  final _biggerFont = const TextStyle(fontSize: 18);

  @override
  Widget build(BuildContext context) {
    // final wordPair = WordPair.random();
    // return Text(wordPair.asCamelCase);

    return ListView.builder(
      padding: const EdgeInsets.all(16.0),
      itemBuilder: (context, i) {
        if (i.isOdd) {
          return const Divider(
            thickness: 2.0,
            color: Colors.indigo,
          );
        }
        final index = i ~/ 2;
        if (index >= _suggestions.length) {
          _suggestions.addAll(generateWordPairs().take(10));
        }
        return ListTile(
          title: Text(
            _suggestions[index].asPascalCase,
            style: _biggerFont,
          ),
          dense: true,
        );
      },
    );
  }
}
