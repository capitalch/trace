import 'package:flutter/material.dart';

class DashboardBottomNavigationBar extends StatelessWidget {
  const DashboardBottomNavigationBar({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    var theme = Theme.of(context);
    return BottomNavigationBar(
      elevation: 10,
      items: const [
        BottomNavigationBarItem(
          icon: Icon(Icons.dashboard),
          label: 'Dashboard',
          backgroundColor: Colors.pink,
        ),
        BottomNavigationBarItem(
          icon: Icon(Icons.ac_unit),
          label: 'Stock',
          // backgroundColor: Colors.amber
        ),
        BottomNavigationBarItem(
            icon: Icon(Icons.search_sharp), label: 'Product'),
        BottomNavigationBarItem(
          icon: Icon(Icons.account_tree),
          label: 'Accounts',
          backgroundColor: Colors.cyan,
        ),
        BottomNavigationBarItem(
            icon: Icon(Icons.balance_sharp), label: 'Health'),
      ],
      onTap: (value) {
        if (value == 0) {
          Navigator.pushNamed(context, 'stock');
        }
      },
      selectedItemColor: Colors.black,
      iconSize: 30,
      backgroundColor: theme.backgroundColor,
      type: BottomNavigationBarType.fixed,
    );
  }
}
