import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import './widgets/hello_custom_app_bar.dart';
import './widgets/dictionary-words.dart';
import './widgets/provider-counter.dart';
import './classes/counter.dart';
import './widgets/value-listenable-builder-counter.dart';

void main() {
  runApp(const MyRootApp());
}

class MyRootApp extends StatelessWidget {
  const MyRootApp({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return (ChangeNotifierProvider(
        create: (context) => Counter(),
        child: MaterialApp(home: MyHomePage(), theme: ThemeData(
          brightness: Brightness.values[1],
          primaryColor: Colors.yellow,
          fontFamily: 'Lato',
          textButtonTheme: TextButtonThemeData(style: ButtonStyle(foregroundColor: MaterialStateProperty.all(Colors.brown))),
          elevatedButtonTheme: ElevatedButtonThemeData(
            style: ButtonStyle(backgroundColor: MaterialStateProperty.all(Colors.indigo))
          )
        ),)));
  }
}

class MyHomePage extends StatelessWidget {
  const MyHomePage({Key? key}) : super(key: key);
  @override
  Widget build(BuildContext context) {
    return (ChangeNotifierProvider(
      create: (context) => Counter(),
      child:
          SafeArea(
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
                      // style: ButtonStyle(
                      //     backgroundColor: MaterialStateProperty.all(
                      //         Theme.of(context).backgroundColor),
                      //     foregroundColor: MaterialStateProperty.all(
                      //         Theme.of(context).colorScheme.primary)),
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
                  TextButton(onPressed: (){
                    Navigator.push(context, MaterialPageRoute(builder: (context)=>const ValueListenableBuilderCounter()));
                  }, child: const Text('ValueListenableBuilder as counter')),
                  // AnimatedContainer(duration: const Duration(seconds: 2), height: 30, width: 120, curve: Curves.easeIn,
                  // child: Material(
                  //   color: Colors.indigo,
                  //   child: InkWell(
                  //     // child: Text('This is InkWell'),
                  //   ),
                  // ),
                  // ),
                  // InkWell(
                  //   child: Text('This is Inkwell'),
                  //   onTap: (){},
                  // )
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
