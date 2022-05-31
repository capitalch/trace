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