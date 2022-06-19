import 'package:flutter/material.dart';
import 'package:flutter_simple_treeview/flutter_simple_treeview.dart';

class SimpleTreeView extends StatefulWidget {
  const SimpleTreeView({Key? key}) : super(key: key);

  @override
  State<SimpleTreeView> createState() => _SimpleTreeViewState();
}

class _SimpleTreeViewState extends State<SimpleTreeView> {
  final Key _key = const ValueKey(22);
  final TreeController _controller = TreeController(allNodesExpanded: true);

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Simple tree view')),
      body: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [SizedBox(height: 300, width: 300, child: buildTree())]),
    );
  }

  Widget buildTree() {
    return TreeView(treeController: _controller, nodes: [
      TreeNode(content: const Text('node 1')),
      TreeNode(content: const Icon(Icons.audiotrack), children: [
        TreeNode(content: const Text("node 21")),
        TreeNode(
          content: const Text("node 22"),
          key: _key,
          children: [
            TreeNode(
              content: const Icon(Icons.sentiment_very_satisfied),
            ),
          ],
        ),
        TreeNode(
          content: const Text("node 23"),
        ),
      ])
    ]);
  }
}
