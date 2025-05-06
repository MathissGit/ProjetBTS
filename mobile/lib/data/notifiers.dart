import 'package:flutter/material.dart';
import 'package:mobile/data/models/cart_item.dart';

ValueNotifier<int> selectedPageNotifier = ValueNotifier(1);
ValueNotifier<bool> isDarkModeNotifier = ValueNotifier(true);

ValueNotifier<List<CartItem>> cartNotifier = ValueNotifier([]);
