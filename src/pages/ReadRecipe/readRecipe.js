import { useState, useEffect, useContext } from 'react';
import styled from 'styled-components';
import { doc, onSnapshot, updateDoc } from 'firebase/firestore';
import { Link, useLocation } from 'react-router-dom';
import PropTypes from 'prop-types';
import { db } from '../../firestore';
import Stars from '../../components/DisplayStars';
import defaultImage from '../../images/upload.png';
import { ToastContainer, showCustomAlert } from '../../components/CustomAlert';
import Header from '../../components/Header';
import AuthContext from '../../components/AuthContext';

const Div = styled.div`
  display: flex;
  justify-content: space-between;
  width:  500px;
  margin-left: 500px;
`;

const Img = styled.img`
width: 100px;
height: 100px;
`;

function ReadRecipe() {
  const userInfo = useContext(AuthContext);
  // const userId = userInfo.uid;
  const [userId, setUserId] = useState('');
  const [myFavorites, setMyFavorites] = useState([]);
  const [title, setTitle] = useState('');
  const [difficulty, setDifficulty] = useState(1);
  const [ingredients, setIngredients] = useState([]);
  const [steps, setSteps] = useState([]);
  const [comment, setComment] = useState('');
  const [imgUrl, setImgUrl] = useState('');
  const [authorName, setAuthorName] = useState('');
  const [authorId, setAuthorId] = useState('');
  const [fullTime, setFulltime] = useState(0);
  const location = useLocation();

  // 當userInfo存在時，取得uid
  useEffect(() => {
    if (userInfo) {
      setUserId(userInfo.uid);
      setMyFavorites(userInfo.myFavorites);
    } else {
      setUserId('');
      setMyFavorites([]);
    }
  }, [userInfo]);

  const currentRecipeId = location.search.split('=')[1];
  useEffect(() => {
    const unsubscribe = onSnapshot(
      doc(db, 'recipes', currentRecipeId),
      (document) => {
        const recipeData = document.data();
        setTitle(recipeData.title);
        setDifficulty(recipeData.difficulty);
        setImgUrl(recipeData.mainImage);
        setIngredients(recipeData.ingredients);
        setSteps(recipeData.steps);
        setComment(recipeData.comment);
        setAuthorName(recipeData.authorName);
        setAuthorId(recipeData.authorId);
        setFulltime(recipeData.fullTime);
      },
    );
    return unsubscribe;
  }, [currentRecipeId]);

  // 依照當前使用者id抓出使用者名稱和id
  // const currentId = 'XmtaQyFOf0wPGlQUKYJG'; // Zoe
  // const currentId = 'FzrMOc7gXewUwNg5cyMn'; // David
  // useEffect(() => {
  //   const unsubscribe = onSnapshot(
  //     doc(db, 'users', currentId),
  //     (document) => {
  //       const userdata = document.data();
  //       setUserId(userdata.id);
  //       setMyFavorites(userdata.myFavorites);
  //     },
  //   );
  //   return () => { unsubscribe(); };
  // }, []);

  const copyText = ingredients.reduce((acc, i) => `${acc}${i.ingredientsTitle}:${i.ingredientsQuantity}公克,`, '');

  function exportIngredients() {
    if (navigator.share) {
      navigator.share({
        title: `${title}食材內容`,
        text: `${title}食材內容:${copyText}`,
      });
    } else {
      navigator.clipboard.writeText(`【 ${title} 】  食材內容: \n ${copyText}`);
      navigator.clipboard.readText().then((text) => showCustomAlert(`已成功複製\n${text}`));
    }
  }

  function addToFavorites() {
    const UserRef = doc(db, 'users', userId);
    const isRecipeExisting = myFavorites.some((id) => id === currentRecipeId);
    if (isRecipeExisting) {
      return;
    }
    const updatedMyFavorite = [...myFavorites, currentRecipeId];
    setMyFavorites(updatedMyFavorite);
    updateDoc(UserRef, { myFavorites: updatedMyFavorite });
  }

  return (
    <>
      <Header />
      <Div>
        <div>{title}</div>
        <div>
          by
          {authorName}
        </div>
      </Div>
      <Div>
        <div>
          總時長:
          {Math.floor(fullTime / 60) === 0 ? '' : `${Math.floor(fullTime / 60)}分`}
          {fullTime % 60 === 0 ? '' : `${fullTime % 60}秒`}
        </div>
      </Div>
      <Div>
        <div>困難度</div>
        <Stars stars={difficulty} size={20} spacing={2} fill="#EB811F" />
      </Div>
      <Div>
        <div>
          <Img src={imgUrl || defaultImage} alt="stepImages" />
        </div>
      </Div>
      <Div><div>食材</div></Div>
      {ingredients.map((ingredient) => (
        <div key={ingredient.id}>
          <Div>
            <div>食材品項</div>
            <div>{ingredient.ingredientsTitle}</div>
          </Div>
          <Div>
            <div>食材重量</div>
            <div>{ingredient.ingredientsQuantity}</div>
          </Div>
        </div>
      ))}
      <Div><div>步驟</div></Div>
      {steps.map((step, index) => (
        <div key={step.id}>
          <Div>
            <div>步驟簡稱</div>
            <div>{step.stepTitle}</div>
          </Div>
          <Div>
            <div>步驟時間</div>
            <div>
              {steps[index].stepMinute === 0 ? '' : `${steps[index].stepMinute}分`}
              {steps[index].stepSecond === 0 ? '' : `${steps[index].stepSecond}秒`}
            </div>
          </Div>
          <Div>
            <div>步驟敘述</div>
            <div>{steps[index].stepContent}</div>
          </Div>
          <Div><div>步驟圖片</div></Div>
          <Div>
            <Img src={steps[index].stepImgUrl || defaultImage} alt="stepImages" />
          </Div>
        </div>
      ))}
      <Div>
        <div>小叮嚀</div>
        <div>{comment}</div>
      </Div>
      <Link to={`/modify_recipe?id=${location.search.split('=')[1]}`}>
        <button type="button">
          {userId === authorId ? '編輯食譜' : '複製食譜'}
        </button>
      </Link>
      <Link to={`/cooking?id=${location.search.split('=')[1]}`}>
        <button type="button">
          小試身手
        </button>
      </Link>
      <button type="button" onClick={exportIngredients}>匯出食材</button>
      {myFavorites.includes(currentRecipeId) ? '' : <button type="button" onClick={addToFavorites}>加到最愛</button>}
      <ToastContainer />
    </>
  );
}

Stars.propTypes = {
  stars: PropTypes.number.isRequired,
  size: PropTypes.number.isRequired,
  spacing: PropTypes.number.isRequired,
  fill: PropTypes.string.isRequired,
};

export default ReadRecipe;
