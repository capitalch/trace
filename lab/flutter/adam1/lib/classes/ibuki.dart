

import 'package:rxdart/rxdart.dart';

class Ibuki {
  static BehaviorSubject<Map<String, dynamic>> subject = BehaviorSubject<Map<String, dynamic>>();

  static void emit(String id, dynamic data){
    subject.add({"id":id, "data": data});
  }

  static Stream<Map<String, dynamic>> filterOn(String id){
    return(subject.stream.where((d) => d['id'] == id));
  }

  static void debounceEmit(String id, dynamic data){
    subject.add({"id":id, "data": data});
  }

  static Stream<Map<String, dynamic>> debounceFilterOn(String id, {int debouncePeriod = 1000}){
    return(subject.stream.where((d) => d['id'] == id)).debounceTime(const Duration(seconds: 5));
  }

}