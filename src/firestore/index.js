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
  getAuth, createUserWithEmailAndPassword,
  signInWithEmailAndPassword, setPersistence, browserSessionPersistence,
  signOut,
} from 'firebase/auth';

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

export const registerUser = async (email, password, name) => {
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

export const loginUser = async (email, password) => new Promise((resolve, reject) => {
  setPersistence(auth, browserSessionPersistence)
    .then(() => {
      signInWithEmailAndPassword(auth, email, password)
        .then(() => {
          resolve();
        })
        .catch((err) => {
          reject(err);
        });
    });
});

export const signOutUser = () => {
  signOut(auth);
};

export const getAllRecipes = async () => {
  let queryDataArray = [];
  await getDocs(recipeRef).then((querySnapshot) => {
    querySnapshot.forEach(
      (document) => {
        queryDataArray = [...queryDataArray, document.data()];
      },
    );
  });
  return queryDataArray;
};

export const getUserRecipes = async (userId) => {
  const q = query(recipeRef, where('authorId', '==', userId));
  let queryDataArray = [];
  await getDocs(q).then((querySnapshot) => {
    querySnapshot.forEach(
      (document) => {
        queryDataArray = [...queryDataArray, document.data()];
      },
    );
  });
  return queryDataArray;
};

export const getAverageDifficulty = async (userId) => {
  const q = query(recipeRef, where('authorId', '==', userId));
  let queryDifficultyArray = [];
  let avg;
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

export const getRecommendRecipes = async (userId, averageDifficulty) => {
  const q = query(recipeRef, where('difficulty', '>=', averageDifficulty));
  let queryRecipeArray = [];
  await getDocs(q).then((querySnapshot) => {
    querySnapshot.forEach(
      (document) => {
        queryRecipeArray = [...queryRecipeArray, document.data()];
      },
    );
  });
  return queryRecipeArray.filter((recipe) => recipe.authorId !== userId);
};

export const onUserSnapshot = (userId, callback) => {
  const UserRef = doc(db, 'users', userId);
  return onSnapshot(
    UserRef,
    (document) => {
      const userdata = document.data();
      callback(userdata.myFavorites);
    },
  );
};

export const onRecipeSnapshot = (currentRecipeId, callback, ...keys) => {
  const RecipeRef = doc(db, 'recipes', currentRecipeId);
  return onSnapshot(
    RecipeRef,
    (document) => {
      const data = document.data();
      const otherProperty = {};
      keys.forEach((key) => {
        if (key === 'oldTitle') {
          otherProperty[key] = data.title;
          return;
        }
        if (key === 'imgPath') {
          otherProperty[key] = data.mainImagePath;
          return;
        }
        otherProperty[key] = data[key];
      });
      callback({
        title: data.title,
        difficulty: data.difficulty,
        imgUrl: data.mainImage,
        ingredients: data.ingredients,
        steps: data.steps,
        comment: data.comment,
        authorId: data.authorId,
        ...otherProperty,
      });
    },
  );
};
export const getCurrentData = async (currentRecipeId) => {
  const docRef = doc(db, 'recipes', currentRecipeId);
  const docSnap = await getDoc(docRef);
  return docSnap.data();
};

export const uploadImg = async (img, folder) => {
  const imgRef = ref(
    storage,
    `${folder}/${new Date().getTime()} - ${img.name}`,
  );
  const snap = await uploadBytes(imgRef, img);
  const url = await getDownloadURL(ref(storage, snap.ref.fullPath));
  return {
    imgUrl: url,
    imgPath: snap.ref.fullPath,
  };
};

export const setRecipeDoc = async (docId, newRecipeData) => {
  setDoc(doc(db, 'recipes', docId), newRecipeData);
};

export const updateRecipeDoc = async (currentRecipeId, newRecipeData) => {
  const currentRecipeRef = doc(db, 'recipes', currentRecipeId);
  updateDoc(currentRecipeRef, newRecipeData);
};

export const getSearchArray = async (searchName) => {
  const searchNameArray = searchName.split('');
  const q = query(recipeRef, where('titleKeywords', 'array-contains', searchNameArray[0]));
  let queryDataArray = [];
  await getDocs(q).then((querySnapshot) => {
    if (!querySnapshot.empty) {
      querySnapshot.forEach(
        (document) => {
          if (document.data().title.includes(searchName)) {
            queryDataArray = [...queryDataArray, document.data()];
          }
        },
      );
    }
  });
  return queryDataArray;
};

export const updateUserDoc = async (userId, updatedMyFavorite) => {
  const UserRef = doc(db, 'users', userId);
  updateDoc(UserRef, { myFavorites: updatedMyFavorite });
};
