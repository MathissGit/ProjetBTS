import 'package:flutter/material.dart';
import 'package:mobile/data/notifiers.dart';
import 'package:mobile/views/widget_tree.dart';

class MyApp extends StatefulWidget {
  const MyApp({super.key});

  @override
  State<MyApp> createState() => _MyAppState();
}

class _MyAppState extends State<MyApp> {
  @override
  Widget build(BuildContext context) {
    return ValueListenableBuilder(
      valueListenable: isDarkModeNotifier,
      builder: (context, isDarkMode, child) {
        return MaterialApp(
          debugShowCheckedModeBanner: false,
          title: 'BrasserieTS',
          theme: ThemeData(
            colorScheme: ColorScheme.fromSeed(
              seedColor: Color.fromRGBO(0, 0, 0, 1),
              brightness: Brightness.light,
            ),
            useMaterial3: true,
          ),
          home: const WidgetTree(),
        );
      },
    );
  }
}
