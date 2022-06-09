import 'package:flutter/material.dart';

class ProductsPage extends StatelessWidget {
  const ProductsPage({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    // Future data passed from previous screen
    Future<dynamic> getAllProductsFuture =
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
                // back icon
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
          future: getAllProductsFuture,
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

class SearchNotifier extends ValueNotifier<String> {
  SearchNotifier(super.value);
  String searchText = '';
  void setSearchText(String val) {
    searchText = val;
    notifyListeners();
  }
}

class ProductsList extends StatelessWidget {
  const ProductsList({Key? key, required this.dataList}) : super(key: key);
  final List<dynamic> dataList;
  @override
  Widget build(BuildContext context) {
    // ValueNotifier<String> searchText = ValueNotifier('');
    SearchNotifier search = SearchNotifier('');

    return ValueListenableBuilder(
        valueListenable: search,
        builder: (context, value, child) {
          List<dynamic> filteredList = dataList
              .where((element) => element['brandName']
                  .toString()
                  .toLowerCase()
                  .contains(search.searchText))
              .toList();
          return Column(
            children: [
              Row(
                children: [
                  ElevatedButton(
                      onPressed: () {
                        search.setSearchText('nikon');
                      },
                      child: Text('Check search')),
                  Text(search.searchText)
                ],
              ),
              Expanded(
                child: ListView.builder(
                  itemCount: filteredList.length,
                  itemBuilder: (context, index) {
                    return ListItem(
                        indexedItem:
                            IndexedItem.fromJson(j: filteredList[index]),
                        index: index + 1);
                  },
                ),
              )
            ],
          );
        });
  }
}

class IndexedItem {
  IndexedItem({
    required this.age,
    required this.brandName,
    required this.catName,
    required this.clos,
    required this.info,
    required this.label,
    required this.mrp,
    required this.purGst,
    required this.salGst,
    required this.ytd,
  });

  factory IndexedItem.fromJson({required Map<String, dynamic> j}) {
    return IndexedItem(
      age: double.parse((j['age'] ?? 0).toString()),
      brandName: j['brandName'],
      catName: j['catName'],
      clos: double.parse(j['clos'].toString()),
      info: j['info'],
      label: j['label'],
      mrp: double.parse((j['maxRetailPrice'] ?? 0).toString()),
      purGst: double.parse(j['lastPurchasePriceGst'].toString()),
      salGst: double.parse(j['salePriceGst'].toString()),
      ytd: double.parse((j['sale'] ?? 0).toString()),
    );
  }
  final double age;
  final String brandName;
  final String catName;
  final double clos;
  final String? info;
  final String label;
  final double mrp;
  final double purGst;
  final double salGst;
  final double ytd;
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
      indexedItem.brandName,
      ' ',
      indexedItem.catName,
      ' ',
      indexedItem.label
    ].join();
    var subTitle = indexedItem.info;
    return Center(
        child: Card(
            // margin: const EdgeInsets.only(top: 5, bottom: 5),
            elevation: 1,
            color: ((indexedItem.age) >= 360)
                ? Colors.pink.shade100
                : Colors.grey.shade100,
            // shadowColor: Colors.green.shade200,
            child: Column(children: [
              Container(
                padding: const EdgeInsets.only(top: 5),
                child: Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    crossAxisAlignment: CrossAxisAlignment.center,
                    children: [
                      Container(
                        padding: const EdgeInsets.only(left: 70),
                        child: Text(
                          'AGE: ${indexedItem.age.toStringAsFixed(0)}',
                          style: const TextStyle(fontWeight: FontWeight.w900),
                        ),
                      ),
                      Text('YTD: ${indexedItem.ytd.toStringAsFixed(0)}'),
                      Container(
                        padding: const EdgeInsets.only(right: 15),
                        child: Text(
                          'MRP: ${indexedItem.mrp.toStringAsFixed(0)}',
                          style: const TextStyle(fontWeight: FontWeight.w900),
                        ),
                      )
                    ]),
              ),

              ListTile(
                  // contentPadding: EdgeInsets.all(5),
                  leading: Text(
                    index.toString(),
                    style: theme.textTheme.subtitle1
                        ?.copyWith(color: Colors.brown),
                  ),
                  title: Text(
                    title,
                    // style : TextStyle(color:Colors.blue.shade700, fontWeight: FontWeight.w900)
                    style: theme.textTheme.bodyLarge?.copyWith(
                      color: Colors.blue.shade700,
                      fontWeight: FontWeight.w900,
                    ),
                  ),
                  subtitle: Text(
                    subTitle ?? '',
                    style: theme.textTheme.bodyText1,
                  ),
                  dense: true,
                  trailing: CircleAvatar(
                      radius: 20,
                      backgroundColor: (indexedItem.clos == 0)
                          ? Colors.white
                          : Colors.indigo.shade900,
                      // foregroundColor: (indexedItem.clos == 0)
                      //     ? Colors.black
                      //     : Colors.white,
                      child: Text(
                        close.toStringAsFixed(0),
                        style: theme.textTheme.subtitle2?.copyWith(
                            color: (indexedItem.clos == 0)
                                ? Colors.black
                                : Colors.white),
                      ))),
              const SizedBox(
                height: 5,
              ),
              Container(
                // color: Colors.grey.shade200,
                padding: const EdgeInsets.only(bottom: 5),
                child: Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    crossAxisAlignment: CrossAxisAlignment.center,
                    children: [
                      Container(
                        padding: const EdgeInsets.only(left: 70),
                        child: Text(
                          'PUR(GST): ${indexedItem.purGst.toStringAsFixed(0)}',
                          style: const TextStyle(fontWeight: FontWeight.w900),
                        ),
                      ),
                      // Text('Age: ${indexedItem.age.toStringAsFixed(0)}'),
                      Container(
                        padding: const EdgeInsets.only(right: 15),
                        child: Text(
                          'SAL(GST): ${indexedItem.salGst.toStringAsFixed(0)}',
                          style: const TextStyle(fontWeight: FontWeight.w900),
                        ),
                      )
                    ]),
              ),
              // SizedBox(
              //   height: 5,
              // ),
              // Row(
              //   mainAxisAlignment: MainAxisAlignment.spaceBetween,
              //   children: [
              //   Text('Age:'),
              //   Text('YTD:')
              // ],)
            ])));
  }
}
