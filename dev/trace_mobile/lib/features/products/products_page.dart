import 'package:flutter/material.dart';
import 'package:syncfusion_flutter_datagrid/datagrid.dart';

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
                    Icons.arrow_left_sharp,
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
                  width: 15,
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
                      snapshot.data.data?['accounts']?['genericView'];
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
    return SfDataGrid(source: DataGridSource(), columns: columns)
    
    ListView.builder(
      itemCount: dataList.length,
      itemBuilder: (context, index) {
        return ListTile(
          title: Text(dataList[index]['label']),
        );
      },
    );
  }
}
