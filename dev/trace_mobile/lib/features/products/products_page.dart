import 'package:flutter/material.dart';

class ProductsPage extends StatelessWidget {
  const ProductsPage({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    // Future data passed from previous screen
    Future<dynamic> args =
        ModalRoute.of(context)!.settings.arguments as Future<dynamic>;
    var controller = TextEditingController();
    return Scaffold(
        appBar: AppBar(
          automaticallyImplyLeading: false,
          title: SizedBox(
            width: double.infinity,
            height: 40,
            // decoration: BoxDecoration(
            //     color: Colors.white, borderRadius: BorderRadius.circular(5)),
            child: Row(
              mainAxisAlignment: MainAxisAlignment.start,
              crossAxisAlignment: CrossAxisAlignment.center,
              children: [
                InkWell(
                  child: const Icon(
                    Icons.chevron_left,
                    size: 30,
                    color: Colors.indigo,
                  ),
                  onTap: () {
                    Navigator.pop(context);
                  },
                ),
                Text(
                  'Products',
                  style: Theme.of(context).textTheme.headline6,
                ),
                const SizedBox(
                  width: 8,
                ),
                // Search box
                Expanded(
                    child: Container(
                  // padding: EdgeInsets.only(left:10),
                  // color: Colors.grey.shade200,
                  decoration: BoxDecoration(
                      color: Colors.grey.shade100,
                      borderRadius: BorderRadius.circular(25)),
                  child: TextField(
                    controller: controller,
                    // style: TextStyle(backgroundColor: Colors.grey),
                    // style: TextStyle(backgroundColor: Colors.grey.shade200),
                    decoration: InputDecoration(
                        // fillColor: Colors.grey,
                        // filled: true,
                        iconColor: Colors.indigo,
                        prefixIcon: const Icon(
                          Icons.search,
                          size: 20,
                          color: Colors.indigo,
                        ),
                        suffixIcon: IconButton(
                          icon: const Icon(Icons.clear,
                              size: 20, color: Colors.indigo),
                          onPressed: () {
                            controller.clear();
                          },
                        ),
                        hintText: 'Search...',
                        border: InputBorder.none),
                  ),
                ))
              ],
            ),
          ),
        ),
        body: FutureBuilder(
          future: args,
          builder: (context, snapshot) {
            switch (snapshot.connectionState) {
              case ConnectionState.waiting:
                return Center(
                  child: Text(
                    'Loading....',
                    style: Theme.of(context).textTheme.headline6,
                  ),
                );
              default:
                if (snapshot.hasError) {
                  return Center(
                    child: Text(
                      'Error: ${snapshot.error}',
                      style: TextStyle(color: Theme.of(context).errorColor),
                    ),
                  );
                } else if (snapshot.hasData) {
                  List<dynamic> dataList =
                      // snapshot.data['data']['accounts']['genericView'];
                      snapshot.data.data?['accounts']?['genericView'] ?? [];
                  if (dataList.isEmpty) {
                    return Center(
                      child: Text(
                        'No data',
                        style: Theme.of(context).textTheme.headline6,
                      ),
                    );
                  } else {
                    return ProductsList(
                      dataList: dataList,
                    );
                  }
                } else {
                  return Center(
                    child: Text(
                      'No data',
                      style: Theme.of(context).textTheme.headline6,
                    ),
                  );
                }
            }
          },
        ));
  }
}

class ProductsList extends StatelessWidget {
  const ProductsList({Key? key, required this.dataList}) : super(key: key);
  final List<dynamic> dataList;
  @override
  Widget build(BuildContext context) {
    // return SfDataGrid(source: DataGridSource(), columns: columns)
    // title: Text(dataList[index]['label']),
    return ListView.builder(
      itemCount: dataList.length,
      itemBuilder: (context, index) {
        return ListItem(
            indexedItem: IndexedItem.fromJson(j: dataList[index]),
            index: index + 1);
      },
    );
  }
}

class IndexedItem {
  IndexedItem({
    required this.brandName,
    required this.catName,
    required this.clos,
    required this.info,
    required this.label,
  });

  factory IndexedItem.fromJson({required Map<String, dynamic> j}) {
    return IndexedItem(
      brandName: j['brandName'],
      catName: j['catName'],
      clos: double.parse(j['clos'].toString()),
      info: j['info'],
      label: j['label'],
    );
  }
  final String brandName;
  final String catName;
  final double clos;
  final String? info;
  final String label;
}

class ListItem extends StatelessWidget {
  const ListItem({Key? key, required this.indexedItem, required this.index})
      : super(key: key);
  final IndexedItem indexedItem;
  final int index;
  @override
  Widget build(BuildContext context) {
    ThemeData theme = Theme.of(context);
    // var age = indexedItem['age'];
    double close = indexedItem.clos;

    var title = [
      indexedItem.catName,
      ' ',
      indexedItem.brandName,
      ' ',
      indexedItem.label
    ].join();
    var subTitle = indexedItem.info;
    return Center(
        child: Card(
      margin: const EdgeInsets.only(top: 5, bottom: 5),
      elevation: 1,
      // color: ((age ?? 0) >= 360) ? Colors.grey.shade100 : Colors.blue.shade100,
      shadowColor: Colors.green.shade200,
      child: Column(
        children: [
          ListTile(
              leading: Text(
                index.toString(),
                style: theme.textTheme.subtitle1?.copyWith(color: Colors.brown),
              ),
              title: Text(
                title,
                style: theme.textTheme.bodyLarge?.copyWith(
                  color: Colors.indigo,
                  fontWeight: FontWeight.bold,
                ),
              ),
              subtitle: Text(
                subTitle ?? '',
                style: theme.textTheme.bodyText1,
              ),
              dense: true,
              trailing: CircleAvatar( radius: 20,
                  backgroundColor: Colors.indigo.shade700,
                  foregroundColor: Colors.white,
                  child: Text(close.toStringAsFixed(0), style: theme.textTheme.subtitle2?.copyWith(color: Colors.white),))),
        ],
      ),
    ));
  }
}
