import 'package:flutter/material.dart';
import 'package:trace_mobile/features/dashboard/widgets/dashboard_app_bar.dart';
import 'package:trace_mobile/features/dashboard/widgets/dashboard_bottom_navigation_bar.dart';
import 'package:trace_mobile/features/dashboard/widgets/dashboard_subheader.dart';

class DashBoardPage extends StatelessWidget {
  const DashBoardPage({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    Future<dynamic> dashboardFuture =
        ModalRoute.of(context)!.settings.arguments as Future<dynamic>;

    Widget tempWidget = FutureBuilder(
        future: dashboardFuture,
        builder: ((context, snapshot) {
          Widget widget;
          if (snapshot.connectionState == ConnectionState.waiting) {
            widget = Center(
              child: Text('Loading...', style: Theme.of(context).textTheme.headline5,),
            );
          } else {
            if (snapshot.hasError) {
              widget = Center(
                child: Text(
                  'Error: ${snapshot.error}',
                  style: TextStyle(color: Theme.of(context).errorColor),
                ),
              );
            } else {
              widget = Scaffold(
                appBar: const DashboardAppBar(),
                body: Column(
                  mainAxisAlignment: MainAxisAlignment.start,
                  children: const [DashboardSubheader()],
                ),
                bottomNavigationBar: const DashboardBottomNavigationBar(),
              );
            }
          }
          return widget;
        }));
    return Material(
      child: tempWidget,
    );
  }
}
