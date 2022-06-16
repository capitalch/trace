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
      'salesQueryKey': 'minusOneDay',
      'startDate': DateTime.now().subtract(const Duration(days: 1)),
      'endDate': DateTime.now().subtract(const Duration(days: 1)),
      'title': "Sale of (-1) day",
      'labelName': '(-1) day'
    },
    {
      'salesQueryKey': 'minusTwoDay',
      'startDate': DateTime.now().subtract(const Duration(days: 2)),
      'endDate': DateTime.now().subtract(const Duration(days: 2)),
      'title': "Sale of (-2) day",
      'labelName': '(-2) day'
    },
    {
      'salesQueryKey': 'minusThreeDay',
      'startDate': DateTime.now().subtract(const Duration(days: 3)),
      'endDate': DateTime.now().subtract(const Duration(days: 3)),
      'title': "Sale of (-2) day",
      'labelName': '(-3) day'
    },
    {
      'salesQueryKey': 'thisMonth',
      'startDate': Utils.getStartDateOfMonth(),
      'endDate': Utils.getEndDateOfMonth(),
      'title': "This month",
      'labelName': 'This month'
    },
    {
      'salesQueryKey': 'minusOneMonth',
      'startDate': Utils.getStartDateOfMonth(monthNo: -1),
      'endDate': Utils.getEndDateOfMonth(monthNo: -1),
      'title': "(-1) month",
      'labelName': '(-1) month'
    },
  ];

  List<SalesQueryProps> getSalesQueryPropsList() {
    List<SalesQueryProps> tempList = _queryPropsList.map((e) {
      return SalesQueryProps.fromJson(e);
    }).toList();
    return tempList;
  }
}
