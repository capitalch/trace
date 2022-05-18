import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import './widgets/hello_custom_app_bar.dart';
import './widgets/dictionary-words.dart';
import './widgets/provider-counter.dart';
import './classes/counter.dart';

void main() {
  runApp(
    const MaterialApp(
      home: SafeArea(top: false, child: HomePage()),
    ),
  );
}

class HomePage extends StatelessWidget {
  const HomePage({Key? key}) : super(key: key);
  @override
  Widget build(BuildContext context) {
    return (
        // MultiProvider(
        // providers: [
        ChangeNotifierProvider(
      create: (context) => Counter(),
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
                    style: ButtonStyle(
                        backgroundColor: MaterialStateProperty.all(
                            Theme.of(context).backgroundColor),
                        foregroundColor: MaterialStateProperty.all(
                            Theme.of(context).colorScheme.primary)),
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
                const ProviderCounter()
              ],
            ),
          ),
        ),
      ),
    ));
  }
}
