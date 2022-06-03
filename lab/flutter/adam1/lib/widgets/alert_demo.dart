import 'package:flutter/material.dart';

class AlertDemo extends StatelessWidget {
  const AlertDemo({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return Scaffold(
        appBar: AppBar(title: const Text('Alert demo')),
        body: Center(
            child: TextButton(
                child: const Text('Alert box'),
                onPressed: () {
                  showAlert(context);
                })));
  }
}

showAlert(BuildContext context) {
  return showDialog(
    context: context,
    barrierDismissible: false,
    builder: (context) {
      return AlertDialog(
        title: const Text('Alert demo'),
        content: SingleChildScrollView(
          child: ListBody(
            children: const [Text('Are you sure')],
          ),
        ),
        actions: [
          TextButton(
              onPressed: () {
                Navigator.pop(context);
              },
              child: Text('No')),
          TextButton(
            onPressed: () {},
            child: Text('Yes'),
          )
        ],
      );
    },
  );
}


// class AlertDemo extends StatefulWidget {
//   const AlertDemo({Key? key}) : super(key: key);

//   @override
//   State<AlertDemo> createState() => _AlertDemoState();
// }

// class _AlertDemoState extends State<AlertDemo> {
//   @override
//   Widget build(BuildContext context) {
//     return Scaffold(
//         appBar: AppBar(title: const Text('Alert demo')),
//         body: Center(
//             child: TextButton(
//                 child: const Text('Alert box'),
//                 onPressed: () {
//                   showAlert(context);
//                 })));
//   }
// }
