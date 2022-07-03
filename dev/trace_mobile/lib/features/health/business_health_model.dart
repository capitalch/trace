class BusinessHealthModel {
  final int profitLoss;
  final StockDiffModel stockDiff;
  final OpeningClosingStockModel openingClosingStock;
  final List<dynamic> trialBalance;

  BusinessHealthModel({
    required this.profitLoss,
    required this.stockDiff,
    required this.openingClosingStock,
    required this.trialBalance,
  });

  factory BusinessHealthModel.fromJson({required Map<String, dynamic> j}) {
    return BusinessHealthModel(
        profitLoss: j['profitLoss'],
        stockDiff: StockDiffModel.fromJson(j: j['stockDiff']),
        openingClosingStock:
            OpeningClosingStockModel.fromJson(j: j['openingClosingStock']),
        trialBalance: j['trialBalance']);
  }
}

class OpeningClosingStockModel {
  final int openingValue;
  final int openingValueWithGst;
  final int closingValue;
  final int closingValueWithGst;

  OpeningClosingStockModel(
      {required this.openingValue,
      required this.openingValueWithGst,
      required this.closingValue,
      required this.closingValueWithGst});

  factory OpeningClosingStockModel.fromJson({required Map<String, dynamic> j}) {
    return OpeningClosingStockModel(
        openingValue: j['openingValue'],
        openingValueWithGst: j['openingValueWithGst'],
        closingValue: j['closingValue'],
        closingValueWithGst: j['closingValueWithGst']);
  }
}

class StockDiffModel {
  final int diff;
  final int diffGst;

  StockDiffModel({required this.diff, required this.diffGst});
  factory StockDiffModel.fromJson({required Map<String, dynamic> j}) {
    return StockDiffModel(diff: j['diff'] ?? 0, diffGst: j['diffGst'] ?? 0);
  }
}
