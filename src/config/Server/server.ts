import Config from 'react-native-config';

let server: string;

server = Config.API_URL ?? 'https://contact.herokuapp.com/';

export {server};
