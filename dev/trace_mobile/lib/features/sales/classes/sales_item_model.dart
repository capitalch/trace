class SalesItemModel {
  SalesItemModel({
    required age,
    required brandName,
    required catName,
    required stock,
    required info,
    required label,
    required qty,
    required aggrSale,
    required cgst,
    required sgst,
    required igst,
    required amount,
    required grossProfit,
    required lastPurchaseDate,
    // required this.mrp,
    // required this.pur,
    // required this.purGst,
    // required this.salGst,
    // required this.ytd,
  });

  factory SalesItemModel.fromJson({required Map<String, dynamic> j}) {
    return SalesItemModel(
        age: (j['age'] ?? 0).toString(),
        brandName: j['brandName'],
        catName: j['catName'],
        stock: double.parse(j['stock'].toString()),
        info: j['info'],
        label: j['label']);
  }

  final double age;
  final String brandName;
  final String catName;
  final double stock;
  final String? info;
  final String label;

  final double qty;
  final double aggrSale;
  final double cgst;
  final double sgst;
  final double igst;
  final double amount;
  final double grossProfit;
  final String lastPurchaseDate;

  // final double mrp;
  // final double pur;
  // final double purGst;
  // final double salGst;
  // final double ytd;
}
