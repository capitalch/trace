class TrialBalanceNode {
  final Data data;
  List<TrialBalanceNode>? children;

  TrialBalanceNode({required this.data, this.children});
}

class Data {
  final String accName;
  final double opening;
  final String openingDC;
  final double debits;
  final double credits;
  final double closing;
  final String closingDC;

  Data(
      {required this.accName,
      required this.opening,
      required this.openingDC,
      required this.debits,
      required this.credits,
      required this.closing,
      required this.closingDC});

  factory Data.fromJson({j}) {
    return Data(
        accName: j['accName'],
        opening: j['opening'],
        openingDC: j['openingDC'],
        debits: j['debits'],
        credits: j['credits'],
        closing: j['closing'],
        closingDC: j['closingDC']);
  }
}
