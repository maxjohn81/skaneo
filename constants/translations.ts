export type Language = "fr" | "mg";

export const LANGUAGE_STORAGE_KEY = "skaneo_language";
export const DEFAULT_LANGUAGE: Language = "fr";

export const translations = {
  fr: {
    scanner_batch_executing: "Crédit",
    scanner_batch_next_in: "suivant dans",
    scanner_batch_seconds: "s",


    terms_header_title: "Conditions d'utilisation",
    terms_checkbox_label: "J'ai lu et j'accepte les conditions d'utilisation de Skaneo.",
    terms_continue_button: "Continuer",
    terms_loading: "Chargement...",

    scanner_multiscan_badge: "Mode multiscan",

    // Language select
    language_select_title: "Bienvenue sur Skaneo",
    language_select_subtitle: "Choisis ta langue",
    language_select_continue: "Continuer",


    // Accueil
    home_tagline: "Simplifiez vos opérations mobiles",
    home_scan_title: "Scanner une carte",
    home_scan_description: "Scannez votre carte à gratter et rechargez facilement.",
    home_scan_button: "Scanner une carte",
    home_withdraw_title: "Faire un retrait",
    home_withdraw_description: "Retirez de l'argent facilement sans composer de code.",
    home_withdraw_button: "Faire un retrait",
    home_footer: "© 2026 Skaneo. Tous droits réservés.",

    // Menu
    menu_settings: "Paramètres",
    menu_about: "À propos",

    // Paramètres
    settings_title: "Paramètres",
    settings_language: "Langue",
    settings_multiscan_title: "Scan multiple",
    settings_multiscan_description:
      "Reprend automatiquement le scan après chaque carte, pour en recharger plusieurs à la suite sans revenir à l'accueil.",
    settings_multiscan_count: "Nombre de cartes par session",

    // Scanner
    scanner_status_scanning: "Scan en cours",
    scanner_status_detected: "Carte détectée",
    scanner_permission_title: "Accès à la caméra requis",
    scanner_permission_subtitle:
      "Nous avons besoin de la caméra pour scanner ta carte automatiquement",
    scanner_permission_button: "Autoriser la caméra",
    scanner_import_label: "Importer",
    scanner_digits_label: "Numéro détecté",
    scanner_rescan_button: "Scanner une autre carte",

    // Retrait
    withdraw_title: "Faire un retrait",
    withdraw_security_title: "Vos opérations sont sécurisées.",
    withdraw_security_text: "Aucun code secret n'est stocké dans l'application.",
    withdraw_operator_label: "Opérateur",
    withdraw_number_label: "Numéro destinataire",
    withdraw_number_helper: "Entrez le numéro du destinataire.",
    withdraw_amount_label: "Montant",
    withdraw_amount_helper: "Entrez le montant à retirer.",
    withdraw_submit_button: "Retrait",
    // Withdraw
    withdraw_placeholder_number: "034 XX XXX XX",
    withdraw_placeholder_amount: "0 Ar",
    withdraw_ios_title: "Non disponible sur iOS",
    withdraw_ios_text: "L'exécution directe des codes USSD n'est pas autorisée par Apple sur cette plateforme.",
    withdraw_error_title: "Erreur",
    withdraw_error_text: "Impossible d'exécuter l'opération.",

    // Withdraw permission
    withdraw_permission_title_screen: "Autorisation d'appel requise",
    withdraw_permission_description:
      "Pour préparer votre retrait, Skaneo a besoin d'exécuter directement l'opération USSD auprès de votre opérateur. Aucune donnée n'est stockée : votre code secret reste géré uniquement par l'opérateur.",
    withdraw_permission_denied_note:
      "L'autorisation a été refusée. Tu peux réessayer, ou l'activer manuellement dans les réglages de l'appareil.",
    withdraw_permission_authorize_button: "Autoriser l'appel",



    // About
    about_title: "À propos",
    about_description:
      "Skaneo simplifie tes opérations mobiles du quotidien : recharge de crédit par scan de carte, et retrait Mobile Money sans code USSD à mémoriser. Fini les erreurs de saisie et la perte de temps.",
    about_features_section: "Fonctionnalités",
    about_feature_scan_title: "Scan instantané",
    about_feature_scan_desc: "Détecte automatiquement ta carte à gratter en quelques secondes",
    about_feature_withdraw_title: "Retrait Mobile Money",
    about_feature_withdraw_desc: "Effectue un retrait sans mémoriser ni composer de code USSD",
    about_feature_secure_title: "100% sécurisé",
    about_feature_secure_desc: "Ton code secret n'est jamais demandé, stocké ou transmis par Skaneo",
    about_feature_multi_title: "Multi-opérateurs",
    about_feature_multi_desc: "Compatible avec Yas, Orange et Airtel",
    about_operators_section: "Opérateurs pris en charge",
    about_contact: "Nous contacter",
    about_shortcuts: "Raccourcis",
    about_footer: "© 2026 Skaneo. Tous droits réservés.",
    about_secret_unlocked_title: "Raccourcis activés ",
    about_secret_unlocked_text: "L'accès aux raccourcis est maintenant visible dans cette page.",
    about_secret_locked_title: "Raccourcis masqués",
    about_secret_locked_text: "L'accès aux raccourcis a été masqué.",

    // Secret / Raccourcis
    secret_title: "Raccourcis",
    secret_ios_title: "Non disponible sur iOS",
    secret_ios_text: "L'exécution directe des codes USSD n'est pas autorisée par Apple sur cette plateforme.",
    secret_permission_denied_title: "Permission refusée",
    secret_permission_denied_text: "Skaneo ne peut pas exécuter ce code sans l'autorisation d'appel.",
    secret_executed_title: "Code exécuté ",
    secret_error_title: "Erreur",
    secret_error_text: "Impossible d'exécuter ce code.",
  },

  mg: {
    scanner_batch_executing: "Crédit",
    scanner_batch_next_in: "manaraka afaka",
    scanner_batch_seconds: "s",


    terms_header_title: "Fepetra fampiasana",
    terms_checkbox_label: "Efa novakiako sy ekeko ny fepetra fampiasana an'i Skaneo.",
    terms_continue_button: "Manohy",
    terms_loading: "Miandry...",

    scanner_multiscan_badge: "Fomba multiscan",


    // Language select
    language_select_title: "Tongasoa eto amin'i Skaneo",
    language_select_subtitle: "Safidio ny fiteninao",
    language_select_continue: "Manohy",


    // Accueil
    home_tagline: "Manatsotra ny asa finday ataonao",
    home_scan_title: "Manaova scan crédit",
    home_scan_description: "Skaneo amin'ny fomba tsotra ny crédit nao",
    home_scan_button: "Manaova scan crédit",
    home_withdraw_title: "Manao retrait",
    home_withdraw_description: "Ataovy amin'ny fomba tsotra sady aingana ny retrait izay ho ataonao",
    home_withdraw_button: "Manao retrait",
    home_footer: "© 2026 Skaneo. Tous droits réservés.",

    // Menu
    menu_settings: "Fandrindrana",
    menu_about: "Momba anay",

    // Paramètres
    settings_title: "Fandrindrana",
    settings_language: "Fiteny",
    settings_multiscan_title: "Scan maromaro",
    settings_multiscan_description:
      "Manohy scan avy hatrany rehefa avy nandray crédit iray, mba hahafahana mamerina karatra maromaro.",
    settings_multiscan_count: "Isan'ny karatra isaky ny fotoana",

    // Scanner
    scanner_status_scanning: "Mandeha ny scan",
    scanner_status_detected: "Hita ny crédit",
    scanner_permission_title: "Ilaina ny fidirana amin'ny kamera",
    scanner_permission_subtitle:
      "Ilaina ny kamera mba hahafahana mizaha ny crédit",
    scanner_permission_button: "Alefaso ny kamera",
    scanner_import_label: "Ampidiro",
    scanner_digits_label: "Nomerao hita",
    scanner_rescan_button: "Mizaha crédit hafa",

    // Retrait
    withdraw_title: "Manaisotra vola",
    withdraw_security_title: "Voaaro ny fikarohanao.",
    withdraw_security_text: "Tsy misy kaody miafina voatahiry ao amin'ny rindrankajy.",
    withdraw_operator_label: "Opérateurs",
    withdraw_number_label: "Laharana mpandray",
    withdraw_number_helper: "Ampidiro ny laharan'ny mpandray.",
    withdraw_amount_label: "Vola",
    withdraw_amount_helper: "Ampidiro ny vola halaina.",
    withdraw_submit_button: "Retrait",
    // Withdraw
    withdraw_placeholder_number: "034 XX XXX XX",
    withdraw_placeholder_amount: "0 Ar",
    withdraw_ios_title: "Tsy azo atao amin'ny iOS",
    withdraw_ios_text: "Tsy avelan'i Apple ny fandefasana kaody USSD mivantana amin'ity rindrankajy ity.",
    withdraw_error_title: "Nisy olana",
    withdraw_error_text: "Tsy afaka mandefa ny asa.",

    // Withdraw permission
    withdraw_permission_title_screen: "Ilaina ny fahazoan-dalana antso",
    withdraw_permission_description:
      "Mba hanomanana ny retrait, ilaina ny handefasan'i Skaneo mivantana ny asa USSD any amin'ny Opérateurs izay ho ampiasainao. Tsy misy angona voatahiry: ny kaody miafinao dia ny Opérateurs ihany no mitantana azy.",
    withdraw_permission_denied_note:
      "Nolavina ny fahazoan-dalana. Azonao averina, na alefaso manokana ao amin'ny fandrindrana ny fitaovana.",
    withdraw_permission_authorize_button: "Alefaso ny antso",


    // About
    about_title: "Momba anay",
    about_description:
      "Manatsotra ny asa finday ataonao isanandro i Skaneo: famerenana crédit amin'ny alalan'ny scan karatra, ary retrait Mobile Money tsy ilàna kaody USSD tsaroana. Tsy misy diso fanoratana intsony na fandaniana fotoana.",
    about_features_section: "Ny asa vitany",
    about_feature_scan_title: "Scan haingana",
    about_feature_scan_desc: "Mahita ho azy ny crédit amin'ny segondra vitsivitsy",
    about_feature_withdraw_title: "Retrait Mobile Money",
    about_feature_withdraw_desc: "Retrait tsy ilàna fitadidiana na fanoratana kaody USSD",
    about_feature_secure_title: "100% voaaro",
    about_feature_secure_desc: "Tsy angatahin'i Skaneo, tsy voatahiry ary tsy alefany mihitsy ny kaody miafinao",
    about_feature_multi_title: "Opérateurs maromaro",
    about_feature_multi_desc: "Mifanaraka amin'i Yas, Orange ary Airtel",
    about_operators_section: "Opérateurs ekena",
    about_contact: "Mifandray aminay",
    about_shortcuts: "Fandalinana haingana",
    about_footer: "© 2026 Skaneo. Tous droits réservés.",
    about_secret_unlocked_title: "Fandalinana haingana miasa ",
    about_secret_unlocked_text: "Hita ao amin'ity pejy ity izao ny fidirana amin'ny fandalinana haingana.",
    about_secret_locked_title: "Fandalinana haingana miafina",
    about_secret_locked_text: "Voafina ny fidirana amin'ny fandalinana haingana.",

    // Secret / Raccourcis
    secret_title: "Fandalinana haingana",
    secret_ios_title: "Tsy azo atao amin'ny iOS",
    secret_ios_text: "Tsy avelan'i Apple ny fandefasana kaody USSD mivantana amin'ity rindrankajy ity.",
    secret_permission_denied_title: "Fahazoan-dalana nolavina",
    secret_permission_denied_text: "Tsy afaka mandefa ity kaody ity i Skaneo raha tsy misy fahazoan-dalana antso.",
    secret_executed_title: "Kaody nalefa ",
    secret_error_title: "Nisy olana",
    secret_error_text: "Tsy afaka mandefa ity kaody ity.",
  },
};