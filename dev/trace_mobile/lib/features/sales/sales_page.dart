import 'package:flutter/material.dart';

class SalesPage extends StatelessWidget {
  const SalesPage({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return Scaffold(
        appBar: AppBar(
          automaticallyImplyLeading: false,
          title: const SalesAppBarTitle(),
        ),
        body: Column(
          children: [
            
          ],
        ));
  }
}

class SalesAppBarTitle extends StatelessWidget {
  const SalesAppBarTitle({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return SizedBox(
        width: double.maxFinite,
        height: 40,
        child: SingleChildScrollView(
          scrollDirection: Axis.horizontal,
          child: Row(
              mainAxisAlignment: MainAxisAlignment.start,
              crossAxisAlignment: CrossAxisAlignment.center,
              children: [
                // back icon
                InkWell(
                  child: Row(
                    children: [
                      const Icon(
                        Icons.chevron_left,
                        size: 30,
                        color: Colors.indigo,
                      ),
                      Text(
                        'Sales',
                        style: Theme.of(context).textTheme.headline6,
                      ),
                    ],
                  ),
                  onTap: () {
                    Navigator.pop(context);
                  },
                ),
                InkWell(
                  child: Text('Today'),
                  onTap: () {},
                ),
                InkWell(
                  child: Text('Yesterday'),
                  onTap: () {},
                ),
                InkWell(
                  child: Text('1 day before'),
                  onTap: () {},
                ),
                InkWell(
                  child: Text('2 days before'),
                  onTap: () {},
                ),
                InkWell(
                  child: Text('This month'),
                  onTap: () {},
                ),
                InkWell(
                  child: Text('Last month'),
                  onTap: () {},
                )
              ]),
        ));
  }
}
