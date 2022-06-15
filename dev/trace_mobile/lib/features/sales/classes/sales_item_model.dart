class SalesItemModel {
  SalesItemModel({
    required this.age,
    required this.brandName,
    required this.catName,
    required this.stock,
    required this.info,
    required this.label,
    required this.qty,
    required this.aggrSale,
    required this.cgst,
    required this.sgst,
    required this.igst,
    required this.amount,
    required this.grossProfit,
    required this.lastPurchaseDate,
    required this.price,
    required this.saleType,
    required this.accounts,
    required this.autoRefNo,
    required this.gstRate,
    // required this.mrp,
    // required this.pur,
    // required this.purGst,
    // required this.salGst,
    // required this.ytd,
  });

  factory SalesItemModel.fromJson({required Map<String, dynamic> j}) {
    return SalesItemModel(
      age: double.parse((j['age'] ?? 0).toString()),
      brandName: j['brandName'],
      catName: j['catName'],
      stock: double.parse(j['stock'].toString()),
      info: j['info'],
      label: j['label'],
      qty: double.parse(j['qty'].toString()),
      aggrSale: double.parse(j['aggrSale'].toString()),
      cgst: double.parse(j['cgst'].toString()),
      sgst: double.parse(j['sgst'].toString()),
      igst: double.parse(j['igst'].toString()),
      amount: double.parse(j['amount'].toString()),
      grossProfit: double.parse(j['grossProfit'].toString()),
      lastPurchaseDate: j['lastPurchaseDate'],
      price: double.parse(j['price'].toString()),
      saleType: j['saleType'],
      accounts: j['accounts'],
      autoRefNo: j['autoRefNo'],
      gstRate: double.parse(j['gstRate'].toString()),
    );
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
  final double price;
  final String saleType;
  final String accounts;
  final String autoRefNo;
  final double gstRate;
}
