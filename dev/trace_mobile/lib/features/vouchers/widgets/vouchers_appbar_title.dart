import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:trace_mobile/features/vouchers/classes/vouchers_state.dart';

class VouchersAppBarTitle extends StatelessWidget {
  const VouchersAppBarTitle({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return SizedBox(
      width: double.maxFinite,
      height: 40,
      child: SingleChildScrollView(
        scrollDirection: Axis.horizontal,
        child: Row(
            mainAxisAlignment: MainAxisAlignment.start,
            crossAxisAlignment: CrossAxisAlignment.center,
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
                      'Vouchers',
                      style: Theme.of(context).textTheme.headline6,
                    ),
                  ],
                ),
                onTap: () {
                  Navigator.pop(context);
                },
              ),
              const SizedBox(width: 5),
              ...getLabelsLayout(context)
            ]),
      ),
    );
  }

  List<Widget> getLabelsLayout(BuildContext context) { 
    var vouchersStateMap = context.read<VouchersState>().vouchersStateMap;
    var getVouchersState = context.read<VouchersState>().getVouchersState;
    var keys = vouchersStateMap.keys.toList();
    var labelsLayout = keys.map(
      (String key) {
        return Material(
          child: Container(
            padding: const EdgeInsets.symmetric(horizontal: 5),
            child: InkWell(
              splashColor: Theme.of(context).primaryColorLight,
              onTap: () {
                context.read<VouchersState>().setQueryKey(key);
              },
              borderRadius: BorderRadius.circular(15),
              child: Ink(
                  height: 30,
                  decoration: BoxDecoration(
                    borderRadius: BorderRadius.circular(15),
                    
                    color: Colors.grey.shade600,
                  ),
                  padding: const EdgeInsets.symmetric(horizontal: 10),
                  child: Center(
                    child: Text(
                      getVouchersState(key)!.label,
                      style: Theme.of(context).textTheme.labelLarge?.copyWith(color: Colors.white),
                    ),
                  )),
            ),
          ),
        );
      },
    ).toList();
    return labelsLayout;
  }
}