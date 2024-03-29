import 'package:adam1/widgets/adam_expansion_tile.dart';
import 'package:adam1/widgets/alert_demo.dart';
import 'package:adam1/widgets/date_time_examples.dart';
import 'package:adam1/widgets/dialog_select_demo.dart';
import 'package:adam1/widgets/ibuki_implement.dart';
import 'package:adam1/widgets/infinite_scroll.dart';
import 'package:adam1/widgets/simple_listview_builder.dart';
import 'package:adam1/widgets/simple_tree_view.dart';
import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import './widgets/hello_custom_app_bar.dart';
import './widgets/dictionary-words.dart';
import './widgets/provider-counter.dart';
import './classes/counter.dart';
import './widgets/value-listenable-builder-counter.dart';
import './widgets/graphql.dart';

void main() {
  runApp(const MyRootApp());
}

class MyRootApp extends StatelessWidget {
  const MyRootApp({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return (MultiProvider(
      providers: [
        ChangeNotifierProvider(create: (context) => Counter()),
      ],
      child: MaterialApp(
        home: const MyHomePage(),
        theme: ThemeData(
            brightness: Brightness.values[1],
            primaryColor: Colors.yellow,
            fontFamily: 'Lato',
            textButtonTheme: TextButtonThemeData(
                style: ButtonStyle(
                    foregroundColor: MaterialStateProperty.all(Colors.brown))),
            elevatedButtonTheme: ElevatedButtonThemeData(
                style: ButtonStyle(
                    backgroundColor:
                        MaterialStateProperty.all(Colors.indigo)))),
      ),
    ));
  }
}

class MyHomePage extends StatelessWidget {
  const MyHomePage({Key? key}) : super(key: key);
  @override
  Widget build(BuildContext context) {
    return (ChangeNotifierProvider(
      create: (context) => Counter(),
      child: SafeArea(
        child: Material(
          child: Scaffold(
            appBar: AppBar(
              title: const Text('Home page'),
            ),
            drawer: Drawer(
              child: ListView(
                padding: EdgeInsets.zero,
                children: <Widget>[
                  const DrawerHeader(child: Text('Drawer header')),
                  ListTile(
                    title: const Text('Item 1'),
                    onTap: () => Navigator.pop(context),
                    dense: true,
                  ),
                  ListTile(
                    title: const Text('Item 2'),
                    onTap: () => Navigator.pop(context),
                    dense: true,
                  ),
                  ListTile(
                    title: const Text('Item 3'),
                    onTap: () => Navigator.pop(context),
                    dense: true,
                  ),
                  ListTile(
                    title: const Text('Item 4'),
                    onTap: () => Navigator.pop(context),
                    dense: true,
                  ),
                ],
              ),
            ),
            body: Padding(
              padding: const EdgeInsets.symmetric(horizontal: 10),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  ElevatedButton(
                      onPressed: () {
                        Navigator.push(
                            context,
                            MaterialPageRoute(
                                builder: (context) =>
                                    const HelloWithCustomAppbar()));
                      },
                      child: const Text('Example App Bar and hello')),
                  ElevatedButton(
                      onPressed: () {
                        Navigator.push(
                            context,
                            MaterialPageRoute(
                                builder: (context) => const MyApp()));
                      },
                      child: const Text('Listview of words')),
                  TextButton(
                      onPressed: () {
                        Navigator.push(
                            context,
                            MaterialPageRoute(
                                builder: (context) => const ProviderCounter()));
                      },
                      child: const Text('Sample provider pattern as counter')),
                  TextButton(
                      onPressed: () {
                        Navigator.push(
                            context,
                            MaterialPageRoute(
                                builder: (context) =>
                                    const ValueListenableBuilderCounter()));
                      },
                      child: const Text('ValueListenableBuilder as counter')),
                  TextButton(
                      onPressed: () {
                        Navigator.push(
                            context,
                            MaterialPageRoute(
                                builder: (context) => const GraphQL()));
                      },
                      child: const Text('GraphQL')),
                  TextButton(onPressed: () {
                    Navigator.push(
                            context,
                            MaterialPageRoute(
                                builder: (context) => const AlertDemo()));
                  }, child: const Text('Alert box')),
                  TextButton(onPressed: () {
                    Navigator.push(
                            context,
                            MaterialPageRoute(
                                builder: (context) => const DialogSelectDemo()));
                  }, child: const Text('Dialog select box')),
                  TextButton(onPressed: () {
                    Navigator.push(
                            context,
                            MaterialPageRoute(
                                builder: (context) => const InfiniteScroll()));
                  }, child: const Text('Infinite scroll SingleChildScrollview')),
                  TextButton(onPressed: () {
                    Navigator.push(
                            context,
                            MaterialPageRoute(
                                builder: (context) => const SimpleListviewBuilder()));
                  }, child: const Text('Simple ListView builder')),
                  TextButton(onPressed: (){
                    Navigator.push(
                        context,
                        MaterialPageRoute(
                            builder: (context) => const IbukiImplement()));
                  }, child: const Text('Ibuki')),
                  TextButton(onPressed: (){
                    Navigator.push(
                        context,
                        MaterialPageRoute(
                            builder: (context) => const DateTimeExamples()));
                  }, child: const Text('Date time')),
                  TextButton(onPressed: (){
                    Navigator.push(
                        context,
                        MaterialPageRoute(
                            builder: (context) => const SimpleTreeView()));
                  }, child: const Text('Simple tree view')),
                  TextButton(onPressed: (){
                    Navigator.push(
                        context,
                        MaterialPageRoute(
                            builder: (context) => const AdamExpansionTile()));
                  }, child: const Text('Expansion tile'))
                ],
              ),
            ),
          ),
        ),
      ),
      // )
    ));
  }
}
