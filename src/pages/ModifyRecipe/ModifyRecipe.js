// 待修： 判斷輸入欄是否都有輸入, 優化NAN提示(下方出現輸入請輸入數字);
import { useEffect, useState, useContext } from 'react';
import {
  collection, doc, setDoc, onSnapshot, updateDoc,
} from 'firebase/firestore';
import {
  getDownloadURL, uploadBytes, ref, deleteObject,
} from 'firebase/storage';
import styled from 'styled-components';
import { v4 } from 'uuid';
import { useLocation, useNavigate } from 'react-router-dom';
import { db, storage } from '../../firestore';
import defaultImage from '../../images/upload.png';
import StarRating from '../../components/Stars';
import { ToastContainer, showCustomAlert } from '../../components/CustomAlert';
import AuthContext from '../../components/AuthContext';

const Img = styled.img`
width: 100px;
height: 100px;
`;

const Div = styled.div`
  display: flex;
  justify-content: space-between;
  width:  500px;
  margin-left: 500px;
`;

const TextArea = styled.textarea`
  width: 100%;
`;

function ModifyRecipe() {
  const [title, setTitle] = useState('');
  const [oldTitle, setOldTitle] = useState('');
  const [titleKeywords, setTitleKeyWords] = useState([]);
  const [difficulty, setDifficulty] = useState(1);
  const [ingredients, setIngredients] = useState([{
    ingredientsQuantity: '',
    ingredientsTitle: '',
    id: v4(),
  },
  ]);
  const [steps, setSteps] = useState(
    [{
      stepTitle: '',
      stepContent: '',
      stepMinute: '',
      stepSecond: '',
      stepTime: '',
      stepImgUrl: '',
      id: v4(),
    },
    ],
  );
  const [comment, setComment] = useState('');
  const [img, setImg] = useState('');
  const [imgPath, setImgPath] = useState('');
  const [imgUrl, setImgUrl] = useState('');
  const [authorName, setAuthorName] = useState('');
  const [authorId, setAuthorId] = useState('');
  const userInfo = useContext(AuthContext);
  const userId = userInfo.uid;
  const userName = userInfo.name;
  // const [userName, setUserName] = useState('');
  // const [userId, setUserId] = useState('');

  const navigate = useNavigate();
  const location = useLocation();

  // 取得當前食譜id的資料，放入編輯列
  useEffect(() => {
    const queryString = location.search;
    const currentRecipeId = location.search.split('=')[1];
    if (queryString) {
      const unsubscribe = onSnapshot(
        doc(db, 'recipes', currentRecipeId),
        (document) => {
          const recipeData = document.data();
          setTitle(recipeData.title);
          setOldTitle(recipeData.title);
          setTitleKeyWords(recipeData.titleKeywords);
          setDifficulty(recipeData.difficulty);
          setImgUrl(recipeData.mainImage);
          setImgPath(recipeData.mainImagePath);
          setIngredients(recipeData.ingredients);
          setSteps(recipeData.steps);
          setComment(recipeData.comment);
          setAuthorName(recipeData.authorName);
          setAuthorId(recipeData.authorId);
        },
      );
      return unsubscribe;
    }
    return undefined;
  }, [location]);

  // 上傳圖片時，並取得圖片網址，再將圖片網址設定回imgUrl。
  useEffect(() => {
    if (img) {
      const uploadImg = async () => {
        const imgRef = ref(
          storage,
          `recipe/${new Date().getTime()} - ${img.name}`,
        );
        if (imgPath) {
          await deleteObject(ref(storage, imgPath));
        }
        const snap = await uploadBytes(imgRef, img);
        const url = await getDownloadURL(ref(storage, snap.ref.fullPath));
        setImgUrl(url);
        setImgPath(snap.ref.fullPath);
        setImg(undefined);
      };
      uploadImg();
    }
  }, [img, imgPath]);

  // 依照當前使用者id抓出使用者名稱和id
  // const currentId = 'XmtaQyFOf0wPGlQUKYJG'; // Zoe
  // const currentId = 'FzrMOc7gXewUwNg5cyMn'; // David
  // useEffect(() => {
  //   const unsubscribe = onSnapshot(
  //     doc(db, 'users', currentId),
  //     (document) => {
  //       const userdata = document.data();
  //       setUserName(userdata.name);
  //       setUserId(userdata.id);
  //     },
  //   );
  //   return () => { unsubscribe(); };
  // }, []);

  async function setNewRecipeAndNavigate() {
    // 只知道collection，要產生id
    const docId = doc(collection(db, 'recipes')).id;

    // 將文字轉換成數字
    const parsedIngredients = [...ingredients];
    parsedIngredients.forEach((ingredientObj) => {
      const ingredientObjTemp = ingredientObj;
      ingredientObjTemp.ingredientsQuantity = Number(ingredientObj.ingredientsQuantity);
      return ingredientObjTemp;
    });

    const newRecipeData = {
      recipeId: docId,
      createTime: new Date(),
      title,
      titleKeywords,
      difficulty,
      fullTime: steps.reduce((accValue, step) => accValue + step.stepTime, 0),
      mainImage: imgUrl,
      mainImagePath: imgPath,
      ingredients,
      steps,
      comment,
      authorName: userName,
      authorId: userId,

    };
    const hasEmptyIngValue = (obj) => Object.values(obj).some((value) => value === '');
    const hasEmptyIngredientInput = ingredients.some((ingredient) => hasEmptyIngValue(ingredient));
    const hasEmptyStepValue = (obj) => Object.values(obj).some((value) => value === '');
    const hasEmptyStepInput = steps.some((step) => hasEmptyStepValue(step));
    const hasEmptyOtherInput = Object.values(newRecipeData).some((value) => !value);
    if (hasEmptyOtherInput) {
      if (!title) {
        showCustomAlert('請填寫食譜名稱');
      } else if (!imgUrl) {
        showCustomAlert('請上傳食譜封面照');
      } else if (!comment) {
        showCustomAlert('請填寫叮嚀事項');
      }
      return;
    } if (hasEmptyIngredientInput) {
      showCustomAlert('請填寫完整食材內容');
      return;
    } if (hasEmptyStepInput) {
      showCustomAlert('請填寫完整步驟內容');
      return;
    }
    // 知道collection name, document name，新建資料
    setDoc(doc(db, 'recipes', docId), newRecipeData);
    // 依照新建的食譜id導到對應頁面
    navigate({ pathname: '/read_recipe', search: `?id=${docId}` });
  }

  async function updateRecipeAndNavigate() {
    const currentRecipeId = location.search.split('=')[1];
    const RecipeRef = doc(db, 'recipes', currentRecipeId);

    // 將文字轉換成數字
    const parsedIngredients = [...ingredients];
    parsedIngredients.forEach((ingredientObj) => {
      const ingredientObjTemp = ingredientObj;
      ingredientObjTemp.ingredientsQuantity = Number(ingredientObj.ingredientsQuantity);
      return ingredientObjTemp;
    });

    const newRecipeData = {
      recipeId: currentRecipeId,
      createTime: new Date(),
      title,
      titleKeywords,
      difficulty,
      fullTime: steps.reduce((accValue, step) => accValue + step.stepTime, 0),
      mainImage: imgUrl,
      mainImagePath: imgPath,
      ingredients: parsedIngredients,
      steps,
      comment,
      authorName: userName,
      authorId: userId,
    };
    const hasEmptyIngValue = (obj) => Object.values(obj).some((value) => value === '');
    const hasEmptyIngredientInput = ingredients.some((ingredient) => hasEmptyIngValue(ingredient));
    const hasEmptyStepValue = (obj) => Object.values(obj).some((value) => value === '');
    const hasEmptyStepInput = steps.some((step) => hasEmptyStepValue(step));
    const hasEmptyOtherInput = Object.values(newRecipeData).some((value) => !value);

    if (hasEmptyOtherInput) {
      if (!title) {
        showCustomAlert('請填寫食譜名稱');
      } else if (!imgUrl) {
        showCustomAlert('請上傳食譜封面照');
      } else if (!comment) {
        showCustomAlert('請填寫叮嚀事項');
      }
      return;
    } if (hasEmptyIngredientInput) {
      showCustomAlert('請填寫完整食材內容');
      return;
    } if (hasEmptyStepInput) {
      showCustomAlert('請填寫完整步驟內容');
      return;
    }
    updateDoc(RecipeRef, newRecipeData);
    navigate({ pathname: '/read_recipe', search: `?id=${currentRecipeId}` });
  }

  function addIngredients() {
    const newIngredients = [...ingredients, {
      ingredientsQuantity: '',
      ingredientsTitle: '',
      id: v4(),
    }];
    setIngredients(newIngredients);
  }

  function deleteIngredients(i) {
    const newIngredients = ingredients.filter((_, index) => i !== index);
    setIngredients(newIngredients);
  }

  function updateQuantityValue(e, targetIndex) {
    const newIngredients = [...ingredients];
    const input = e.target.value;
    newIngredients[targetIndex].ingredientsQuantity = input;
    setIngredients(newIngredients);
  }
  function updateTitleValue(e, index) {
    const newIngredients = [...ingredients];
    newIngredients[index].ingredientsTitle = e.target.value;
    setIngredients(newIngredients);
  }

  function addSteps() {
    setSteps((prevSteps) => [...prevSteps, {
      stepTitle: '',
      stepContent: '',
      stepMinute: '',
      stepSecond: '',
      stepTime: '',
      stepImgUrl: '',
      stepImgPath: '',
      id: v4(),
    }]);
  }

  function updateStepTitleValue(e, index) {
    const newSteps = [...steps];
    newSteps[index].stepTitle = e.target.value;
    setSteps(newSteps);
  }

  function updateStepMinuteValue(e, index) {
    const newSteps = [...steps];
    const input = Number(e.target.value);
    if (Number.isNaN(input)) {
      newSteps[index].stepMinute = 0;
      newSteps[index].stepTime = newSteps[index].stepMinute + newSteps[index].stepSecond;
      setSteps(newSteps);
      return;
    }
    newSteps[index].stepMinute = Number(e.target.value);
    newSteps[index].stepTime = newSteps[index].stepMinute + newSteps[index].stepSecond;
    setSteps(newSteps);
  }

  function updateStepSecondValue(e, index) {
    const newSteps = [...steps];
    const input = Number(e.target.value);
    if (Number.isNaN(input)) {
      newSteps[index].stepSecond = 0;
      newSteps[index].stepTime = newSteps[index].stepMinute + newSteps[index].stepSecond;
      setSteps(newSteps);
      return;
    }
    newSteps[index].stepSecond = Number(e.target.value);
    newSteps[index].stepTime = newSteps[index].stepMinute * 60 + newSteps[index].stepSecond;
    setSteps(newSteps);
  }

  function updateStepContentValue(e, index) {
    const newSteps = [...steps];
    newSteps[index].stepContent = e.target.value;
    setSteps(newSteps);
  }

  function DeleteSteps(i) {
    const newSteps = steps.filter((_, index) => i !== index);
    setSteps(newSteps);
  }

  function UpdateImageValue(e, index) {
    const uploadImg = async () => {
      const imgRef = ref(
        storage,
        `recipeStep/${new Date().getTime()} - ${e.target.files[0].name}`,
      );

      if (steps[index].stepImgPath) {
        await deleteObject(ref(storage, steps[index].stepImgPath));
      }

      const snap = await uploadBytes(imgRef, e.target.files[0]);
      const url = await getDownloadURL(ref(storage, snap.ref.fullPath));

      const newSteps = [...steps];
      newSteps[index].stepImgUrl = url;
      newSteps[index].stepImgPath = snap.ref.fullPath;
      setSteps(newSteps);
    };
    uploadImg();
  }

  // 送出資料，檢查資料是否都有填寫，跳出完成提示，清除欄位，進入食譜閱覽頁面
  function decideToUpdateOrSetRecipe() {
    const queryString = location.search;
    if (queryString) {
      if (userId === authorId) {
        updateRecipeAndNavigate();
      } else {
        if (title === oldTitle) {
          showCustomAlert('請更改食譜名稱');
          return;
        }
        setNewRecipeAndNavigate();
      }
      return;
    }
    setNewRecipeAndNavigate();
  }

  function submitData() {
    decideToUpdateOrSetRecipe();
  }

  return (
    <>
      <Div>{authorName}</Div>
      <Div>
        <div>食譜名稱</div>
        <input
          value={title}
          onChange={(e) => { setTitle(e.target.value); setTitleKeyWords(e.target.value.split('')); }}
          placeholder="請輸入食譜名稱..."
        />
        {authorId && userId !== authorId && title === oldTitle ? <div>請為您的食譜取個新名稱</div> : ''}
      </Div>
      <Div>
        <div> 困難度</div>
        <StarRating onChange={(i) => setDifficulty(i)} rating={difficulty} />
      </Div>
      <Div>
        <div>
          <label htmlFor="photo">
            <Img src={imgUrl || defaultImage} alt="stepImages" />
            點擊上傳照片
            <input
              type="file"
              accept="image/*"
              style={{ display: 'none' }}
              id="photo"
              onChange={(e) => setImg(e.target.files[0])}
            />
          </label>
        </div>
      </Div>
      <Div><div>食材</div></Div>
      {ingredients.map((ingredient, index) => (
        <div key={ingredient.id}>
          <Div>
            <div>食材品項</div>
            <input
              value={ingredient.ingredientsTitle}
              onChange={(e) => { updateTitleValue(e, index); }}
              placeholder="請輸入食材名稱..."
            />
          </Div>
          <Div>
            <div>食材重量</div>
            <div>
              <input
                value={ingredient.ingredientsQuantity}
                onChange={(e) => { updateQuantityValue(e, index); }}
                placeholder="0"
                type="number"
                step="0.01"
              />
              公克
            </div>
          </Div>
          <Div>
            <button type="button" onClick={() => { deleteIngredients(index); }}>刪除食材</button>
          </Div>
        </div>
      ))}
      <button type="button" onClick={addIngredients}>新增食材</button>
      <Div><div>步驟</div></Div>
      {steps.map((step, index) => (
        <div key={step.id}>
          <Div>
            <div>步驟簡稱</div>
            <input
              value={step.stepTitle}
              onChange={(e) => { updateStepTitleValue(e, index); }}
              placeholder="請輸入步驟簡稱..."
            />
          </Div>
          <Div>
            <div>步驟時間</div>
            <input
              value={steps[index].stepMinute}
              onChange={(e) => { updateStepMinuteValue(e, index); }}
              placeholder="0"
              type="number"
            />
            分鐘
            <input
              value={steps[index].stepSecond}
              onChange={(e) => { updateStepSecondValue(e, index); }}
              placeholder="0"
              type="number"
            />
            秒
          </Div>
          <Div>
            <div>步驟敘述</div>
            <TextArea
              value={steps[index].stepContent}
              onChange={(e) => { updateStepContentValue(e, index); }}
              placeholder="請描述步驟"
            />
          </Div>
          <Div><div>步驟圖片</div></Div>
          <Div>
            <label htmlFor={step.id}>
              <Img src={steps[index].stepImgUrl || defaultImage} alt="stepImages" />
              點擊上傳照片
              <input
                type="file"
                accept="image/*"
                style={{ display: 'none' }}
                id={step.id}
                onChange={(e) => { UpdateImageValue(e, index); }}
              />
            </label>
          </Div>
          <Div><button type="button" onClick={() => { DeleteSteps(index); }}>刪除步驟</button></Div>
        </div>
      ))}
      <button type="button" onClick={addSteps}>新增步驟</button>
      <Div>
        <div>小撇步</div>
        <TextArea
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="有什麼我們可以注意的地方嗎？"
        />
      </Div>
      <button type="button" onClick={submitData}>儲存食譜</button>
      <ToastContainer />
    </>
  );
}

export default ModifyRecipe;
