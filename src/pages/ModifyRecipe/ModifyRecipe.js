import {
  useEffect, useState, useContext, useRef,
} from 'react';
import {
  collection, doc, setDoc, onSnapshot, updateDoc,
} from 'firebase/firestore';
import {
  getDownloadURL, uploadBytes, ref,
} from 'firebase/storage';
import styled from 'styled-components/macro';
import { v4 } from 'uuid';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion, useAnimation } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import PropTypes from 'prop-types';
import { db, storage } from '../../firestore';
import { devices } from '../../utils/StyleUtils';
import defaultImage from '../../images/upload.png';
import StarRating from '../../components/Stars';
import { ToastContainer, showCustomAlert } from '../../components/CustomAlert';
import AuthContext from '../../components/AuthContext';
import AuthHeader from '../../components/AuthHeader';
import binImage from '../../images/bin.png';
import tipImage from '../../images/tips.png';
import Loading from '../../components/Loading';

const Background = styled.div`
  padding: 0 calc(116*100vw/1920);
`;

const Div = styled.div`
  display: flex;
  justify-content: space-between;
`;

const TitleWrapper = styled(Div)`
  margin: auto;
  margin-top: calc(46*100vw/1920);
  margin-bottom: calc(50*100vw/1920);
  width: calc(800*100vw/1920);
  @media ${devices.Tablet} and (orientation:portrait) {
    flex-direction: column;
    align-items: center;
      width: calc(1600*100vw/1920);
  }
`;

const MediumLargeDiv = styled.div`
  font-size: calc(36*100vw/1920);
  @media ${devices.Tablet} and (orientation:portrait) {
    font-size: calc(72*100vw/1920);
  }
`;

const TittleInputWrapper = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
`;

const TitleInput = styled.input`
  font-size: calc(48*100vw/1920);
  border: 0;
  outline :0;
  border-bottom: calc(2.5*100vw/1920) solid #B3B3AC;
  padding: calc(2*100vw/1920) calc(8*100vw/1920);
  text-align: center;
  font-weight: 500;
  &:focus {
    border-color: #EB811F;
  }
  @media ${devices.Tablet} and (orientation:portrait) {
      font-size: calc(96*100vw/1920);
  }
`;

const ErrorMsg = styled.div`
  font-size: calc(24*100vw/1920);
  color: red;
  margin-top: calc(10*100vw/1920);
  text-align: end;
  @media ${devices.Tablet} and (orientation:portrait) {
      font-size: calc(48*100vw/1920);
  }
`;

const ContentWrapper = styled.div`
  display: flex;
  gap: calc(88*100vw/1920);
  align-items: center;
  margin-bottom: calc(50*100vw/1920);
  @media ${devices.Tablet} and (orientation:portrait) {
    flex-direction: column;
    align-items: center;
  }
`;

const ContentDiv = styled.div`
  width: calc(800*100vw/1920);
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  @media ${devices.Tablet} and (orientation:portrait) {
    width: calc(1600*100vw/1920);
  }

`;

const ImgWrapper = styled.div`
  position: relative;
`;

const FoodImg = styled.img`
  width: calc(800*100vw/1920);
  height: calc(600*100vw/1920);
  border-radius: calc(15*100vw/1920);
  @media ${devices.Tablet} and (orientation:portrait) {
    width: calc(1600*100vw/1920);
    height: calc(1200*100vw/1920);
  }
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
  @media ${devices.Tablet} and (orientation:portrait) {
    width: calc(1600*100vw/1920);
    height: calc(1200*100vw/1920);
  }
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
  @media ${devices.Tablet} and (orientation:portrait) {
    width: calc(568*100vw/1920);
    height: calc(128*100vw/1920); 
    font-size: calc(72*100vw/1920);
    top: calc(900*100vw/1920);
    left: calc(550*100vw/1920);
    line-height: calc(128*100vw/1920);
  }
