import 'package:flutter/material.dart';
import 'package:trace_mobile/common/classes/routes.dart';

class AccountsPage extends StatelessWidget {
  const AccountsPage({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    var themeStyle = Theme.of(context).textTheme;
    return Scaffold(
      appBar: AppBar(
          automaticallyImplyLeading: false,
          title: Row(
            children: [
              InkWell(
                child: Row(
                  children: [
                    const Icon(
                      Icons.chevron_left,
                      size: 30,
                      color: Colors.indigo,
                    ),
                    Text(
                      'Accounts',
                      style: Theme.of(context).textTheme.headline6,
                    ),
                  ],
                ),
                onTap: () {
                  Navigator.pop(context);
                },
              ),
            ],
          )),
      body: ListView(children: [
        Padding(
          padding: const EdgeInsets.all(3),
          child: ListTile(
            tileColor: Colors.grey.shade200,
            // horizontalTitleGap: 5,
            title: Text(
              'All transactions',
              style: themeStyle.subtitle1,
            ),
            onTap: () {},
          ),
        ),
        Padding(
          padding: const EdgeInsets.all(3),
          child: ListTile(
            tileColor: Colors.grey.shade200,
            // horizontalTitleGap: 5,
            title: Text(
              'General ledger',
              style: themeStyle.subtitle1,
            ),
            onTap: () {},
          ),
        ),
        Padding(
          padding: const EdgeInsets.all(3),
          child: ListTile(
            tileColor: Colors.grey.shade200,
            // horizontalTitleGap: 5,
            title: Text(
              'Bank reconcillation',
              style: themeStyle.subtitle1,
            ),
            onTap: () {},
          ),
        ),
        Padding(
          padding: const EdgeInsets.all(3),
          child: ListTile(
            tileColor: Colors.grey.shade200,
            // horizontalTitleGap: 5,
            title: Text(
              'Trial balance',
              style: themeStyle.subtitle1,
            ),
            onTap: () {
              Navigator.pushNamed(context, Routes.trialBalance);
            },
          ),
        ),
        Padding(
          padding: const EdgeInsets.all(3),
          child: ListTile(
            tileColor: Colors.grey.shade200,
            // horizontalTitleGap: 5,
            title: Text(
              'Balance sheet',
              style: themeStyle.subtitle1,
            ),
            onTap: () {},
          ),
        ),
        Padding(
          padding: const EdgeInsets.all(3),
          child: ListTile(
            tileColor: Colors.grey.shade200,
            // horizontalTitleGap: 5,
            title: Text(
              'Profit and loss account',
              style: themeStyle.subtitle1,
            ),
            onTap: () {},
          ),
        ),
      ]),
    );
  }
}
