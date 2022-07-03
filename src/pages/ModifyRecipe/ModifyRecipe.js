// 待修： 判斷輸入欄是否都有輸入, 優化NAN提示(下方出現輸入請輸入數字);
import {
  useEffect, useState, useContext, useRef,
} from 'react';
import {
  collection, doc, setDoc, onSnapshot, updateDoc,
} from 'firebase/firestore';
import {
  getDownloadURL, uploadBytes, ref, deleteObject,
} from 'firebase/storage';
import styled from 'styled-components';
import { v4 } from 'uuid';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion, useAnimation } from 'framer-motion'; // npm i react-intersection-observer framer-motion
import { useInView } from 'react-intersection-observer';
import PropTypes from 'prop-types';
import { db, storage } from '../../firestore';
import defaultImage from '../../images/upload.png';
import StarRating from '../../components/Stars';
import { ToastContainer, showCustomAlert } from '../../components/CustomAlert';
import AuthContext from '../../components/AuthContext';
// import Header from '../../components/Header';
import Footer from '../../components/Footer';
import AuthHeader from '../../components/AuthHeader';
import binImage from '../../images/bin.png';
import tipImage from '../../images/tips.png';

const Background = styled.div`
  padding: 0 calc(116*100vw/1920);
`;

const Div = styled.div`
  display: flex;
  justify-content: space-between;
`;

// Title
const TitleWrapper = styled(Div)`
  display: flex;
  align-items: baseline;
  width: calc(1720*100vw/1920);
  height: calc(110*100vw/1920);
  margin-top: calc(46*100vw/1920);
`;

const LargeDiv = styled.div`
  font-size: calc(48*100vw/1920);
`;

const TittleInputWrapper = styled.div`
  display: flex;
  flex-direction: column;
`;

const TitleInput = styled.input`
  width: calc(1392*100vw/1920);
  font-size: calc(36*100vw/1920);
  border: calc(2.5*100vw/1920) solid #B3B3AC;
  border-radius: calc(15*100vw/1920);
  padding: calc(2*100vw/1920) calc(8*100vw/1920);
`;

const ErrorMsg = styled.div`
  font-size: calc(24*100vw/1920);
  color: red;
  margin-top: calc(10*100vw/1920);
`;

// Content
const ContentWrapper = styled.div`
  display: flex;
  gap: calc(88*100vw/1920);
  margin-top: calc(60*100vw/1920);
`;

const ContentDiv = styled.div`
  width: calc(800*100vw/1920);
  display: flex;
  justify-content: space-between;
`;

const ImgWrapper = styled.div`
  position: relative;
`;

const FoodImg = styled.img`
  width: calc(800*100vw/1920);
  height: calc(600*100vw/1920);
  border-radius: calc(15*100vw/1920);
`;

const Label = styled.label`
  display: block;
  cursor: pointer;
  background-color: transparent;
  border-radius: calc(15*100vw/1920);
  text-align: center;
  line-height: calc(64*100vw/1920);
  width: calc(800*100vw/1920);
  height: calc(600*100vw/1920);
  position: absolute;
  top: 0;
`;

const UploadImgP = styled.p`
  background-color: #FDFDFC75;
  width: calc(284*100vw/1920);
  height: calc(64*100vw/1920); 
  position: absolute;
  top: calc(450*100vw/1920);
  left: calc(275*100vw/1920);
  color: #584743;
  letter-spacing: calc(2*100vw/1920);
  font-size: calc(36*100vw/1920);
  border-radius: calc(15*100vw/1920);
`;

// Ingredient
const IngredientContentDiv = styled(ContentDiv)`
  display: flex;
  flex-direction: column;
  background-color: #E5D2C0;
  border-radius: calc(15*100vw/1920);
  padding: calc(16*100vw/1920);
  justify-content: space-around;
  width: calc(800*100vw/1920);
  height: calc(600*100vw/1920);
  margin-bottom: calc(50*100vw/1920);
`;

