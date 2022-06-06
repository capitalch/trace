import 'package:flutter/material.dart';

class ProductsPage extends StatelessWidget {
  const ProductsPage({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
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
                      icon: const Icon(Icons.clear, size: 20, color: Colors.indigo),
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
