import firebase from 'firebase/app'

import 'firebase/auth'
import 'firebase/firestore'

const firebaseConfig = {
  apiKey: 'AIzaSyB9O5CW_R5Rx0Ado6dpM7KRtnQigQpLq8Q',
  authDomain: 'burri-ideas.firebaseapp.com',
  projectId: 'burri-ideas',
  storageBucket: 'burri-ideas.appspot.com',
  messagingSenderId: '329660798648',
  appId: '1:329660798648:web:28ece944640ea6ea95464d'
}

firebase.initializeApp(firebaseConfig)

const auth = firebase.auth()
const db = firebase.firestore()

export { auth, firebase, db }