const IngredientTitleDiv = styled(Div)`
  border-bottom: calc(2*100vw/1920)  #2B2A29 solid;
  padding-bottom: calc(15*100vw/1920);
`;

const AllIngredientsDiv = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: start;
  gap: calc(10*100vw/1920);
  margin-top: calc(15*100vw/1920);
  font-size: calc(36*100vw/1920);
  flex-grow: 1;
  overflow-y: auto;
`;

const IngredientDiv = styled.div`
  display: flex;
  justify-content: space-around;
`;

const Input = styled.input`
  width: calc(325*100vw/1920);
  height: calc(56*100vw/1920);
  border: calc(2.5*100vw/1920) solid #B3B3AC;
  border-radius: calc(15*100vw/1920);
  padding: calc(2*100vw/1920) calc(8*100vw/1920);
  font-size: calc(28*100vw/1920);
`;

const Quantity = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: calc(15*100vw/1920);
`;

const QuantityInput = styled(Input)`
  width: calc(135*100vw/1920);
  text-align: right;
`;

const DeleteButton = styled.button`
  height: calc(56 * 100vw / 1920);
  background-color: transparent;
  cursor: pointer;
  border: 0;
  padding-top: calc(18 * 100vw / 1920);
`;

const IconImg = styled.img`
  width: calc(56*100vw/1920);
  height: calc(56*100vw/1920);
`;

const AddIngredientDiv = styled.div`
  width: 100%;
  text-align: center;
  margin-top: calc(10*100vw/1920);
`;

const AddIngredientButton = styled.button`
  width: calc(250*100vw/1920);
  height: calc(65*100vw/1920);
  background-color: #584743;
  border: 0;
  border-radius: calc(15*100vw/1920);
  color: #FDFDFC;
  font-size: calc(28*100vw/1920);
`;

// Step
const StepWrapper = styled.div`
  display: flex;
  justify-content: space-between;
`;

const StepCircleDiv = styled.div`
  width: calc(288*100vw/1920);
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

const Circle = styled.div`
  width: calc(100*100vw/1920);
  height: calc(100*100vw/1920);
  border: calc(5*100vw/1920)  #2B2A29 solid;
  border-radius: 50%;
  font-size: calc(48*100vw/1920);
  display: inline-flex;
  flex: 0 0 auto;
  text-align: center;
  justify-content: center;
  align-items: center;
`;

const Line = styled.div`
  width: calc(2.5*100vw/1920);
  height: calc(625*100vw/1920);
  background-color: #2B2A29;
`;

const AddStepDiv = styled.div`
  height: calc(625*100vw/1920);
  display: flex;
  align-items: center;
`;

const AddStepButton = styled.div`
  cursor: pointer;
  white-space: normal;
  word-wrap: break-word;
  width: calc(50*100vw/1920);
  height: calc(300*100vw/1920);
  font-size: calc(36*100vw/1920);
  background-color: #584743;
  color: #FDFDFC;
  border: 0;
  border-radius: calc(15*100vw/1920);
  cursor: pointer;
  display: flex;
  align-items: center;
`;

const StepTitleContentWrapper = styled.div`
  height: calc(650*100vw/1920);
  padding-top: calc(18 * 100vw / 1920);
`;

const StepTitleAndTimeDiv = styled(Div)`
  font-size: calc(48*100vw/1920);
  border-bottom: calc(5*100vw/1920)  #2B2A29 solid;
  padding-bottom: calc(50*100vw/1920);
`;

const StepInput = styled.input`
  width: calc(650*100vw/1920);
  height: calc(60*100vw/1920);
  font-size: calc(28*100vw/1920);
  border-radius: calc(15*100vw/1920);
  border: calc(2.5*100vw/1920) solid #B3B3AC;
  padding-left: calc(15*100vw/1920);
`;

const StepTimeDiv = styled.div`
  display: flex;
  justify-content: end;
  gap: calc(15*100vw/1920);
