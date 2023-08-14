export class AppConfig {
  public static siteName = 'Smarter Wallet';
  public static secretPassword = 'ploy';

  public static menu = [
    {
      text: 'Wallet',
      icon: 'wallet',
      to: '/',
      loggedIn: false
    },
    {
      text: 'Apps',
      icon: 'apps',
      to: '/apps',
      loggedIn: false
    },
    {
      text: 'Settings',
      icon: 'portrait',
      to: '/settings',
      loggedIn: false
    },
  ];
}