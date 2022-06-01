import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:trace_mobile/common/classes/global_settings.dart';

class Subheader extends StatelessWidget {
  const Subheader({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    var globalSettings = Provider.of<GlobalSettings>(context);
    return Container(
      padding: const EdgeInsets.only(left: 15),
      child: Row(children: [
        InkWell(
          child: Container(
              padding: const EdgeInsets.fromLTRB(5, 5, 5, 5),
              width: 166,
              child: PreferredSize(
                preferredSize: const Size.fromWidth(200),
                child: Text(
                  '${globalSettings.lastUsedBuCode}',
                  overflow: TextOverflow.ellipsis,
                  style: Theme.of(context)
                      .textTheme
                      .bodyText2
                      ?.copyWith(color: Colors.indigo),
                ),
              )),
          onTap: () {},
        ),
        InkWell(
          child: Container(
            padding: EdgeInsets.only(left: 3, top: 3, bottom: 3, right: 0),
            child: Icon(Icons.add_sharp),
          ),
          onTap: () {},
        ),
        InkWell(
          child: Container(
            padding: const EdgeInsets.fromLTRB(5, 5, 5, 5),
            child: Text('2022'),
          ),
          onTap: () {},
        ),
        InkWell(
          child: Container(
            padding: EdgeInsets.only(left: 3, top: 3, bottom: 3, right: 0),
            child: Icon(
              Icons.remove_sharp,
            ),
          ),
          onTap: () {},
        ),
      ]),
    );
  }
}
