import 'package:english_words/english_words.dart';
import 'package:flutter/material.dart';
import './widgets/hello_custom_app_bar.dart';
import './widgets/dictionary-words.dart';

void main() {
  runApp(MaterialApp(
      home: SafeArea(
    top: false,
    child: Scaffold(

        body: HomePage()),
  )));
}

class HomePage extends StatelessWidget {
  const HomePage({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return Material(
        child: Scaffold(
      appBar: AppBar(
        title: Text('Home page'),
      ),
      drawer: Drawer(
        child: ListView( padding: EdgeInsets.zero,
          children: <Widget>[
            DrawerHeader(child: Text('Drawer header')),
            ListTile(title: Text('Item 1'),onTap: ()=>Navigator.pop(context),dense: true, ),
            ListTile(title: Text('Item 2'),onTap: ()=>Navigator.pop(context),dense: true,),
            ListTile(title: Text('Item 3'),onTap: ()=>Navigator.pop(context),dense: true,),
            ListTile(title: Text('Item 4'),onTap: ()=>Navigator.pop(context),dense: true,),
          ],
        ),
      ),
      body: Padding(
        padding: EdgeInsets.symmetric(horizontal: 10),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            ElevatedButton(
                style: ButtonStyle(
                    backgroundColor: MaterialStateProperty.all(Colors.yellow),
                    foregroundColor: MaterialStateProperty.all(Colors.indigo)),
                onPressed: () {
                  Navigator.push(
                      context,
                      MaterialPageRoute(
                          builder: (context) => const HelloWithCustomAppbar()));
                },
                child: Text('Example App Bar and hello')),
            ElevatedButton(
                onPressed: () {
                  Navigator.push(context,
                      MaterialPageRoute(builder: (context) => const MyApp()));
                },
                child: Text('Listview of words'))
          ],
        ),
      ),
    ));
  }
}
