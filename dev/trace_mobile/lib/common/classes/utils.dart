import 'dart:convert';

class Utils {
  static int getCurrentFinYearId() {
    int month = DateTime.now().month;
    int year = DateTime.now().year;
    if ([1, 2, 3].contains(month)) {
      year = year - 1;
    }
    return (year);
  }

  static bool isValidJson(String? j) {
    bool ret = true;
    if (j == null) {
      ret = false;
    } else {
      try {
        json.decode(j);
      } catch (e) {
        ret = false;
      }
    }
    return (ret);
  }
}