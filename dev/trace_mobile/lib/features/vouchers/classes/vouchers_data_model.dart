class VouchersDataModel {
  final int index, tranTypeId;
  final String accName, autoRefNo, tranDate, tranType;
  final String? instrNo, lineRefNo, lineRemarks, remarks, tags, userRefNo;
  final double credit, debit;

  VouchersDataModel({
    required this.accName,
    required this.autoRefNo,
    required this.credit,
    required this.debit,
    required this.index,
    required this.instrNo,
    required this.lineRefNo,
    required this.lineRemarks,
    required this.remarks,
    required this.tags,
    required this.tranDate,
    required this.tranType,
    required this.tranTypeId,
    required this.userRefNo,
  });

  factory VouchersDataModel.fromJson({required Map<String, dynamic> j}) {
    return VouchersDataModel(
        accName: j['accName'],
        autoRefNo: j['autoRefNo'],
        credit: j['credit'],
        debit: j['debit'],
        index: j['index'],
        instrNo: j['instrNo'],
        lineRefNo: j['lineRefNo'],
        lineRemarks: j['lineRemarks'],
        remarks: j['remarks'],
        tags: j['tags'],
        tranDate: j['tranDate'],
        tranType: j['tranType'],
        tranTypeId: j['tranTypeId'],
        userRefNo: j['userRefNo']);
  }
}
