import { useEffect, useState } from 'react';
import {
  collection, doc, setDoc,
} from 'firebase/firestore';
import {
  getDownloadURL, uploadBytes, ref, deleteObject,
} from 'firebase/storage';
import styled from 'styled-components';
import { v4 } from 'uuid';
import { useNavigate } from 'react-router-dom';
import { db, storage } from '../../firestore';
import defaultImage from '../../images/upload.png';
import StarRating from '../../components/Stars';

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

// 插入userid 和 user name
// 插入星星套件

function ModifyRecipe() {
  const [title, setTitle] = useState('');
  const [difficulty, setDifficulty] = useState(1);
  const [ingredients, setIngredients] = useState([{
    ingredientsQuantity: 0,
    ingredientsTitle: '',
    id: v4(),
  },
  ]);

  const [steps, setSteps] = useState(
    [{
      stepTitle: '',
      stepContent: '',
      stepMinute: 0,
      stepSecond: 0,
      stepTime: 0,
      stepImgUrl: '',
      id: v4(),
    },
    ],
  );
  const [comment, setComment] = useState('');
  const [img, setImg] = useState('');
  const [imgPath, setImgPath] = useState('');
  const [imgUrl, setImgUrl] = useState('');
  // const [stepTitle, setStepTitle] = useState('');
  // const [stepTime, setStepTime] = useState('');
  // const [stepMinute, setStepMinute] = useState('');
  // const [stepSecond, setStepSecond] = useState('');
  // const [stepContent, setStepContent] = useState('');

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

  // useEffect(() => {
  //   async function getData() {
  //     const docRef = doc(db, 'recipes', 'O3pzlJ8g9gTtHahU9aeZ');
  //     const docSnap = await getDoc(docRef);
  //     const RecipeData = docSnap.data();
  //   }
  //   getData();
  // }, []);

  async function addRecipe() {
    // 只知道collection，要產生id
    const docId = doc(collection(db, 'cities')).id;
    const recipeData = {
      recipeId: docId,
      createTime: new Date(),
      title,
      difficulty,
      fullTime: steps.reduce((accValue, step) => accValue + step.stepTime, 0),
      mainImage: imgUrl,
      ingredients,
      steps,
      comment,
    };

    // if (Object.values(recipeData).some((value) => !value)) {
    //   window.alert('請填寫完整食譜內容');
    //   return;
    // }

    // 知道collection name, document name，新建資料
    setDoc(doc(db, 'cities', docId), recipeData);
  }

  function addIngredients() {
    const newIngredients = [...ingredients, {
      ingredientsQuantity: 0,
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
    newIngredients[targetIndex].ingredientsQuantity = Number(e.target.value);
    // const newIngredients2 = ingredients.map((ingredient, i) => {
    //   if (i === targetIndex) {
    //     return { ...ingredient, ingredientsQuantity: Number(e.target.value) };
    //   }
    //   return ingredient;
    // });
    setIngredients(newIngredients);
  }
  function updateTitleValue(e, index) {
    const newIngredients = [...ingredients];
    newIngredients[index].ingredientsTitle = e.target.value;
    setIngredients(newIngredients);
  }

  function AddSteps() {
    setSteps((prevSteps) => [...prevSteps, {
      stepTitle: '',
      stepContent: '',
      stepMinute: 0,
      stepSecond: 0,
      stepTime: 0,
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
    newSteps[index].stepMinute = Number(e.target.value);
    newSteps[index].stepTime = newSteps[index].stepMinute + newSteps[index].stepSecond;
    setSteps(newSteps);
  }

  function updateStepSecondValue(e, index) {
    const newSteps = [...steps];
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

  // 檢查內容是否填寫
  // function checkInfo(){

  // }

  // 送出資料，檢查資料是否都有填寫，跳出完成提示，清除欄位，進入食譜閱覽頁面
  function submitData() {
    addRecipe();
  }
  const navigate = useNavigate();

  function navigateToReadPage() {
    const docId = doc(collection(db, 'cities')).id;
    navigate({ pathname: '/read_recipe', search: `?id=${docId}` });
  }

  return (
    <>
      <Div>
        <div>食譜名稱</div>
        <input value={title} onChange={(e) => setTitle(e.target.value)} />
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
              onChange={(e) => { updateTitleValue(e, index); }}
            />
          </Div>
          <Div>
            <div>食材重量</div>
            <input
              onChange={(e) => { updateQuantityValue(e, index); }}
            />
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
              onChange={(e) => { updateStepTitleValue(e, index); }}
            />
          </Div>
          <Div>
            <div>步驟時間</div>
            <input
              onChange={(e) => { updateStepMinuteValue(e, index); }}
            />
            分鐘
            <input
              onChange={(e) => { updateStepSecondValue(e, index); }}
            />
            秒
          </Div>
          <Div>
            <div>步驟敘述</div>
            <input
              onChange={(e) => { updateStepContentValue(e, index); }}
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
      <button type="button" onClick={AddSteps}>新增步驟</button>
      <Div>
        <div>小叮嚀</div>
        <input
          value={comment}
          onChange={(e) => setComment(e.target.value)}
        />
      </Div>
      <button type="button" onClick={submitData}>儲存食譜</button>
      <button type="button" onClick={navigateToReadPage}>測試跳轉</button>
    </>
  );
}

export default ModifyRecipe;