`;

const TimeInput = styled.input`
  width: calc(150*100vw/1920);
  height: calc(60*100vw/1920);
  font-size: calc(28*100vw/1920);
  border-radius: calc(15*100vw/1920);
  border: calc(2.5*100vw/1920) solid #B3B3AC;
  padding: calc(2*100vw/1920) calc(8*100vw/1920);
  text-align: right;
`;

const StepContentAndImgDiv = styled(Div)`
  align-items: center;
  margin-top: calc(36*100vw/1920);
`;

const StepContentDiv = styled(LargeDiv)`
  font-size: calc(36*100vw/1920);
  width: calc(800*100vw/1920);
  height: calc(500*100vw/1920);
  overflow: scroll;
  display: flex;
  align-items: center;
`;

const TextArea = styled.textarea`
  border-radius: calc(15*100vw/1920);
  border: calc(2.5*100vw/1920) solid #B3B3AC;
  width: calc(650*100vw/1920);
  height: calc(450*100vw/1920);
  padding: calc(15*100vw/1920) 0 0 calc(15*100vw/1920);
  font-size: calc(28*100vw/1920); 
`;

const StepImg = styled.img`
  width: calc(600*100vw/1920);
  height: calc(450*100vw/1920);
  border-radius: calc(15*100vw/1920)
`;

const StepLabel = styled(Label)`
  width: calc(600*100vw/1920);
  height: calc(450*100vw/1920);
`;

const StepUploadImgP = styled(UploadImgP)`
  width: calc(284*100vw/1920);
  height: calc(64*100vw/1920); 
  position: absolute;
  top: calc(325*100vw/1920);
  left: calc(175*100vw/1920);
  font-size: calc(28*100vw/1920);
`;

// Comment
const CommentDiv = styled.div`
  width: calc(1688*100vw/1920);
  height: calc(312*100vw/1920);
  padding: calc(30*100vw/1920);
  background-color: #E5D2C050;
  border-radius: calc(15*100vw/1920);
  margin-bottom: calc(50*100vw/1920);
`;

const CommentContentDiv = styled.div`
  font-size: calc(36*100vw/1920);
  padding-left: calc(220*100vw/1920);
  margin-top: calc(25*100vw/1920);
`;

const TipsDiv = styled.div`
  display: flex;
  align-items: center;
`;

const LogoImg = styled.img`
  width: calc(70*100vw/1920);
  height: calc(70*100vw/1920);
`;

const CommentTextArea = styled(TextArea)`
  width: calc(1350*100vw/1920);
  height: calc(150*100vw/1920);
`;

const BottonSaveDiv = styled.div`
  display: flex;
  justify-content: center;
  margin-bottom: calc(50*100vw/1920);
`;

const BottonSaveButton = styled.button`
  width: calc(300*100vw/1920);
  height: calc(68*100vw/1920);
  font-size: calc(36*100vw/1920);
  background-color: #EB811F;
  border: 0;
  border-radius: calc(15*100vw/1920);
  cursor: pointer;
`;

const RightSaveButton = styled.button`
  position:fixed;
  right: 1.5%;
  top: 50%;
  white-space: normal;
  word-wrap: break-word;
  width: calc(50*100vw/1920);
  height: calc(286*100vw/1920);
  font-size: calc(28*100vw/1920);
  background-color: #EB811F50;
  border: 0;
  border-radius: calc(15*100vw/1920);
  cursor: pointer;
