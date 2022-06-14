import 'package:flutter/material.dart';
import 'package:intl/intl.dart';

class DateTimeExamples extends StatelessWidget {
  const DateTimeExamples({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Date Time examples')),
      body: Center(
          child: ElevatedButton(
        child: Text('example 1'),
        onPressed: () {
          var date = DateTime.now();
          
          String isoDate = DateFormat('yyyy-MM-dd').format(date);
          print(isoDate);
        },
      )),
    );
  }
}
