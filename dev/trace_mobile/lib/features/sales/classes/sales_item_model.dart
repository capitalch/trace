class SalesItemModel {
  SalesItemModel({
    required this.accounts,
    required this.age,
    required this.aggrSale,
    required this.amount,
    required this.autoRefNo,
    required this.brandName,
    required this.catName,
    required this.cgst,
    required this.grossProfit,
    required this.gstRate,
    required this.igst,
    required this.info,
    required this.label,
    required this.lastPurchaseDate,
    required this.price,
    required this.qty,
    required this.saleType,
    required this.sgst,
    required this.stock,
  });

  factory SalesItemModel.fromJson({required Map<String, dynamic> j}) {
    return SalesItemModel(
      accounts: j['accounts'],
      age: double.parse((j['age'] ?? 0).toString()),
      aggrSale: double.parse(j['aggrSale'].toString()),
      amount: double.parse(j['amount'].toString()),
      autoRefNo: j['autoRefNo'],
      brandName: j['brandName'],
      catName: j['catName'],
      cgst: double.parse(j['cgst'].toString()),
      grossProfit: double.parse(j['grossProfit'].toString()),
      gstRate: double.parse(j['gstRate'].toString()),
      igst: double.parse(j['igst'].toString()),
      info: j['info'],
      label: j['label'],
      lastPurchaseDate: j['lastPurchaseDate'],
      price: double.parse(j['price'].toString()),
      qty: double.parse(j['qty'].toString()),
      saleType: j['saleType'],
      sgst: double.parse(j['sgst'].toString()),
      stock: double.parse(j['stock'].toString()),
    );
  }
  final String accounts;
  final double age;
  final double aggrSale;
  final double amount;
  final String autoRefNo;
  final String brandName;
  final String catName;
  final double cgst;
  final double grossProfit;
  final double gstRate;
  final double igst;
  final String? info;
  final String label;
  final String lastPurchaseDate;
  final double price;
  final double qty;
  final String saleType;
  final double sgst;
  final double stock;
}
