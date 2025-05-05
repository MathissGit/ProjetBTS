import 'package:flutter/material.dart';
import 'package:mobile/data/notifiers.dart';
import 'package:mobile/views/screens/cart_page.dart';
import 'package:mobile/views/screens/home_page.dart';
import 'package:mobile/views/screens/login_page.dart';
import 'package:mobile/views/screens/profil_page.dart';
import 'package:mobile/views/widgets/navbar_widget.dart';

class WidgetTree extends StatelessWidget {
  const WidgetTree({super.key});

  static final List<Widget> _pages = [CartPage(), HomePage(), ProfilPage(), LoginPage()];

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: ValueListenableBuilder<int>(
        valueListenable: selectedPageNotifier,
        builder: (context, selectedPage, _) {
          return IndexedStack(index: selectedPage, children: _pages);
        },
      ),
      bottomNavigationBar: const NavbarWidget(),
    );
  }
}
