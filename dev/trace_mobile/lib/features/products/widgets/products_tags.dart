import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:trace_mobile/features/products/classes/products_search_state.dart';

class ProductsTags extends StatelessWidget {
  const ProductsTags({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    ProductsSearchState productsSearchState =
        Provider.of<ProductsSearchState>(context, listen: false);
    return Container(
      height: 30,
      width: double.maxFinite,
      child: SingleChildScrollView(
        scrollDirection: Axis.horizontal,
        child: Row(children: [
          const SizedBox(
            width: 15,
          ),
          Chip(
                deleteIcon: const Icon(
                  Icons.close,
                  color: Colors.white,
                  size: 15,
                ),
                onDeleted: () {
                  print('');
                },
                materialTapTargetSize: MaterialTapTargetSize.padded,
                label: 
                Container(
                  width: 100,
                  height: 15,
                  child: Text('chip'),
                ),
              ),
          InkWell(
            child: 
            // Container(
            //   decoration: BoxDecoration(
            //     color: Colors.blue.shade100,
            //     borderRadius: const BorderRadius.only(
            //         topRight: Radius.circular(30.0),
            //         bottomRight: Radius.circular(30.0)),
            //     border: Border.all(color: Color.fromRGBO(0, 0, 0, 0.0)),
            //   ),
            //   child: 
              Chip(
                deleteIcon: const Icon(
                  Icons.close,
                  color: Colors.white,
                  size: 15,
                ),
                onDeleted: () {
                  print('');
                },
                materialTapTargetSize: MaterialTapTargetSize.shrinkWrap,
                label: Text('chip')
                // Container(
                //   width: 100,
                //   height: 15,
                //   child: Text('chip'),
                // ),
              ),
            // ),

            // const Chip(
            //   padding: EdgeInsets.all(0),
            //   labelPadding: EdgeInsets.symmetric(horizontal: 8,),
            //   shape: RoundedRectangleBorder(borderRadius: BorderRadius.all(Radius.circular(8))),
            //   label: Text(
            //     'nikon',
            //     style: TextStyle(color: Colors.lightBlue),
            //   ),
            // ),
            onTap: () {
              productsSearchState.searchFromTag = 'nikon';
            },
          )
        ]),
      ),
    );
  }
}
