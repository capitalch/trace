import 'package:flutter/material.dart';

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
      width: double.infinity,
      height: 40,
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
                // productsSearchState.searchFromTag = '';
                // List<String> tagsData = productsTagsState.productsTags;
                // String serializedData = json.encode(tagsData);
                // DataStore.saveDataInSecuredStorage(
                //     'productsTags', serializedData);
                Navigator.pop(context);
              },
            ),
          ]),
    );
  }
}
