import 'dart:async';
import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:trace_mobile/common/classes/ibuki.dart';
import 'package:trace_mobile/features/products/classes/indexed_item.dart';
import 'package:trace_mobile/features/products/classes/products_summary_state.dart';
import 'package:trace_mobile/features/products/classes/products_tags_state.dart';
import 'package:trace_mobile/features/products/widgets/products_card_item.dart';

class ProductsList extends StatefulWidget {
  const ProductsList({Key? key, required this.dataList}) : super(key: key);
  final List<dynamic> dataList;

  @override
  State<ProductsList> createState() => _ProductsListState();
}

class _ProductsListState extends State<ProductsList> {
  List<dynamic> filteredList = [];
  StreamSubscription<Map<String, dynamic>>? subs;

  @override
  void initState() {
    super.initState();
    filteredList = [...widget.dataList];
    ProductsSummaryState productsSummaryState =
        Provider.of<ProductsSummaryState>(context, listen: false);
    ProductsTagsState productsTagsState = Provider.of<ProductsTagsState>(
        context,
        listen: false); // To manage the tags

    subs =
        Ibuki.debounceFilterOn(IbukiKeys.productFilerKey, debouncePeriod: 1500)
            .listen((d) {
      String searchText = d['data'].toString().toLowerCase();
      List<String> searchList =
          searchText.split(RegExp(r'\W')); // split on special characters
      filteredList = widget.dataList.where((row) {
        return searchList.every(
          (searchItem) {
            var temp = row.values.join(' ').toString().toLowerCase();
            return temp.contains(searchItem);
          },
        );
      }).toList();
      double summaryClos = 0, summarySumGst = 0, summarySum = 0;
      for (var ele in filteredList) {
        IndexedItem item = IndexedItem.fromJson(j: ele);
        summaryClos = summaryClos + item.clos;
        summarySumGst = summarySumGst + (item.clos * item.purGst);
        summarySum = summarySum + (item.clos * item.pur);
      }
      productsSummaryState.summaryCount = filteredList.length;
      productsSummaryState.summaryClos = summaryClos;
      productsSummaryState.summarySumGst = summarySumGst;
      productsSummaryState.summarySum = summarySum;

      productsTagsState.addTag(searchText);
      setState(() {});
    });

    Ibuki.debounceEmit(IbukiKeys.productFilerKey, '');
  }

  @override
  void dispose() {
    subs?.cancel();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return ListView.builder(
      itemCount: filteredList.length,
      itemBuilder: (context, index) {
        return ProductsCardItem(
            indexedItem: IndexedItem.fromJson(j: filteredList[index]),
            index: index + 1);
      },
    );
    // );
  }
}
