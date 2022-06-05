import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:trace_mobile/common/classes/global_settings.dart';
import 'package:trace_mobile/common/classes/utils.dart';
import 'package:trace_mobile/features/dashboard/subheader_fin_year.dart';

class DashboardSubheader extends StatelessWidget {
  const DashboardSubheader({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    var globalSettings = Provider.of<GlobalSettings>(context, listen: true);
    return Container(
      padding: const EdgeInsets.only(left: 15, top:0),
      child: Row(mainAxisAlignment: MainAxisAlignment.spaceBetween, children: [
        // buCode
        Container(
            padding: const EdgeInsets.fromLTRB(5, 5, 5, 5),
            child: SizedBox(
              width: 200,
              child: Text(globalSettings.unitInfo['unitName'] ?? '',
                  overflow: TextOverflow.ellipsis,
                  style: Theme.of(context).textTheme.bodyText2
                  // ?.copyWith(color: Colors.indigo),
                  ),
            )),
        const SubheaderFinYear(),

        InkWell(
          // Branch
          child: Container(
            padding:
                const EdgeInsets.only(left: 5, top: 5, bottom: 5, right: 15),
            child: Text(
              globalSettings.currentBranchMap['branchCode'] ?? '',
              style: const TextStyle(color: Colors.indigo),
            ),
          ),
          onTap: () {},
        ),
      ]),
    );
  }
}

void changeBranch(BuildContext context, GlobalSettings globalSettings) async {
  var result = await showDialog(
    barrierDismissible: false,
    context: context,
    builder: (context) {
      return (SimpleDialog(
          title: Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              const Text('Select a business unit'),
              InkWell(
                child: const Icon(Icons.close),
                onTap: () {
                  Navigator.pop(context, '0');
                },
              ),
            ],
          ),
          children: getBranchOptions(context, globalSettings)));
    },
  );
  if (result != '0') {
    // globalSettings.setLastUsedBuCode(result);
    Utils.execDataCache(globalSettings);
  }
}

List<SimpleDialogOption>? getBranchOptions(
    BuildContext context, GlobalSettings globalSettings) {
  List<dynamic>? buCodes = globalSettings.buCodes;
  var buCodesList = buCodes?.map((e) {
    return SimpleDialogOption(
      onPressed: () {
        Navigator.pop(context, e.toString());
      },
      child: Text(e.toString()),
    );
  }).toList();

  return buCodesList;
}