`;

const IngredientContentDiv = styled.div`
  display: flex;
  flex-direction: column;
  background-color: #E5D2C0;
  border-radius: calc(15*100vw/1920);
  padding: calc(16*100vw/1920);
  justify-content: space-around;
  width: calc(800*100vw/1920);
  height: calc(600*100vw/1920);
  @media ${devices.Tablet} and (orientation:portrait) {
    width: calc(1600*100vw/1920);
    height: calc(1200*100vw/1920);
  }
`;

const IngredientTitleDiv = styled(Div)`
  border-bottom: calc(2*100vw/1920) #2B2A29 solid;
  padding-bottom: calc(15*100vw/1920);
  padding-left: calc(30*100vw/1920);
`;

const AllIngredientsDiv = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: start;
  gap: calc(10*100vw/1920);
  padding-top: calc(15*100vw/1920);
  font-size: calc(36*100vw/1920);
  flex-grow: 1;
  overflow-y: auto;
  @media ${devices.Tablet} and (orientation:portrait) {
    font-size: calc(72*100vw/1920);
    padding-top: calc(50*100vw/1920);
    gap: calc(30*100vw/1920);
  }
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
  outline: 0;
  &:focus {
    border-color: #EB811F;
  }
  @media ${devices.Tablet} and (orientation:portrait) {
    width: calc(650*100vw/1920);
    height: calc(112*100vw/1920);
    padding: calc(4*100vw/1920) calc(16*100vw/1920);
    font-size: calc(56*100vw/1920);
  }
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
  &::-webkit-inner-spin-button {
    -webkit-appearance: none;
  }
  @media ${devices.Tablet} and (orientation:portrait) {
    width: calc(270*100vw/1920);
  }
`;

const DeleteButton = styled.button`
  height: calc(45 * 100vw / 1920);
  background-color: transparent;
  cursor: pointer;
  border: 0;
  @media ${devices.Tablet} and (orientation:portrait) {
    height: calc(90 * 100vw / 1920);
  }
`;

const IconImg = styled.img`
  width: calc(45*100vw/1920);
  height: calc(45*100vw/1920);
  @media ${devices.Tablet} and (orientation:portrait) {
    height: calc(90 * 100vw / 1920);
    width: calc(90*100vw/1920);
  }
`;

const StepDeleteButton = styled(DeleteButton)`
  height: calc(56 * 100vw / 1920);
  margin-top: calc(20*100vw/1920);
  @media ${devices.Tablet} and (orientation:portrait) {
    height: calc(112 * 100vw / 1920);
    margin-top: calc(40*100vw/1920);
  }
`;

const StepIconImg = styled(IconImg)`
  width: calc(56*100vw/1920);
  height: calc(56*100vw/1920);
  @media ${devices.Tablet} and (orientation:portrait) {
    height: calc(112 * 100vw / 1920);
    width: calc(112*100vw/1920);
  }
`;

const AddIngredientDiv = styled.div`
  width: 100%;
  text-align: center;
  margin-top: calc(16*100vw/1920);
  @media ${devices.Tablet} and (orientation:portrait) {
      margin-top: calc(32*100vw/1920);
      margin-bottom: calc(32*100vw/1920);
  }
`;

const AddIngredientButton = styled.button`
  width: calc(200*100vw/1920);
  height: calc(50*100vw/1920);
  background-color: #584743;
  border: 0;
  border-radius: calc(15*100vw/1920);
  color: #FDFDFC;
  font-size: calc(28*100vw/1920);
  cursor: pointer;
  &:hover {
    background-color: #4c3732;
  }
  @media ${devices.Tablet} and (orientation:portrait) {
      width: calc(400*100vw/1920);
    height: calc(100*100vw/1920);
    font-size: calc(56*100vw/1920);
  }
`;

const StepWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  @media ${devices.Tablet} and (orientation:portrait) {
    justify-content: center;
    gap: calc(20*100vw/1920);
  }
