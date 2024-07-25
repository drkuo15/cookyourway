import { initializeApp } from 'firebase/app';
import {
  getFirestore, doc, setDoc, collection,
  query, where, getDocs, onSnapshot,
  getDoc, updateDoc,
} from 'firebase/firestore';
import {
  getStorage, getDownloadURL, uploadBytes, ref,
} from 'firebase/storage';
import {
  getAuth, onAuthStateChanged, createUserWithEmailAndPassword,
  signInWithEmailAndPassword, setPersistence, browserSessionPersistence,
  signOut,
} from 'firebase/auth';
import type { User as FirebaseUser } from 'firebase/auth';
import type { NavigateFunction } from 'react-router-dom';
import { Recipe } from '../types/Recipe';
import { User } from '../types/User';

export const firebaseApp = initializeApp({
  apiKey: process.env.REACT_APP_FIREBASE_APIKEY,
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
  measurementId: process.env.REACT_APP_FIREBASE_MEASUREMENT_ID,
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_FIREBASE_APP_ID,
});

export const db = getFirestore(firebaseApp);

export const storage = getStorage();

export const auth = getAuth(firebaseApp);

const recipeRef = collection(db, 'recipes');

export const recipeDoc = doc(collection(db, 'recipes'));

export const changeUserDataOnAuthState = async (setUserInfo: (user: User | null) => void) => {
  onAuthStateChanged(auth, (FirebaseUser: FirebaseUser) => {
    if (FirebaseUser) {
      const { uid } = FirebaseUser;
      const userRef = doc(db, 'users', uid);
      const getUserData = async () => {
        const docSnap = await getDoc(userRef);
        return docSnap.data();
      };
      getUserData().then((data) => {
        setUserInfo(data as User);
      });
    } else {
      setUserInfo(null);
    }
  });
};

interface StateChangeCallback {
  setCheckingUser: (value: boolean) => void;
  navigate: NavigateFunction;
}
export const handleAuthStateChange = async ({ setCheckingUser, navigate }: StateChangeCallback) => {
  onAuthStateChanged(auth, (FirebaseUser: FirebaseUser) => {
    if (FirebaseUser) {
      setCheckingUser(false);
    } else {
      navigate({ pathname: '/login' });
    }
  });
};

export const registerUser = async (email: string, password: string, name: string) => {
  const result = await createUserWithEmailAndPassword(
    auth,
    email,
    password,
  );
  await setDoc(doc(db, 'users', result.user.uid), {
    uid: result.user.uid,
    name,
    email,
    myFavorites: [],
  });
};

export const loginUser = async (email: string, password: string) => {
  await setPersistence(auth, browserSessionPersistence);
  await signInWithEmailAndPassword(auth, email, password);
};

export const signOutUser = () => {
  signOut(auth);
};

export const getAllRecipes = async () => {
  let queryDataArray: Recipe[] = [];
  await getDocs(recipeRef).then((querySnapshot) => {
    querySnapshot.forEach(
      (document) => {
        queryDataArray = [...queryDataArray, document.data() as Recipe];
      },
    );
  });
  return queryDataArray;
};

export const getUserRecipes = async (userId: string) => {
  const q = query(recipeRef, where('authorId', '==', userId));
  let queryDataArray: Recipe[] = [];
  await getDocs(q).then((querySnapshot) => {
    querySnapshot.forEach(
      (document) => {
        queryDataArray = [...queryDataArray, document.data() as Recipe];
      },
    );
  });
  return queryDataArray;
};

export const getAverageDifficulty = async (userId: string) => {
  const q = query(recipeRef, where('authorId', '==', userId));
  let queryDifficultyArray: Recipe['difficulty'][] = [];
  let avg = 0;
  await getDocs(q).then((querySnapshot) => {
    querySnapshot.forEach(
      (document) => {
        queryDifficultyArray = [...queryDifficultyArray, document.data().difficulty];
      },
    );
    const sum = queryDifficultyArray.reduce((cur, acc) => cur + acc, 0);
    avg = sum / queryDifficultyArray.length;
  });
  return avg;
};

export const getRecommendRecipes = async (userId: string, averageDifficulty: number) => {
  const q = query(recipeRef, where('difficulty', '>=', averageDifficulty));
  let queryRecipeArray: Recipe[] = [];
  await getDocs(q).then((querySnapshot) => {
    querySnapshot.forEach(
      (document) => {
        queryRecipeArray = [...queryRecipeArray, document.data() as Recipe];
      },
    );
  });
  return queryRecipeArray.filter((recipe) => recipe.authorId !== userId);
};

export const onUserSnapshot = (userId: string, callback: (data: User['myFavorites']) => void) => {
  const UserRef = doc(db, 'users', userId);
  return onSnapshot(
    UserRef,
    (document) => {
      const userData = document.data() as User;
      callback(userData.myFavorites);
    },
  );
};

export const onRecipeSnapshot = (
  currentRecipeId: string,
  callback: (data: Recipe) => void,
  ...keys: string[]
) => {
  const RecipeRef = doc(db, 'recipes', currentRecipeId);
  return onSnapshot(
    RecipeRef,
    (document) => {
      const data = document.data() as Recipe;
      const completeData = { ...data };
      if (keys) {
        keys.forEach((key) => {
          if (key === 'defaultTitle') {
            completeData[key] = data.title;
          }
        });
      }
      callback(completeData);
    },
  );
};
export const getCurrentData = async (currentRecipeId: string) => {
  const docRef = doc(db, 'recipes', currentRecipeId);
  const docSnap = await getDoc(docRef);
  return docSnap.data();
};

export const uploadImg = async (img: File, folder: string) => {
  const imgRef = ref(
    storage,
    `${folder}/${new Date().getTime()} - ${img.name}`,
  );
  const snap = await uploadBytes(imgRef, img);
  const url = await getDownloadURL(ref(storage, snap.ref.fullPath));
  return {
    mainImage: url,
    mainImagePath: snap.ref.fullPath,
  };
};

export const setRecipeDoc = async (docId: string, newRecipeData: Recipe) => {
  setDoc(doc(db, 'recipes', docId), newRecipeData);
};

export const updateRecipeDoc = async (currentRecipeId: string, newRecipeData: Recipe) => {
  const currentRecipeRef = doc(db, 'recipes', currentRecipeId);
  updateDoc(currentRecipeRef, { ...newRecipeData });
};

export const getSearchArray = async (searchName: string) => {
  const searchNameArray = searchName.split('');
  const q = query(recipeRef, where('titleKeywords', 'array-contains', searchNameArray[0]));
  let queryDataArray: Recipe[] = [];
  await getDocs(q).then((querySnapshot) => {
    if (!querySnapshot.empty) {
      querySnapshot.forEach(
        (document) => {
          if (document.data().title.includes(searchName)) {
            queryDataArray = [...queryDataArray, document.data() as Recipe];
          }
        },
      );
    }
  });
  return queryDataArray;
};

export const updateUserDoc = async (userId: string, updatedMyFavorite: User['myFavorites']) => {
  const UserRef = doc(db, 'users', userId);
  updateDoc(UserRef, { myFavorites: updatedMyFavorite });
};
