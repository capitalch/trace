import 'package:flutter/material.dart';
import 'package:trace_mobile/common/classes/utils.dart';

class SalesQueryProps {
  late String _labelName, _salesQueryKey;
  late DateTime _startDate, _endDate;

  SalesQueryProps(
      // this._startDate, this._endDate, this._labelName, this._queryKey
      {startDate,
      endDate,
      labelName,
      salesQueryKey}) {
    _startDate = startDate;
    _endDate = endDate;
    _labelName = labelName;
    _salesQueryKey = salesQueryKey;
  }

  DateTime get startDate {
    return _startDate;
  }

  DateTime get endDate {
    return _endDate;
  }

  String get labelName {
    return _labelName;
  }

  String get salesQueryKey {
    return _salesQueryKey;
  }

  factory SalesQueryProps.fromJson(Map<String, dynamic> args) {
    return SalesQueryProps(
        startDate: args['startDate'],
        endDate: args['endDate'],
        labelName: args['labelName'],
        salesQueryKey: args['salesQueryKey']);
  }
}

class QueryProps {
  final List<Map<String, dynamic>> _queryPropsList = [
    {
      'salesQueryKey': 'today',
      'startDate': DateTime.now(),
      'endDate': DateTime.now(),
      'title': "Sale of today",
      'labelName': 'Today'
    },
    {
      'salesQueryKey': 'yesterday',
      'startDate': DateTime.now().subtract(const Duration(days: 1)),
      'endDate': DateTime.now().subtract(const Duration(days: 1)),
      'title': "Sale of yesterday",
      'labelName': 'Yesterday'
    },
  ];

  List<SalesQueryProps> getSalesQueryPropsList() {
    List<SalesQueryProps> tempList = _queryPropsList.map((e) {
      return SalesQueryProps.fromJson(e);
    }).toList();
    return tempList;
  }
}