`;

const StepCircleDiv = styled.div`
  width: calc(288*100vw/1920);
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  @media ${devices.Tablet} and (orientation:portrait) {
    width: calc(300*100vw/1920);
  }
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
  @media ${devices.Tablet} and (orientation:portrait) {
    width: calc(200*100vw/1920);
    height: calc(200*100vw/1920);
    font-size: calc(96*100vw/1920);
  }
`;

const Line = styled.div`
  width: calc(2.5*100vw/1920);
  height: calc(625*100vw/1920);
  background-color: #2B2A29;
  @media ${devices.Tablet} and (orientation:portrait) {
    width: calc(5*100vw/1920);
    height: calc(1400*100vw/1920);
  }
`;

const AddStepDiv = styled.div`
  height: calc(525*100vw/1920);
  display: flex;
  margin-top: calc(100*100vw/1920);
  @media ${devices.Tablet} and (orientation:portrait) {
    height: calc(1050*100vw/1920);
    margin-top: calc(200*100vw/1920);
  }
`;

const AddStepButton = styled.div`
  cursor: pointer;
  white-space: normal;
  word-wrap: break-word;
  width: calc(50*100vw/1920);
  height: calc(200*100vw/1920);
  font-size: calc(28*100vw/1920);
  background-color: #584743;
  color: #FDFDFC;
  border: 0;
  border-radius: calc(15*100vw/1920);
  cursor: pointer;
  display: flex;
  align-items: center;
    &:hover {
    background-color: #4c3732;
  }
  @media ${devices.Tablet} and (orientation:portrait) {
    width: calc(100*100vw/1920);
    height: calc(400*100vw/1920);
    font-size: calc(56*100vw/1920);
  }
`;

const StepTitleContentWrapper = styled.div`
  height: calc(650*100vw/1920);
  padding-top: calc(18 * 100vw / 1920);
    @media ${devices.Tablet} and (orientation:portrait) {
    width: calc(1100*100vw/1920);
    height: calc(1000*100vw/1920);
  }
`;

const StepTitleAndTimeDiv = styled(Div)`
  font-size: calc(48*100vw/1920);
  border-bottom: calc(5*100vw/1920)  #2B2A29 solid;
  padding-bottom: calc(50*100vw/1920);
  @media ${devices.Tablet} and (orientation:portrait) {
    font-size: calc(96*100vw/1920);
    flex-direction: column;
    gap: calc(50*100vw/1920);
  }
`;

const StepInput = styled.input`
  width: calc(650*100vw/1920);
  height: calc(60*100vw/1920);
  font-size: calc(36*100vw/1920);
  border: 0;
  outline :0;
  border-bottom: calc(2.5*100vw/1920) solid #B3B3AC;
  padding: calc(2*100vw/1920) calc(8*100vw/1920);
  &:focus {
    border-color: #EB811F;
  }
  padding-left: calc(15*100vw/1920);
  @media ${devices.Tablet} and (orientation:portrait) {
    width: calc(1100*100vw/1920);
    height: calc(120*100vw/1920);
    font-size: calc(72*100vw/1920);
  }
`;

const StepTimeDiv = styled.div`
  display: flex;
  align-items: center;
  gap: calc(15*100vw/1920);
`;

const TimeInput = styled.input`
  width: calc(150*100vw/1920);
  height: calc(60*100vw/1920);
  font-size: calc(36*100vw/1920);
  text-align: right;
  border: 0;
  outline :0;
  border-bottom: calc(2.5*100vw/1920) solid #B3B3AC;
  padding: calc(2*100vw/1920) calc(8*100vw/1920);
  &:focus {
    border-color: #EB811F;
  }
  &::-webkit-inner-spin-button {
    -webkit-appearance: none;
  }
  @media ${devices.Tablet} and (orientation:portrait) {
    width: calc(300*100vw/1920);
    height: calc(120*100vw/1920);
    font-size: calc(76*100vw/1920);
  }
