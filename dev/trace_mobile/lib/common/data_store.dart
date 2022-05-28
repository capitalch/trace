
import 'package:flutter_secure_storage/flutter_secure_storage.dart';

class DataStore {
  static setLoginData(String loginData) async {
    await const FlutterSecureStorage().write(key: 'loginData', value: loginData);
  }

  static getLoginData() async {
    var data = await const FlutterSecureStorage().read(key: 'loginData');
    return(data);
  }
}