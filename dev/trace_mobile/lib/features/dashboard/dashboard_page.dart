// import 'package:flutter/cupertino.dart';
import 'package:flutter/material.dart';
import 'package:trace_mobile/common/widgets/subheader.dart';
import 'package:trace_mobile/features/dashboard/dashboard_app_bar.dart';
import 'package:trace_mobile/features/dashboard/dashboard_bottom_navigation_bar.dart';

class DashBoardPage extends StatelessWidget {
  const DashBoardPage({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return  Scaffold(
      appBar: const DashboardAppBar(),
      body: Column(
        mainAxisAlignment: MainAxisAlignment.start,
        children: const [
        // Subheader()
      ],),
      bottomNavigationBar: const DashboardBottomNavigationBar(),
    );
  }
}