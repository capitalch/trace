class GraphQLQueries {
  static var login = (String credentials) => '''query login {
         authentication {
         doLogin(credentials:"$credentials")
        }}''';
}