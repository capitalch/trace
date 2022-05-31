// import 'package:flutter/cupertino.dart';
import 'package:flutter/material.dart';
import 'package:trace_mobile/features/dashboard/dashboard_app_bar.dart';
import 'package:trace_mobile/features/dashboard/dashboard_bottom_navigation_bar.dart';

class DashBoard extends StatelessWidget {
  const DashBoard({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return  const Scaffold(
      appBar: DashboardAppBar(),
      body: Center(child: Text('Dashboard')),
      bottomNavigationBar: DashboardBottomNavigationBar(),
    );
  }
}

// AppBar(
//         // automaticallyImplyLeading: false,
//         title: const Text('Dash board'),
//         actions: [
//           IconButton(
//               onPressed: () {},
//               icon: const Icon(Icons.search_rounded),
//               iconSize: 28),
//           IconButton(
//             onPressed: () {},
//             icon: const Icon(Icons.logout),
//           ),
//         ],
//       ),
//       drawer: Drawer(
//         child: ListView(
//           padding: EdgeInsets.zero,
//           children: [
//             const DrawerHeader(
//               decoration: BoxDecoration(color: Colors.blue),
//               child: Text('Trace menu'),
//             ),
//             ListTile(
//               title: const Text('Reports'),
//               onTap: (() {
//                 Navigator.pop(context);
//               }),
//             ),
//             ListTile(
//               title: const Text('Stock tally'),
//               onTap: () {
//                 Navigator.pop(context);
//               },
//             ),
//             ListTile(
//               title: const Text('Bank reconcillation'),
//               onTap: () {
//                 Navigator.pop(context);
//               },
//             )
//           ],
//         ),
//       ),
//       body: const Center(child: Text('Dashboard')),