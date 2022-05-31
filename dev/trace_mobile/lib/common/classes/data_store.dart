
import 'package:flutter_secure_storage/flutter_secure_storage.dart';

class DataStore {
  static setLoginDataInSecuredStorage(String loginDataJson) async {
    await const FlutterSecureStorage().write(key: 'loginData', value: loginDataJson);
  }

  static getLoginDataFromSecuredStorage() async {
    var data = await const FlutterSecureStorage().read(key: 'loginData');
    return(data);
  }
}