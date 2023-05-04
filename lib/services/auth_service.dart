import 'package:flutter/material.dart';
import 'package:flutter_catalog/constants/global_variables.dart';
import 'package:flutter_catalog/constants/utils.dart';

import '../constants/error_handling.dart';
import '../models/user.dart';
import 'package:http/http.dart' as http;

class AuthService {
  //Sign up user

  void signUpUser({
    required BuildContext context,
    required String email,
    required String password,
    required String name,
  }) async {
    try {
      User user = User(
        id: '',
        name: name,
        email: email,
        password: password,
        address: '',
        type: '',
        token: '',
      );

      http.Response res = await http.post(
        Uri.parse('http://192.168.1.5/api/signup'),
        body: user.toJson(),
        headers: <String, String>{
          'Content-Type': 'application/json; charset=UTF-8',
        },
      );

      httpErrorHandle(
        response: res,
        context: context,
        onSuccess: () {
          ShowSnackBar(
              context, 'Account Created! Login with the same credentials');
        },
      );
    } catch (e) {
      ShowSnackBar(
        context,
        e.toString(),
      );
    }
  }
}
