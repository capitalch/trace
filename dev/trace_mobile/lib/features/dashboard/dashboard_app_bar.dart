// import 'package:flutter/cupertino.dart';
// import 'dart:math';

import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:trace_mobile/common/classes/global_settings.dart';
import 'package:trace_mobile/common/widgets/subheader.dart';

class DashboardAppBar extends StatelessWidget with PreferredSizeWidget {
  const DashboardAppBar({Key? key}) : super(key: key);

  @override
  Size get preferredSize => const Size.fromHeight(70);

  @override
  Widget build(BuildContext context) {
    return AppBar(
        automaticallyImplyLeading: false,
        bottom: const PreferredSize(
            preferredSize: Size.fromHeight(10), child: Subheader()),
        // backgroundColor: Colors.amber,
        title: Row(
          mainAxisAlignment: MainAxisAlignment.spaceBetween,
          crossAxisAlignment: CrossAxisAlignment.center,
          children: [
            // Menu
            Row(
              mainAxisAlignment: MainAxisAlignment.start,
              children: [
                InkWell(
                  child: const Padding(
                    padding: EdgeInsets.all(5),
                    child:
                        Icon(Icons.menu_sharp, size: 30, color: Colors.black),
                  ),
                  onTap: () {},
                ),
                const SizedBox(
                  width: 15,
                ),
                Padding(
                  padding: const EdgeInsets.only(bottom: 1),
                  child: Text(
                    'Dashboard',
                    style: Theme.of(context).textTheme.headline5,
                  ),
                )
              ],
            ),
            // Sales
            InkWell(
              child: Padding(
                padding: const EdgeInsets.all(5),
                child: Row(mainAxisSize: MainAxisSize.min, children: [
                  const Icon(
                    Icons.point_of_sale_sharp,
                    size: 25,
                    color: Colors.indigo,
                  ),
                  Text('Sales',
                      style: Theme.of(context)
                          .textTheme
                          .button
                          ?.copyWith(color: Colors.indigo))
                ]),
              ),
              onTap: () {},
            ),
            // Logout
            InkWell(
              child: Padding(
                padding: const EdgeInsets.all(5),
                child: Row(mainAxisSize: MainAxisSize.min, children: [
                  const Icon(
                    Icons.logout,
                    size: 25,
                    color: Colors.orange,
                  ),
                  Text('Logout',
                      style: Theme.of(context)
                          .textTheme
                          .button
                          ?.copyWith(color: Colors.orange))
                ]),
              ),
              onTap: () {
                logout(context);
              },
            )
          ],
        ));
  }
}

void logout(BuildContext context) {
  Provider.of<GlobalSettings>(context, listen: false).resetLoginData();
  Navigator.pop(context);
}
