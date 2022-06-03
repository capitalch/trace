import 'package:flutter/material.dart';

class DialogSelectDemo extends StatefulWidget {
  const DialogSelectDemo({Key? key}) : super(key: key);

  @override
  State<DialogSelectDemo> createState() => _DialogSelectDemoState();
}

class _DialogSelectDemoState extends State<DialogSelectDemo> {
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: Text('Dialog select')),
      body: Center(
          child: TextButton(
        child: Text('Show dialog'),
        onPressed: () {
          showSimpleDialog(context);
        },
      )),
    );
  }
}

showSimpleDialog(context) async {
  var result = await showDialog(
    context: context,
    builder: (context) {
      return SimpleDialog(
        title: Text('Select dialog'),
        children: [
          SimpleDialogOption(
            onPressed: () {
              Navigator.pop(context, 1);
            },
            child: Text('Option aa'),
          )
        ],
      );
    },
  );
  print(result);
}
