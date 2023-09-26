// Essentials
import { initializeApp } from 'firebase/app';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: 'AIzaSyCTso5sFpxmbQXJFs73PZ5x1mvl1ukw-hY',
  authDomain: 'lounge-tungtr.firebaseapp.com',
  projectId: 'lounge-tungtr',
  storageBucket: 'lounge-tungtr.appspot.com',
  messagingSenderId: '1027130632845',
  appId: '1:1027130632845:web:22b0ff845ca54f367e50c4'
};

const app = initializeApp(firebaseConfig);
export const storage = getStorage(app);