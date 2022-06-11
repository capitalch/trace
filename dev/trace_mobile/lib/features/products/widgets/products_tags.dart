import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:trace_mobile/features/products/classes/products_search_state.dart';

class ProductsTags extends StatelessWidget {
  const ProductsTags({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    ThemeData theme = Theme.of(context);
    ProductsSearchState productsSearchState =
        Provider.of<ProductsSearchState>(context, listen: false);
    return Container(
      height: 20,
      color: Colors.grey.shade200,
      width: double.maxFinite,
      child: SingleChildScrollView(
        scrollDirection: Axis.horizontal,
        child: Row(children: [
          const SizedBox(
            width: 15,
          ),
          Row(
            children: [
              InkWell(
                onTap: () {
                  productsSearchState.searchFromTag = 'nikon';
                },
                // focusColor: Colors.blue,
                // radius: 10,
                // highlightColor: Colors.blue,
                child: Container(
                  height: 20,
                  // color: Colors.amber.shade700,
                  padding:
                      const EdgeInsets.symmetric(horizontal: 5, vertical: 2),
                  decoration: BoxDecoration( 
                    color: Colors.grey.shade800,                   
                    borderRadius: BorderRadius.circular(5),
                  ),
                  child: Text(
                    'Nikon',
                    style: theme.textTheme.labelMedium?.copyWith(fontSize: 14, color: Colors.white),
                  ),
                ),
              ),
              InkWell(
                child: Icon(
                  Icons.close,
                  size: 18,
                ),
                onTap: () {},
              )
            ],
          )
        ]),
      ),
    );
  }
}
