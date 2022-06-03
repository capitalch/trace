import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:trace_mobile/common/classes/global_settings.dart';

class Subheader extends StatelessWidget {
  const Subheader({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    var globalSettings = Provider.of<GlobalSettings>(context, listen: true);
    return Container(
      padding: const EdgeInsets.only(left: 15),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.spaceBetween,
        children: [
        // buCode
        InkWell(
          child: Container(
            padding: const EdgeInsets.fromLTRB(5, 5, 5, 5),
            // width: 166,
            child: Text(
              '${globalSettings.unitInfo['unitName']}',
              overflow: TextOverflow.ellipsis,
              style: Theme.of(context)
                  .textTheme
                  .bodyText2
                  ?.copyWith(color: Colors.indigo),
            ),
          ),
          onTap: () {},
        ),
        // add icon
        InkWell(
          child: Container(
            padding: EdgeInsets.only(left: 3, top: 3, bottom: 3, right: 0),
            child: Icon(Icons.add_sharp),
          ),
          onTap: () {},
        ),
        // Year
        InkWell(
          child: Container(
            padding: const EdgeInsets.fromLTRB(5, 5, 5, 5),
            child: Text('2022'),
          ),
          onTap: () {},
        ),
        InkWell(
          // minus icon
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
