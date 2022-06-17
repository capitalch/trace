import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:trace_mobile/features/vouchers/classes/vouchers_state.dart';

class VouchersPage extends StatelessWidget {
  const VouchersPage({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        automaticallyImplyLeading: false,
        title: VouchersAppBarTitle(),
      ),
    );
  }
}

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
    var labels = context.read<VouchersState>().getAlllVoucherLabels();
    var labelsLayout = labels.map(
      (String label) {
        return 
        Material(child: Container(
            padding: const EdgeInsets.symmetric(horizontal: 5),
            // color: Colors.amber.shade100,
            child: Ink(
              padding: const EdgeInsets.symmetric(horizontal: 10),
              decoration: BoxDecoration(
                color: Colors.amber,
                borderRadius: BorderRadius.circular(10),
                
                // gradient: LinearGradient(
                //   begin: Alignment.centerLeft,
                //   end: Alignment.centerRight,
                //   colors: [Colors.yellow, Colors.green],
                // ),
                // shape: BoxShape.rectangle,
              ),
              child: InkWell(
                splashColor: Colors.red,
                onTap: () {},
                customBorder: const RoundedRectangleBorder(),
                child: Center(
                    child: Text(
                  label,
                  style: Theme.of(context).textTheme.labelLarge,
                )),
              ),
            )
            // child: InkWell(
            //   splashColor: Theme.of(context).primaryColorLight,
            //   onTap: () {},
            //   borderRadius: BorderRadius.circular(10),
            //   customBorder: ShapeBorder.,
            //   child: Ink(
            //     height: 30,
            //     decoration: BoxDecoration(
            //       borderRadius: BorderRadius.circular(10),
            //       color: Colors.amber.shade100,
            //     ),
            //     padding: const EdgeInsets.only(top: 8, left: 10, right: 10),
            //     child: Text(
            //       label,
            //       style: Theme.of(context).textTheme.labelLarge,
            //     ),
            //   ),
            // ),
            ),)
        ;
      },
    ).toList();
    return labelsLayout;
  }
}
