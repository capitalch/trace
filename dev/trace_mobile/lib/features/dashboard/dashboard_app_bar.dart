// import 'package:flutter/cupertino.dart';
import 'dart:math';

import 'package:flutter/material.dart';

class DashboardAppBar extends StatelessWidget with PreferredSizeWidget {
  const DashboardAppBar({Key? key}) : super(key: key);

  @override
  Size get preferredSize => const Size.fromHeight(kToolbarHeight);

  @override
  Widget build(BuildContext context) {
    return AppBar(
        actions: [],
        automaticallyImplyLeading: false,
        title: Row(
          mainAxisAlignment: MainAxisAlignment.spaceBetween,
          crossAxisAlignment: CrossAxisAlignment.center,
          children: [
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
                  width: 10,
                ),
                Padding(
                  padding: const EdgeInsets.only(bottom: 2),
                  child: Text(
                    'Dashboard',
                    style: Theme.of(context)
                        .textTheme
                        .headline6
                        ?.copyWith(color: Colors.black, fontSize: 20),
                  ),
                )
              ],
            ),
            Row(
              mainAxisSize: MainAxisSize.min,
              mainAxisAlignment: MainAxisAlignment.start,
              children: [
                TextButton(
                  child: Text(
                    'Sales',
                    style: Theme.of(context)
                        .textTheme
                        .headline6
                        ?.copyWith(fontWeight: FontWeight.normal, fontSize: 18),
                  ),
                  onPressed: () {},
                ),
                InkWell(
                  child: Padding(
                    padding: const EdgeInsets.all(5),
                    child: Icon(
                      Icons.more_vert,
                      color: Theme.of(context).primaryColor,
                    ),
                  ),
                  onTap: () {},
                )
              ],
            ),
            InkWell(
              child: Padding(
                padding: const EdgeInsets.all(5),
                child: Row(mainAxisSize: MainAxisSize.min, children: const [
                  Icon(
                    Icons.logout,
                    size: 25,
                    color: Colors.red,
                  ),
                  Text(
                    'Logout',
                    style: TextStyle(color: Colors.red),
                  )
                ]),
              ),
              onTap: () {},
            )
          ],
        ));
  }
}
