import React, {useState, useEffect} from 'react';
import CardTable from '../CardTable';
import PropTypes from "prop-types";
import { useDispatch, useSelector } from "react-redux";
import * as appActions from '../../redux/actions/appActions';
import './index.scss';
import Hand from "../../components/Hand";
function GamePlay({
 players
}) {
  const dispatch = useDispatch();
  const { hands, playerDisplaySettings } = useSelector((state) => state.app);
  const [windowWidth, setWindowWidth]   = useState(window.innerWidth);
  const [windowHeight, setWindowHeight] = useState(window.innerHeight);
  const [gameHands, setGameHands] = useState([]);
  const updateDimensions = () => {
    if (window.innerWidth !== windowWidth || window.innerHeight !== windowHeight) {
      setWindowWidth(window.innerWidth);
      setWindowHeight(window.innerHeight);
      dispatch(appActions.setCardTableLayout(
        window.innerWidth,
        window.innerHeight,
      ));
    }

  }
  useEffect(() => {
    window.addEventListener("resize", updateDimensions);
    dispatch(appActions.setCardTableLayout(
      window.innerWidth,
      window.innerHeight,
    ));
    return () => window.removeEventListener("resize", updateDimensions);
  }, []);
  const HandleClickedCard = (id, card) => {
    console.log(id, card);
  };
  useEffect(() => {
    const newGameHands = [];
    hands.forEach((hand, index) => {
      if (playerDisplaySettings[index]) {
        newGameHands.push(
          <Hand
            id={`player${index}`}
            key={`player${index}`}
            xLocation={playerDisplaySettings[index].x}
            yLocation={playerDisplaySettings[index].y}
            rotation={playerDisplaySettings[index].rotation}
            zoom={playerDisplaySettings[index].zoom}
            cards={hand}
            cardClicked={HandleClickedCard}
          />
        );
      }
    });
    setGameHands(newGameHands);
  }, [hands, playerDisplaySettings, setGameHands]);
  return (
    <div>
      <CardTable disaplayHands={gameHands}/>
    </div>
  );
}

GamePlay.propTypes = {
  players: PropTypes.array,
};

GamePlay.defaultProps = {
  players: ['You', 'Steven', 'Ellen', 'Jessica'],
};

export default GamePlay;