`;

const StepContentAndImgDiv = styled(Div)`
  align-items: center;
  margin-top: calc(36*100vw/1920);
  @media ${devices.Tablet} and (orientation:portrait) {
    margin-top: calc(0*100vw/1920);
    flex-direction: column;
    justify-content: center;
  }
`;

const StepContentDiv = styled.div`
  font-size: calc(36*100vw/1920);
  width: calc(800*100vw/1920);
  height: calc(500*100vw/1920);
  overflow: auto;
  display: flex;
  align-items: center;
  @media ${devices.Tablet} and (orientation:portrait) {
    width: calc(1100*100vw/1920);
    height: calc(300*100vw/1920);
    font-size: calc(72*100vw/1920);
    line-height: calc(100*100vw/1920);
    overflow-y: auto;
    white-space: nowrap;
  }
`;

const TextArea = styled.textarea`
  border-radius: calc(15*100vw/1920);
  border: calc(2.5*100vw/1920) solid #B3B3AC;
  width: calc(650*100vw/1920);
  height: calc(450*100vw/1920);
  padding: calc(15*100vw/1920) 0 0 calc(15*100vw/1920);
  font-size: calc(36*100vw/1920); 
  line-height: calc(50*100vw/1920);
  outline: none;
  &:focus{
    border-color:  #EB811F;
  }
  @media ${devices.Tablet} and (orientation:portrait) {
    width: calc(1100*100vw/1920);
    height: calc(200*100vw/1920);
    font-size: calc(72*100vw/1920);
    overflow-x: auto;
    white-space: nowrap;
    line-height: calc(150*100vw/1920);
  }
`;

const StepImg = styled.img`
  width: calc(600*100vw/1920);
  height: calc(450*100vw/1920);
  border-radius: calc(15*100vw/1920);
  @media ${devices.Tablet} and (orientation:portrait) {
    width: calc(900*100vw/1920);
    height: calc(675*100vw/1920);
  }
`;

const StepLabel = styled(Label)`
  width: calc(600*100vw/1920);
  height: calc(450*100vw/1920);
  @media ${devices.Tablet} and (orientation:portrait) {
    width: calc(900*100vw/1920);
    height: calc(675*100vw/1920);
  }
`;

const StepUploadImgP = styled(UploadImgP)`
  width: calc(284*100vw/1920);
  height: calc(64*100vw/1920); 
  position: absolute;
  top: calc(325*100vw/1920);
  left: calc(175*100vw/1920);
  font-size: calc(28*100vw/1920);
  @media ${devices.Tablet} and (orientation:portrait) {
    width: calc(568*100vw/1920);
    height: calc(128*100vw/1920); 
    font-size: calc(56*100vw/1920);
    top: calc(450*100vw/1920);
    left: calc(180*100vw/1920);
    line-height: calc(128*100vw/1920);
  }
`;

const CommentDiv = styled.div`
  width: calc(1688*100vw/1920);
  height: calc(312*100vw/1920);
  padding: calc(30*100vw/1920);
  background-color: #E5D2C050;
  border-radius: calc(15*100vw/1920);
  margin-bottom: calc(50*100vw/1920);
  @media ${devices.Tablet} and (orientation:portrait) {
    padding: calc(60*100vw/1920);
    margin-top: calc(90*100vw/1920);
    width: 100%;
    height: calc(600*100vw/1920);
  }
`;

const CommentContentDiv = styled.div`
  font-size: calc(36*100vw/1920);
  margin-top: calc(25*100vw/1920);
  @media ${devices.Tablet} and (orientation:portrait) {
    margin-top: calc(60*100vw/1920);
    font-size: calc(72*100vw/1920);
  }
`;

const CommentTitleSpan = styled.span`
  font-size: calc(36*100vw/1920);
  font-weight: 500;
  @media ${devices.Tablet} and (orientation:portrait) {
    font-size: calc(72*100vw/1920);
  }
