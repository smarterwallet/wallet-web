import { SettingOutlined } from '@ant-design/icons';

const wwNavType = localStorage.getItem('wwNavType');

export class AppConfig {
  public static siteName = 'Smarter Wallet';
  public static secretPassword = 'ploy';

  public static menu = [
    {
      text: 'Wallet',
      icon: (
        <svg className="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg"
             p-id="4209" width="16" height="16">
          <path
            d="M773.5 595.5c-32.9 0-59.9-28.4-59.9-63 0-34.7 26.9-63 59.9-63H961v-52.4c0-33.8-26.2-61.4-58.3-61.4H250.1c-32.1 0-58.3 27.6-58.3 61.4v424c0 33.8 26.2 61.4 58.3 61.4h652.6c32.1 0 58.3-27.6 58.3-61.4V595.5H773.5z"
            p-id="4210"></path>
          <path d="M774.7 532.5m-41 0a41 41 0 1 0 82 0 41 41 0 1 0-82 0Z" p-id="4211"></path>
          <path
            d="M155.4 380.8c0-33.8 27.6-61.4 61.4-61.4h632.5l-53-154.7c-10.9-31.9-46-49.1-78-38.2L106.5 336.3c-31.9 10.9-49.1 46-38.2 78l87.1 254.1V380.8z"
            p-id="4212"></path>
        </svg>),
      to: '/',
      match: /^\/(home)?$/,
      loggedIn: false
    },
    wwNavType === '/apps' ?
      {
        text: 'Apps',
        icon: (
          <svg className="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg"
               p-id="6051" width="16" height="16">
            <path
              d="M960 288.32V768l-416.128 237.76V530.368L960 288.32zM64 291.776l415.872 238.72v475.2L64 768V291.776z m682.88-157.504l176.832 100.992L512 475.008 339.648 376.192l407.232-241.92zM512 0l170.944 97.728-407.488 241.6-178.368-102.272L512 0z"
              fill="#727272" p-id="6052"></path>
          </svg>
        ),
        to: '/apps',
        loggedIn: false
      }
    :
      {
        text: 'Demand',
        icon: (
          <svg className="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg"
               p-id="6051" width="16" height="16">
            <path
              d="M960 288.32V768l-416.128 237.76V530.368L960 288.32zM64 291.776l415.872 238.72v475.2L64 768V291.776z m682.88-157.504l176.832 100.992L512 475.008 339.648 376.192l407.232-241.92zM512 0l170.944 97.728-407.488 241.6-178.368-102.272L512 0z"
              fill="#727272" p-id="6052"></path>
          </svg>
        ),
        to: '/demand',
        loggedIn: false
      } ,
    {
      text: 'Settings',
      icon: <SettingOutlined rev={undefined}/>,
      to: '/settings',
      loggedIn: false
    },
  ];
}