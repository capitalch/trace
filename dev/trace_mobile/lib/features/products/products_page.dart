import 'package:flutter/material.dart';

class ProductsPage extends StatelessWidget {
  const ProductsPage({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return Scaffold(
        appBar: AppBar(
      // backgroundColor: Colors.grey.shade400,
      title: Container(
        width: double.infinity,
        height: 40,
        // decoration: BoxDecoration(
        //     color: Colors.white, borderRadius: BorderRadius.circular(5)),
        child: Row(
          children: [
            Text('Products', style: Theme.of(context).textTheme.headline6,),
            SizedBox(width: 10,),
            Expanded(
                child: Container(
              decoration: BoxDecoration(
                  color: Colors.white, borderRadius: BorderRadius.circular(5)),
              child: TextField(
                decoration: InputDecoration(
                    prefixIcon: Icon(Icons.search),
                    suffixIcon: IconButton(
                      icon: Icon(Icons.clear),
                      onPressed: () {},
                    ),
                    hintText: 'Product search...',
                    border: InputBorder.none),
              ),
            ))
          ],
        ),

        // Center(
        //   child:
        // ))

        //     Row(
        //   mainAxisAlignment: MainAxisAlignment.spaceBetween,
        //   children: [
        //     Text(
        //       'Products',
        //       style: Theme.of(context).textTheme.headline6,
        //     ),
        //     // TextField()
        //   ],
        // )
      ),
    ));
  }
}
