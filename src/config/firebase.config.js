import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
const firebaseConfig = {
  apiKey: 'AIzaSyDMjbtUXqHImQsha-KienHYanHlNnOuZ-4',
  authDomain: 'house-marketplace-216a9.firebaseapp.com',
  projectId: 'house-marketplace-216a9',
  storageBucket: 'house-marketplace-216a9.appspot.com',
  messagingSenderId: '278718831570',
  appId: '1:278718831570:web:111aeb7511de8bec4d860b',
};

initializeApp(firebaseConfig);
export const db = getFirestore();
