import 'package:flutter/material.dart';

class InfiniteScroll extends StatelessWidget {
  const InfiniteScroll({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return Scaffold(
        appBar: AppBar(
            title: SizedBox(
          width: double.infinity,
          child: SingleChildScrollView(
            scrollDirection: Axis.horizontal,
            child: Row(children: [
              ElevatedButton(onPressed: () {}, child: const Text('Button 1')),
              ElevatedButton(onPressed: () {}, child: const Text('Button 2')),
              ElevatedButton(onPressed: () {}, child: const Text('Button 3')),
              ElevatedButton(onPressed: () {}, child: const Text('Button 4')),
              ElevatedButton(onPressed: () {}, child: const Text('Button 5')),
              ElevatedButton(onPressed: () {}, child: const Text('Button 6')),
              ElevatedButton(onPressed: () {}, child: const Text('Button 7')),
              ElevatedButton(onPressed: () {}, child: const Text('Button 8')),
            ]),
          ),
        )),
        body: SizedBox(
            height: double.infinity,
            width: double.infinity,
            child: SingleChildScrollView(
              scrollDirection: Axis.vertical,
              child: Column(children: [
                SingleChildScrollView(
                  scrollDirection: Axis.horizontal,
                  child: Row(children: const [
                    Card(
                      elevation: 5,
                      child: Text('This is card 00'),
                    ),
                    Card(
                      elevation: 5,
                      child: Text('This is card 01'),
                    ),
                    Card(
                      elevation: 5,
                      child: Text('This is card 02'),
                    ),
                    Card(
                      elevation: 5,
                      child: Text('This is card 03'),
                    ),
                    Card(
                      elevation: 5,
                      child: Text('This is card 04'),
                    ),
                    Card(
                      elevation: 5,
                      child: Text('This is card 05'),
                    ),
                  ]),
                ),
                SingleChildScrollView(scrollDirection: Axis.horizontal, child: Row(children: const [
        Card(elevation: 5, child: Text('This is card 10'),),
        Card(elevation: 5, child: Text('This is card 11'),),
        Card(elevation: 5, child: Text('This is card 12'),),
        Card(elevation: 5, child: Text('This is card 13'),),
        Card(elevation: 5, child: Text('This is card 14'),),
        Card(elevation: 5, child: Text('This is card 15'),),
      ]),),
      SingleChildScrollView(scrollDirection: Axis.horizontal, child: Row(children: const [
        Card(elevation: 5, child: Text('This is card 00'),),
        Card(elevation: 5, child: Text('This is card 01'),),
        Card(elevation: 5, child: Text('This is card 02'),),
        Card(elevation: 5, child: Text('This is card 03'),),
        Card(elevation: 5, child: Text('This is card 04'),),
        Card(elevation: 5, child: Text('This is card 05'),),
      ]),),
      SingleChildScrollView(scrollDirection: Axis.horizontal, child: Row(children: const [
        Card(elevation: 5, child: Text('This is card 00'),),
        Card(elevation: 5, child: Text('This is card 01'),),
        Card(elevation: 5, child: Text('This is card 02'),),
        Card(elevation: 5, child: Text('This is card 03'),),
        Card(elevation: 5, child: Text('This is card 04'),),
        Card(elevation: 5, child: Text('This is card 05'),),
      ]),),
      SingleChildScrollView(scrollDirection: Axis.horizontal, child: Row(children: const [
        Card(elevation: 5, child: Text('This is card 00'),),
        Card(elevation: 5, child: Text('This is card 01'),),
        Card(elevation: 5, child: Text('This is card 02'),),
        Card(elevation: 5, child: Text('This is card 03'),),
        Card(elevation: 5, child: Text('This is card 04'),),
        Card(elevation: 5, child: Text('This is card 05'),),
      ]),),
      SingleChildScrollView(scrollDirection: Axis.horizontal, child: Row(children: const [
        Card(elevation: 5, child: Text('This is card 00'),),
        Card(elevation: 5, child: Text('This is card 01'),),
        Card(elevation: 5, child: Text('This is card 02'),),
        Card(elevation: 5, child: Text('This is card 03'),),
        Card(elevation: 5, child: Text('This is card 04'),),
        Card(elevation: 5, child: Text('This is card 05'),),
      ]),),
      SingleChildScrollView(scrollDirection: Axis.horizontal, child: Row(children: const [
        Card(elevation: 5, child: Text('This is card 00'),),
        Card(elevation: 5, child: Text('This is card 01'),),
        Card(elevation: 5, child: Text('This is card 02'),),
        Card(elevation: 5, child: Text('This is card 03'),),
        Card(elevation: 5, child: Text('This is card 04'),),
        Card(elevation: 5, child: Text('This is card 05'),),
      ]),),
      SingleChildScrollView(scrollDirection: Axis.horizontal, child: Row(children: const [
        Card(elevation: 5, child: Text('This is card 00'),),
        Card(elevation: 5, child: Text('This is card 01'),),
        Card(elevation: 5, child: Text('This is card 02'),),
        Card(elevation: 5, child: Text('This is card 03'),),
        Card(elevation: 5, child: Text('This is card 04'),),
        Card(elevation: 5, child: Text('This is card 05'),),
      ]),),
      SingleChildScrollView(scrollDirection: Axis.horizontal, child: Row(children: const [
        Card(elevation: 5, child: Text('This is card 00'),),
        Card(elevation: 5, child: Text('This is card 01'),),
        Card(elevation: 5, child: Text('This is card 02'),),
        Card(elevation: 5, child: Text('This is card 03'),),
        Card(elevation: 5, child: Text('This is card 04'),),
        Card(elevation: 5, child: Text('This is card 05'),),
      ]),),
      SingleChildScrollView(scrollDirection: Axis.horizontal, child: Row(children: const [
        Card(elevation: 5, child: Text('This is card 00'),),
        Card(elevation: 5, child: Text('This is card 01'),),
        Card(elevation: 5, child: Text('This is card 02'),),
        Card(elevation: 5, child: Text('This is card 03'),),
        Card(elevation: 5, child: Text('This is card 04'),),
        Card(elevation: 5, child: Text('This is card 05'),),
      ]),),
      SingleChildScrollView(scrollDirection: Axis.horizontal, child: Row(children: const [
        Card(elevation: 5, child: Text('This is card 00'),),
        Card(elevation: 5, child: Text('This is card 01'),),
        Card(elevation: 5, child: Text('This is card 02'),),
        Card(elevation: 5, child: Text('This is card 03'),),
        Card(elevation: 5, child: Text('This is card 04'),),
        Card(elevation: 5, child: Text('This is card 05'),),
      ]),),
      SingleChildScrollView(scrollDirection: Axis.horizontal, child: Row(children: const [
        Card(elevation: 5, child: Text('This is card 00'),),
        Card(elevation: 5, child: Text('This is card 01'),),
        Card(elevation: 5, child: Text('This is card 02'),),
        Card(elevation: 5, child: Text('This is card 03'),),
        Card(elevation: 5, child: Text('This is card 04'),),
        Card(elevation: 5, child: Text('This is card 05'),),
      ]),),

      SingleChildScrollView(scrollDirection: Axis.horizontal, child: Row(children: const [
        Card(elevation: 5, child: Text('This is card 00'),),
        Card(elevation: 5, child: Text('This is card 01'),),
        Card(elevation: 5, child: Text('This is card 02'),),
        Card(elevation: 5, child: Text('This is card 03'),),
        Card(elevation: 5, child: Text('This is card 04'),),
        Card(elevation: 5, child: Text('This is card 05'),),
      ]),),
      SingleChildScrollView(scrollDirection: Axis.horizontal, child: Row(children: const [
        Card(elevation: 5, child: Text('This is card 00'),),
        Card(elevation: 5, child: Text('This is card 01'),),
        Card(elevation: 5, child: Text('This is card 02'),),
        Card(elevation: 5, child: Text('This is card 03'),),
        Card(elevation: 5, child: Text('This is card 04'),),
        Card(elevation: 5, child: Text('This is card 05'),),
      ]),),
      SingleChildScrollView(scrollDirection: Axis.horizontal, child: Row(children: const [
        Card(elevation: 5, child: Text('This is card 00'),),
        Card(elevation: 5, child: Text('This is card 01'),),
        Card(elevation: 5, child: Text('This is card 02'),),
        Card(elevation: 5, child: Text('This is card 03'),),
        Card(elevation: 5, child: Text('This is card 04'),),
        Card(elevation: 5, child: Text('This is card 05'),),
      ]),),
      SingleChildScrollView(scrollDirection: Axis.horizontal, child: Row(children: const [
        Card(elevation: 5, child: Text('This is card 00'),),
        Card(elevation: 5, child: Text('This is card 01'),),
        Card(elevation: 5, child: Text('This is card 02'),),
        Card(elevation: 5, child: Text('This is card 03'),),
        Card(elevation: 5, child: Text('This is card 04'),),
        Card(elevation: 5, child: Text('This is card 05'),),
      ]),),
      SingleChildScrollView(scrollDirection: Axis.horizontal, child: Row(children: const [
        Card(elevation: 5, child: Text('This is card 00'),),
        Card(elevation: 5, child: Text('This is card 01'),),
        Card(elevation: 5, child: Text('This is card 02'),),
        Card(elevation: 5, child: Text('This is card 03'),),
        Card(elevation: 5, child: Text('This is card 04'),),
        Card(elevation: 5, child: Text('This is card 05'),),
      ]),),
      SingleChildScrollView(scrollDirection: Axis.horizontal, child: Row(children: const [
        Card(elevation: 5, child: Text('This is card 00'),),
        Card(elevation: 5, child: Text('This is card 01'),),
        Card(elevation: 5, child: Text('This is card 02'),),
        Card(elevation: 5, child: Text('This is card 03'),),
        Card(elevation: 5, child: Text('This is card 04'),),
        Card(elevation: 5, child: Text('This is card 05'),),
      ]),),
      SingleChildScrollView(scrollDirection: Axis.horizontal, child: Row(children: const [
        Card(elevation: 5, child: Text('This is card 00'),),
        Card(elevation: 5, child: Text('This is card 01'),),
        Card(elevation: 5, child: Text('This is card 02'),),
        Card(elevation: 5, child: Text('This is card 03'),),
        Card(elevation: 5, child: Text('This is card 04'),),
        Card(elevation: 5, child: Text('This is card 05'),),

      ]),),

      SingleChildScrollView(scrollDirection: Axis.horizontal, child: Row(children: const [
        Card(elevation: 5, child: Text('This is card 00'),),
        Card(elevation: 5, child: Text('This is card 01'),),
        Card(elevation: 5, child: Text('This is card 02'),),
        Card(elevation: 5, child: Text('This is card 03'),),
        Card(elevation: 5, child: Text('This is card 04'),),
        Card(elevation: 5, child: Text('This is card 05'),),
      ]),),
      SingleChildScrollView(scrollDirection: Axis.horizontal, child: Row(children: const [
        Card(elevation: 5, child: Text('This is card 00'),),
        Card(elevation: 5, child: Text('This is card 01'),),
        Card(elevation: 5, child: Text('This is card 02'),),
        Card(elevation: 5, child: Text('This is card 03'),),
        Card(elevation: 5, child: Text('This is card 04'),),
        Card(elevation: 5, child: Text('This is card 05'),),
      ]),),
      SingleChildScrollView(scrollDirection: Axis.horizontal, child: Row(children: const [
        Card(elevation: 5, child: Text('This is card 00'),),
        Card(elevation: 5, child: Text('This is card 01'),),
        Card(elevation: 5, child: Text('This is card 02'),),
        Card(elevation: 5, child: Text('This is card 03'),),
        Card(elevation: 5, child: Text('This is card 04'),),
        Card(elevation: 5, child: Text('This is card 05'),),
        
      ]),),

      SingleChildScrollView(scrollDirection: Axis.horizontal, child: Row(children: const [
        Card(elevation: 5, child: Text('This is card 00'),),
        Card(elevation: 5, child: Text('This is card 01'),),
        Card(elevation: 5, child: Text('This is card 02'),),
        Card(elevation: 5, child: Text('This is card 03'),),
        Card(elevation: 5, child: Text('This is card 04'),),
        Card(elevation: 5, child: Text('This is card 05'),),
      ]),),
      SingleChildScrollView(scrollDirection: Axis.horizontal, child: Row(children: const [
        Card(elevation: 5, child: Text('This is card 00'),),
        Card(elevation: 5, child: Text('This is card 01'),),
        Card(elevation: 5, child: Text('This is card 02'),),
        Card(elevation: 5, child: Text('This is card 03'),),
        Card(elevation: 5, child: Text('This is card 04'),),
        Card(elevation: 5, child: Text('This is card 05'),),
      ]),),
      SingleChildScrollView(scrollDirection: Axis.horizontal, child: Row(children: const [
        Card(elevation: 5, child: Text('This is card 00'),),
        Card(elevation: 5, child: Text('This is card 01'),),
        Card(elevation: 5, child: Text('This is card 02'),),
        Card(elevation: 5, child: Text('This is card 03'),),
        Card(elevation: 5, child: Text('This is card 04'),),
        Card(elevation: 5, child: Text('This is card 05'),),
        
      ]),),

      SingleChildScrollView(scrollDirection: Axis.horizontal, child: Row(children: const [
        Card(elevation: 5, child: Text('This is card 00'),),
        Card(elevation: 5, child: Text('This is card 01'),),
        Card(elevation: 5, child: Text('This is card 02'),),
        Card(elevation: 5, child: Text('This is card 03'),),
        Card(elevation: 5, child: Text('This is card 04'),),
        Card(elevation: 5, child: Text('This is card 05'),),
      ]),),
      SingleChildScrollView(scrollDirection: Axis.horizontal, child: Row(children: const [
        Card(elevation: 5, child: Text('This is card 00'),),
        Card(elevation: 5, child: Text('This is card 01'),),
        Card(elevation: 5, child: Text('This is card 02'),),
        Card(elevation: 5, child: Text('This is card 03'),),
        Card(elevation: 5, child: Text('This is card 04'),),
        Card(elevation: 5, child: Text('This is card 05'),),
      ]),),
      SingleChildScrollView(scrollDirection: Axis.horizontal, child: Row(children: const [
        Card(elevation: 5, child: Text('This is card 00'),),
        Card(elevation: 5, child: Text('This is card 01'),),
        Card(elevation: 5, child: Text('This is card 02'),),
        Card(elevation: 5, child: Text('This is card 03'),),
        Card(elevation: 5, child: Text('This is card 04'),),
        Card(elevation: 5, child: Text('This is card 05'),),
        
      ]),),
              ]),
            )));
  }
}