`;

const Mark = styled.mark`
    display: inline-block;
    line-height: 0;
    padding-bottom: 0.5em;
    background-color: #fec740;
`;

const TipsDiv = styled.div`
  display: flex;
  align-items: end;
`;

const TipImg = styled.img`
  width: calc(60*100vw/1920);
  height: calc(60*100vw/1920);
  @media ${devices.Tablet} and (orientation:portrait) {
    width: calc(90*100vw/1920);
    height: calc(90*100vw/1920);
  }
`;

const CommentTextArea = styled(TextArea)`
  width: 100%;
  height: calc(150*100vw/1920);
  line-height: calc(64*100vw/1920);
  @media ${devices.Tablet} and (orientation:portrait) {
    height: calc(300*100vw/1920);
    line-height: calc(100*100vw/1920);
  }
`;

const RightSaveButton = styled.button`
  position:fixed;
  right: 1.5%;
  top: 50%;
  white-space: normal;
  word-wrap: break-word;
  width: calc(50*100vw/1920);
  height: calc(200*100vw/1920);
  font-size: calc(28*100vw/1920);
  background-color: #EB811F;
  color: #FDFDFC;
  border: 0;
  border-radius: calc(15*100vw/1920);
  cursor: pointer;
  &:hover{
    background-color:#fa8921;
  }
  @media ${devices.Tablet} and (orientation:portrait) {
    width: calc(100*100vw/1920);
    height: calc(400*100vw/1920);
    font-size: calc(60*100vw/1920);
  }
