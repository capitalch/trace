

import 'package:flutter/material.dart';

class AdamExpansionTile extends StatelessWidget {
  const AdamExpansionTile({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Expansion tile')),
      body: Column(children: [
        ExpansionTile(title: Text('Capital account'),
        // tilePadding: EdgeInsets.zero,
        childrenPadding: EdgeInsets.zero,
        maintainState: true,
        subtitle: 
              SingleChildScrollView(
                scrollDirection: Axis.horizontal,
                child: Row(
                mainAxisAlignment: MainAxisAlignment.spaceAround,
                children: [
                SizedBox(width: 100,child: Text('1,038,015.24'),),
                SizedBox(width: 100,child: Text('1,038,015.24'),),
                SizedBox(width: 100,child: Text('1,038,015.24'),),
                SizedBox(width: 100,child: Text('1,038,015.24'),)
              ]),),
        children: [
          ExpansionTile(title: Text('Capital account subgroup'),
          subtitle:
              SingleChildScrollView(
                scrollDirection: Axis.horizontal,
                child: Row(
                mainAxisAlignment: MainAxisAlignment.spaceAround,
                children: [
                SizedBox(width: 100,child: Text('1,038,015.24'),),
                SizedBox(width: 100,child: Text('1,038,015.24'),),
                SizedBox(width: 100,child: Text('1,038,015.24'),),
                SizedBox(width: 100,child: Text('1,038,015.24'),)
              ]),),
           children: [
            ListTile(title: Text('Capital'), subtitle: Container(
              width: double.maxFinite,
              child: 
              SingleChildScrollView(
                scrollDirection: Axis.horizontal,
                child: Row(
                mainAxisAlignment: MainAxisAlignment.spaceAround,
                children: [
                SizedBox(width: 100,child: Text('1,038,015.24'),),
                SizedBox(width: 100,child: Text('1,038,015.24'),),
                SizedBox(width: 100,child: Text('1,038,015.24'),),
                SizedBox(width: 100,child: Text('1,038,015.24'),)
              ]),)
              
            ),)
          ],),

ExpansionTile(title: Text('Capital account subgroup1'),
          subtitle:
              SingleChildScrollView(
                scrollDirection: Axis.horizontal,
                child: Row(
                mainAxisAlignment: MainAxisAlignment.spaceAround,
                children: [
                SizedBox(width: 100,child: Text('1,038,015.24'),),
                SizedBox(width: 100,child: Text('1,038,015.24'),),
                SizedBox(width: 100,child: Text('1,038,015.24'),),
                SizedBox(width: 100,child: Text('1,038,015.24'),)
              ]),),
           children: [
            ListTile(title: Text('Capital'), subtitle: Container(
              width: double.maxFinite,
              child: 
              SingleChildScrollView(
                scrollDirection: Axis.horizontal,
                child: Row(
                mainAxisAlignment: MainAxisAlignment.spaceAround,
                children: [
                SizedBox(width: 100,child: Text('1,038,015.24'),),
                SizedBox(width: 100,child: Text('1,038,015.24'),),
                SizedBox(width: 100,child: Text('1,038,015.24'),),
                SizedBox(width: 100,child: Text('1,038,015.24'),)
              ]),)
              
            ),)
          ],)

        ],)
      ]),
    );
  }
}
