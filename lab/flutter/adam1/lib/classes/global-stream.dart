import 'dart:async';
import 'package:flutter/material.dart';

class GlobalStream extends ChangeNotifier {
  static StreamController<String> _streamController =
      StreamController.broadcast();

  static StreamController<String> get globalStreamController {
    return _streamController;
  }
}