`;

// https://blog.logrocket.com/react-scroll-animations-framer-motion/
const LineVariant = {
  visible: { opacity: 1, scale: 1, transition: { duration: 1.5 } },
  hidden: { opacity: 0, scale: 0 },
};

function MotionLine() {
  const control = useAnimation();
  const [refView, inView] = useInView();

  useEffect(() => {
    if (inView) {
      control.start('visible');
    } else {
      control.start('hidden');
    }
  }, [control, inView]);

  return (
    <motion.div
      ref={refView}
      variants={LineVariant}
      initial="hidden"
      animate={control}
      style={{ originX: 0, originY: 0 }}
    >
      <Line />
    </motion.div>
  );
}

function AlwaysScrollToBottom({ ingredients }) {
  const elementRef = useRef();
  useEffect(() => elementRef.current.scrollIntoView({ behavior: 'smooth', block: 'end', inline: 'end' }), [ingredients]);
  return <div ref={elementRef} />;
}

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
  const [authorId, setAuthorId] = useState('');
  const userInfo = useContext(AuthContext);
  const userId = userInfo.uid;
  const userName = userInfo.name;
  // const [userName, setUserName] = useState('');
  // const [userId, setUserId] = useState('');
  const fullTime = steps.reduce((accValue, step) => accValue + step.stepTime, 0);
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
      fullTime,
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
      fullTime,
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
      newSteps[index].stepTime = newSteps[index].stepMinute * 60 + newSteps[index].stepSecond;
      setSteps(newSteps);
      return;
    }
    newSteps[index].stepMinute = Number(e.target.value);
    newSteps[index].stepTime = newSteps[index].stepMinute * 60 + newSteps[index].stepSecond;
    setSteps(newSteps);
  }

  function updateStepSecondValue(e, index) {
    const newSteps = [...steps];
    const input = Number(e.target.value);
    if (Number.isNaN(input)) {
      newSteps[index].stepSecond = 0;
      newSteps[index].stepTime = newSteps[index].stepMinute * 60 + newSteps[index].stepSecond;
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
      <AuthHeader />
      <Background>
        <TitleWrapper>
          <LargeDiv>食譜名稱</LargeDiv>
          <TittleInputWrapper>
            <TitleInput
              value={title}
              onChange={(e) => { setTitle(e.target.value); setTitleKeyWords(e.target.value.split('')); }}
              placeholder="請輸入食譜名稱..."
            />
            {authorId && userId !== authorId && title === oldTitle ? <ErrorMsg>請為您的食譜取個新名稱</ErrorMsg> : ''}
          </TittleInputWrapper>
        </TitleWrapper>

        <ContentWrapper>
          <ContentDiv>
            <LargeDiv>難易度</LargeDiv>
            <StarRating onChange={(i) => setDifficulty(i)} rating={difficulty} />
          </ContentDiv>
          <ContentDiv>
            <LargeDiv>總時長</LargeDiv>
            <LargeDiv>
              {Math.floor(fullTime / 60) === 0 ? '' : `${Math.floor(fullTime / 60)}分鐘`}
              {fullTime % 60 === 0 ? '' : `${fullTime % 60}秒鐘`}
            </LargeDiv>
          </ContentDiv>
        </ContentWrapper>

        <ContentWrapper>
          <ImgWrapper>
            <FoodImg src={imgUrl || defaultImage} alt="stepImages" />
            <Label htmlFor="photo">
              <UploadImgP>點擊上傳圖片</UploadImgP>
            </Label>
            <input
              type="file"
              accept="image/*"
              style={{ display: 'none' }}
              id="photo"
              onChange={(e) => setImg(e.target.files[0])}
            />
          </ImgWrapper>

          <IngredientContentDiv>
            <IngredientTitleDiv>
              <LargeDiv>食材</LargeDiv>
            </IngredientTitleDiv>
            <AllIngredientsDiv>
              {ingredients.map((ingredient, index) => (
                <IngredientDiv key={ingredient.id}>
                  <Input
                    value={ingredient.ingredientsTitle}
                    onChange={(e) => { updateTitleValue(e, index); }}
                    placeholder="請輸入食材名稱..."
                  />
                  <Quantity>
                    <QuantityInput
                      value={ingredient.ingredientsQuantity}
                      onChange={(e) => { updateQuantityValue(e, index); }}
                      placeholder="0"
                      type="number"
                      step="0.01"
                    />
                    <Div>公克</Div>
                  </Quantity>
                  <DeleteButton type="button" onClick={() => { deleteIngredients(index); }}>
                    <IconImg src={binImage} alt="deleteImage" />
                  </DeleteButton>
                </IngredientDiv>
              ))}
              <AlwaysScrollToBottom ingredients={ingredients} />
            </AllIngredientsDiv>
            <AddIngredientDiv>
              <AddIngredientButton type="button" onClick={() => { addIngredients(); }}>新增食材</AddIngredientButton>
            </AddIngredientDiv>
          </IngredientContentDiv>
        </ContentWrapper>
        {steps.map((step, index) => (
          <div key={step.id}>
            <StepWrapper>
              <DeleteButton type="button" onClick={() => { DeleteSteps(index); }}>
                <IconImg src={binImage} alt="deleteImage" />
              </DeleteButton>
              <StepCircleDiv>
                <Circle>{index + 1}</Circle>
                {index + 1 === steps.length
                  ? (
                    <AddStepDiv>
                      <AddStepButton type="button" onClick={() => { addSteps(); }}>新增步驟</AddStepButton>
                    </AddStepDiv>
                  )
                  : <MotionLine />}
              </StepCircleDiv>
              <StepTitleContentWrapper>
                <StepTitleAndTimeDiv>
                  <StepInput
                    value={step.stepTitle}
                    onChange={(e) => { updateStepTitleValue(e, index); }}
                    placeholder="請輸入步驟簡稱..."
                  />
                  <StepTimeDiv>
                    <TimeInput
                      value={steps[index].stepMinute}
                      onChange={(e) => { updateStepMinuteValue(e, index); }}
                      placeholder="0"
                      type="number"
                    />
                    <LargeDiv>分</LargeDiv>
                    <TimeInput
                      value={steps[index].stepSecond}
                      onChange={(e) => { updateStepSecondValue(e, index); }}
                      placeholder="0"
                      type="number"
                    />
                    <LargeDiv>秒</LargeDiv>
                  </StepTimeDiv>
                </StepTitleAndTimeDiv>
                <StepContentAndImgDiv>
                  <StepContentDiv>
                    <TextArea
                      value={steps[index].stepContent}
                      onChange={(e) => { updateStepContentValue(e, index); }}
                      placeholder="請描述步驟"
                    />
                  </StepContentDiv>
                  <ImgWrapper>
                    <StepImg src={steps[index].stepImgUrl || defaultImage} alt="stepImages" />
                    <StepLabel htmlFor={step.id}>
                      <StepUploadImgP>點擊上傳圖片</StepUploadImgP>
                    </StepLabel>
                    <input
                      type="file"
                      accept="image/*"
                      style={{ display: 'none' }}
                      id={step.id}
                      onChange={(e) => { UpdateImageValue(e, index); }}
                    />
                  </ImgWrapper>
                </StepContentAndImgDiv>
              </StepTitleContentWrapper>
            </StepWrapper>
          </div>
        ))}
        <CommentDiv>
          <TipsDiv>
            <LogoImg src={tipImage} alt="tipImage" />
            <LargeDiv>小秘訣</LargeDiv>
          </TipsDiv>
          <CommentContentDiv>
            <CommentTextArea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="有什麼我們可以注意的地方嗎？"
            />
          </CommentContentDiv>
        </CommentDiv>
        <BottonSaveDiv>
          <BottonSaveButton type="button" onClick={() => { submitData(); }}>儲存食譜</BottonSaveButton>
        </BottonSaveDiv>
        <RightSaveButton onClick={() => { submitData(); }}>儲存食譜</RightSaveButton>
        <ToastContainer />
      </Background>
      <Footer />
    </>
  );
}

AlwaysScrollToBottom.propTypes = {
  ingredients: PropTypes.arrayOf.isRequired,
};

export default ModifyRecipe;
