import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:trace_mobile/common/widgets/bu_code_branch_header.dart';
import 'package:trace_mobile/features/accounts/classes/accounts_bs_pl_state.dart';

class AccountsBsPl extends StatelessWidget {
  const AccountsBsPl({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    final bsplType = ModalRoute.of(context)!.settings.arguments.toString();
    var bsplState = context.read<AccountsBsplState>();
    bsplState.init();
    bsplState.bsplType = bsplType;
    final title = bsplType == 'bs' ? 'Balance sheet' : 'Profit & loss';
    return Scaffold(
      appBar: AppBar(
        automaticallyImplyLeading: false,
        title: SingleChildScrollView(
            scrollDirection: Axis.horizontal,
            child: Row(
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
                        title,
                        style: Theme.of(context).textTheme.headline6,
                      ),
                    ],
                  ),
                  onTap: () {
                    Navigator.pop(context);
                  },
                ),
                const SizedBox(width: 5),
                const BuCodeBranchCodeHeader()
              ],
            )),
      ),
      body: Column(children: const [BsplHeader()]),
    );
  }
}

class BsplHeader extends StatelessWidget {
  const BsplHeader({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    var bsplState = context.read<AccountsBsplState>();
    return Selector<AccountsBsplState, bool>(
      selector: (p0, p1) => p1.isSelectedLeftLabel,
      builder: (context, value, child) {
        return Container(
          width: double.maxFinite,
          color: Colors.grey.shade300,
          padding:
              const EdgeInsets.only(left: 35, top: 5, bottom: 5, right: 15),
          child:
              Row(mainAxisAlignment: MainAxisAlignment.spaceBetween, children: [
            Container(
              padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 5),
              decoration: BoxDecoration(
                  color: value ? Colors.yellow.shade600 : Colors.transparent,
                  border: value
                      ? Border.all(width: 2)
                      : Border.all(width: 0, color: Colors.grey.shade300)),
              child: ElevatedButton(
                  onPressed: () {
                    bsplState.isSelectedLeftLabel = true;
                  },
                  child: Text(bsplState.leftLabel)),
            ),
            Container(
              padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 5),
              decoration: BoxDecoration(
                  color: !value ? Colors.yellow.shade600 : Colors.transparent,
                  border: !value
                      ? Border.all(width: 2)
                      : Border.all(width: 0, color: Colors.grey.shade300)),
              child: ElevatedButton(
                  onPressed: () {
                    bsplState.isSelectedLeftLabel = false;
                  },
                  child: Text(bsplState.rightLabel)),
            )
          ]),
        );
      },
    );
  }
}

class BsplSubHeader extends StatelessWidget {
  const BsplSubHeader({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    var bsplState = context.read<AccountsBsplState>();
    return Container();
  }
}

class BsplBody extends StatelessWidget {
  const BsplBody({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return Container();
  }
}

class BsplFooter extends StatelessWidget {
  const BsplFooter({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return Container();
  }
}