`;

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
  useEffect(() => elementRef.current.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'end' }), [ingredients]);
  return <div ref={elementRef} />;
}

function ModifyRecipe() {
  const [title, setTitle] = useState('');
  const [oldTitle, setOldTitle] = useState('');
  const [titleKeywords, setTitleKeyWords] = useState([]);
  const [difficulty, setDifficulty] = useState(0);
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
  const userId = userInfo?.uid || '';
  const userName = userInfo?.name || '';
  const fullTime = steps.reduce((accValue, step) => accValue + Number(step.stepTime), 0);
  const navigate = useNavigate();
  const location = useLocation();
  const [loading, setLoading] = useState(true);
  const [checkingUser, setCheckingUser] = useState(true);

  // 判斷是否登入
  // 第一次render尚未收到onAuthStateChange資料為空字串
  // 第二次render拿到資料，若未登入是null，如果登入則可以拿到userId
  useEffect(() => {
    if (userInfo === '') {
      setCheckingUser(true);
    }
    if (userInfo === null) {
      navigate({ pathname: '/' });
    }
    if (userId) {
      setCheckingUser(false);
    }
  }, [navigate, userId, userInfo]);

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
          setLoading(false);
        },
      );
      return unsubscribe;
    }
    setLoading(false);

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
        const snap = await uploadBytes(imgRef, img);
        const url = await getDownloadURL(ref(storage, snap.ref.fullPath));
        setImgUrl(url);
        setImgPath(snap.ref.fullPath);
        setImg(undefined);
      };
      uploadImg();
    }
  }, [img, imgPath]);

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

    const parsedSteps = [...steps];
    parsedSteps.forEach((stepObject) => {
      const stepObjTemp = stepObject;
      stepObjTemp.stepMinute = Number(stepObjTemp.stepMinute);
      stepObjTemp.stepSecond = Number(stepObjTemp.stepSecond);
      stepObjTemp.stepTime = Number(stepObjTemp.stepTime);
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
      ingredients: parsedIngredients,
      steps: parsedSteps,
      comment,
      authorName: userName,
      authorId: userId,

    };
    const hasEmptyIngValue = (obj) => Object.values(obj).some((value) => value === '' || value === 0);
    const hasEmptyIngredientInput = ingredients.some((ingredient) => hasEmptyIngValue(ingredient));
    const hasEmptyStepValue = (obj) => Object.values(obj).some((value) => value === '');
    const hasEmptyStepInput = steps.some((step) => hasEmptyStepValue(step) || step.stepTime === 0);
    const hasEmptyOtherInput = Object.values(newRecipeData).some((value) => !value);

    if (hasEmptyOtherInput) {
      if (!title) {
        showCustomAlert('請填寫食譜名稱');
      } else if (!difficulty) {
        showCustomAlert('請選擇難易度');
      } else if (!imgUrl) {
        showCustomAlert('請上傳食譜封面照');
      } else if (!comment) {
        showCustomAlert('請填寫小秘訣');
      } else if (hasEmptyStepInput) {
        showCustomAlert('步驟時間不可以都是0喔');
      }
      return;
    }
    if (hasEmptyIngredientInput) {
      if (ingredients.some((ingredient) => ingredient.ingredientsTitle === '')) {
        showCustomAlert('請填寫食材名稱');
        return;
      }
      if (ingredients.some((ingredient) => ingredient.ingredientsQuantity === 0)) {
        showCustomAlert('請填寫食材數量');
        return;
      }
    }
    if (hasEmptyStepInput) {
      if (steps.some((step) => step.stepTitle === '')) {
        showCustomAlert('請填寫步驟簡稱');
        return;
      }
      if (steps.some((step) => step.stepContent === '')) {
        showCustomAlert('請填寫步驟內容');
        return;
      }
      if (steps.some((step) => step.stepTime === 0)) {
        showCustomAlert('步驟時間不可以都是0喔');
        return;
      }
      if (steps.some((step) => step.stepImgUrl === '')) {
        showCustomAlert('請上傳步驟照片');
        return;
      }
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

    const parsedSteps = [...steps];
    parsedSteps.forEach((stepObject) => {
      const stepObjTemp = stepObject;
      stepObjTemp.stepMinute = Number(stepObjTemp.stepMinute);
      stepObjTemp.stepSecond = Number(stepObjTemp.stepSecond);
      stepObjTemp.stepTime = Number(stepObjTemp.stepTime);
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
      steps: parsedSteps,
      comment,
      authorName: userName,
      authorId: userId,
    };
    const hasEmptyIngValue = (obj) => Object.values(obj).some((value) => value === '' || value === 0);
    const hasEmptyIngredientInput = ingredients.some((ingredient) => hasEmptyIngValue(ingredient));
    const hasEmptyStepValue = (obj) => Object.values(obj).some((value) => value === '');
    const hasEmptyStepInput = steps.some((step) => hasEmptyStepValue(step) || step.stepTime === 0);
    const hasEmptyOtherInput = Object.values(newRecipeData).some((value) => !value);

    if (hasEmptyOtherInput) {
      if (!title) {
        showCustomAlert('請填寫食譜名稱');
      } else if (!difficulty) {
        showCustomAlert('請選擇難易度');
      } else if (!imgUrl) {
        showCustomAlert('請上傳食譜封面照');
      } else if (!comment) {
        showCustomAlert('請填寫小秘訣');
      } else if (hasEmptyStepInput) {
        showCustomAlert('步驟時間不可以都是0喔');
      }
      return;
    }
    if (hasEmptyIngredientInput) {
      if (ingredients.some((ingredient) => ingredient.ingredientsTitle === '')) {
        showCustomAlert('請填寫食材名稱');
        return;
      }
      if (ingredients.some((ingredient) => ingredient.ingredientsQuantity === 0)) {
        showCustomAlert('請填寫食材數量');
        return;
      }
    }
    if (hasEmptyStepInput) {
      if (steps.some((step) => step.stepTitle === '')) {
        showCustomAlert('請填寫步驟簡稱');
        return;
      }
      if (steps.some((step) => step.stepContent === '')) {
        showCustomAlert('請填寫步驟內容');
        return;
      }
      if (steps.some((step) => step.stepTime === 0)) {
        showCustomAlert('步驟時間不可以都是0喔');
        return;
      }
      if (steps.some((step) => step.stepImgUrl === '')) {
        showCustomAlert('請上傳步驟照片');
        return;
      }
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
    if (Number(e.target.value) < 0) {
      e.target.value = 0;
    }
    newIngredients[targetIndex].ingredientsQuantity = e.target.value;
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
    newSteps[index].stepMinute = e.target.value;
    if (Number(newSteps[index].stepMinute) < 0) {
      newSteps[index].stepMinute = 0;
    }
    if (Number(newSteps[index].stepMinute) % 1 !== 0) {
      newSteps[index].stepMinute = Math.floor(e.target.value);
    }
    newSteps[index].stepTime = Number(newSteps[index].stepMinute) * 60
      + Number(newSteps[index].stepSecond);
    setSteps(newSteps);
  }

  function updateStepSecondValue(e, index) {
    const newSteps = [...steps];
    newSteps[index].stepSecond = e.target.value;
    if (Number(newSteps[index].stepSecond) > 59) {
      newSteps[index].stepSecond = 59;
    }
    if (Number(newSteps[index].stepSecond) < 0) {
      newSteps[index].stepSecond = 0;
    }
    if (Number(newSteps[index].stepMinute) % 1 !== 0) {
      newSteps[index].stepMinute = Math.floor(e.target.value);
    }
    newSteps[index].stepTime = Number(newSteps[index].stepMinute) * 60
      + Number(newSteps[index].stepSecond);
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

  if (checkingUser) {
    return (
      <>
        <AuthHeader />
        <Loading />
      </>
    );
  }

  if (loading) {
    return (
      <>
        <AuthHeader />
        <Loading />
      </>
    );
  }

  return (
    <>
      <AuthHeader />
      <Background>
        <TitleWrapper>
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
            <MediumLargeDiv>難易度</MediumLargeDiv>
            <StarRating onChange={(i) => setDifficulty(i)} rating={difficulty} />
          </ContentDiv>
          <ContentDiv>
            <MediumLargeDiv>總時長</MediumLargeDiv>
            <MediumLargeDiv>
              {Math.floor(fullTime / 60) === 0 ? '' : `${Math.floor(fullTime / 60)}分鐘`}
              {fullTime % 60 === 0 ? '' : `${fullTime % 60}秒鐘`}
            </MediumLargeDiv>
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
              <MediumLargeDiv>食材</MediumLargeDiv>
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
                      step="0.1"
                      min="0"
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
              <StepDeleteButton type="button" onClick={() => { DeleteSteps(index); }}>
                <StepIconImg src={binImage} alt="deleteImage" />
              </StepDeleteButton>
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
                      min="0"
                    />
                    <MediumLargeDiv>分</MediumLargeDiv>
                    <TimeInput
                      value={steps[index].stepSecond}
                      onChange={(e) => { updateStepSecondValue(e, index); }}
                      placeholder="0"
                      type="number"
                      min="0"
                      max="59"
                    />
                    <MediumLargeDiv>秒</MediumLargeDiv>
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
            <TipImg src={tipImage} alt="tipImage" />
            <CommentTitleSpan>
              <Mark>小秘訣</Mark>
            </CommentTitleSpan>
          </TipsDiv>
          <CommentContentDiv>
            <CommentTextArea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="有什麼我們可以注意的地方嗎？"
            />
          </CommentContentDiv>
        </CommentDiv>
        <RightSaveButton onClick={() => { submitData(); }}>儲存食譜</RightSaveButton>
        <ToastContainer />
      </Background>
    </>
  );
}

AlwaysScrollToBottom.propTypes = {
  ingredients: PropTypes.arrayOf(PropTypes.objectOf).isRequired,
};

export default ModifyRecipe;
