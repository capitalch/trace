import 'package:adam1/classes/ibuki.dart';
import 'package:flutter/material.dart';

class IbukiImplement extends StatefulWidget {
  const IbukiImplement({Key? key}) : super(key: key);

  @override
  State<IbukiImplement> createState() => _IbukiImplementState();
}

class _IbukiImplementState extends State<IbukiImplement> {
  dynamic subs;

  @override
  void initState() {
    super.initState();
    subs = Ibuki.debounceFilterOn('TEST').listen((d) {
      print(d['data']);
    });
  }

  @override
  void dispose() {
    subs.cancel();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    TextEditingController textController = TextEditingController();
  
    return Scaffold(
        appBar: AppBar(title: const Text('Ibuki implement')),
        body: Column(
          children: [
            Container(
              padding: EdgeInsets.symmetric(horizontal: 15),
              child: Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  ElevatedButton(
                      onPressed: () {
                        Ibuki.debounceEmit('TEST', {'name': 'Sushant'});
                        // Ibuki.debounceEmit('TEST', {'name1': 'Sushant'});
                        // Ibuki.debounceEmit('TEST', {'name2': 'Sushant'});
                      },
                      child: const Text('Ibuki implement')),
                  SizedBox(
                    width: 150,
                    child: TextField(
                      controller: textController,
                      onChanged: (value) {
                        print(value);
                      },
                    ),
                  )
                ],
              ),
            ),
            Row(
              children:[
                InkWell(
                  child: Chip(label: Text('Nikon ')),
                  onTap: () {
                    textController.value = TextEditingValue(
      text: 'Nikon ',
      selection: TextSelection.fromPosition(
        TextPosition(offset: 'Nikon '.length),
      ),
    );
                  },
                )
              ]
               
            )
          ],
        ));
  }
}
