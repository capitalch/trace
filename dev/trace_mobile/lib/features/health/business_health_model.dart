class BusinessHealthModel {
  final int profitLoss;
  final StockDiffModel stockDiff;

  BusinessHealthModel({required this.profitLoss, required this.stockDiff});

  factory BusinessHealthModel.fromJson({required Map<String, dynamic> j}) {
    return BusinessHealthModel(
        profitLoss: j['profitLoss'],
        stockDiff: StockDiffModel.fromJson(j: j['stockDiff']));
  }
}

class StockDiffModel {
  final int diff;
  final int diffGst;

  StockDiffModel({required this.diff, required this.diffGst});
  factory StockDiffModel.fromJson({required Map<String, dynamic> j}) {
    return StockDiffModel(diff: j['diff']??0, diffGst: j['diffGst']??0);
  }
}
