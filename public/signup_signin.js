const firebaseConfig = {
    apiKey: "AIzaSyAv7mgwqdXjp0PuShQQbCw3zq7Fm486JCE",
    authDomain: "flood-tracker-cd993.firebaseapp.com",
    projectId: "flood-tracker-cd993",
    storageBucket: "flood-tracker-cd993.appspot.com",
    messagingSenderId: "84609017509",
    appId: "1:84609017509:web:48e043a5091d9221960f4c",
    measurementId: "G-XFXMH5J7P0"
};

// Initialize Firebase
const app = firebase.initializeApp(firebaseConfig);
//const analytics = getAnalytics(app);

const auth = firebase.auth();
const provider = new firebase.auth.GoogleAuthProvider();

const signInBtn = document.getElementById('signInBtn');

signInBtn.onclick = () => auth.signInWithPopup(provider);