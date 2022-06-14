class SalesQueryProps {
  late String _startDate, _endDate, _labelName, _salesQueryKey;

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

  String get startDate {
    return _startDate;
  }

  String get endDate {
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

class PropsList {
  final List<Map<String, String>> _queryPropsList = [
    {
      'salesQueryKey': 'today',
      'startDate': DateTime.now().toIso8601String(),
      'endDate': DateTime.now().toIso8601String(),
      'title': "Sale of today",
      'labelName': 'Today'
    },
    {
      'salesQueryKey': 'yesterday',
      'startDate':
          DateTime.now().subtract(const Duration(days: 1)).toIso8601String(),
      'endDate':
          DateTime.now().subtract(const Duration(days: 1)).toIso8601String(),
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
