import React, {useState, useEffect} from 'react';
import { useDispatch, useSelector } from "react-redux";
import Button from '../../components/Button';
import Input from '../../components/Input';
import GamePlay from '../GamePlay';
import {setTeamPlayers} from "../../redux/actions/gameActions";
import {setAppState} from "../../redux/actions/appActions";
import './index.scss';

function TitlePage() {
  const dispatch = useDispatch();
  const {
    appState,
    teams,
    playerName,
    playersThreeHanded,
    playersFourHanded
  } = useSelector((state) => state.app);
  const [teamNames, setTeamNames] = useState(teams);
  const [threeHandedPlayers, setThreeHandedPlayers] = useState([playerName, ...playersThreeHanded]);
  const [fourHandedPlayers, setFourHandedPlayers] = useState([playerName, ...playersFourHanded]);
  const [gameTypeButtons, setGameTypeButtons] = useState([]);
  const [playerInputs, setPlayerInputs] = useState([]);
  const [gameType, setGameType] = useState('4-Handed');
  const changeToNames = (id, value) => {
    const type = id.split('<-+->')[0];
    const index = Number(id.split('<-+->')[1]);
    if (type === 'team') {
      const newTeams = [...teamNames];
      newTeams[index] = value;
      setTeamNames(newTeams);
    } else {
      if (gameType === '4-Handed') {
        const newFourHand = [...fourHandedPlayers];
        newFourHand[index] = value;
        setFourHandedPlayers(newFourHand);
      } else {
        const newThreeHand = [...threeHandedPlayers];
        newThreeHand[index] = value;
        setThreeHandedPlayers(newThreeHand);
      }
    }
  };
  useEffect(() => {
    let enterPlayerNames = [];
    const changeType = (message) => {
      setGameType(message);
    };
    const changeTypeButtons = (
      <div className={'type-buttons-container'}>
        <div className={'three-handed-button'}>
          <Button
            label={'3 Handed Game'}
            returnMessage={'3-Handed'}
            handleClick={changeType}
            status={gameType === '3-Handed' ? 'inactive': 'active'}
          />
        </div>
        <div className={'four-handed-button'}>
          <Button
            label={'4 Handed Game'}
            returnMessage={'4-Handed'}
            handleClick={changeType}
            status={gameType === '4-Handed' ? 'inactive': 'active'}
          />
        </div>
      </div>
    );
    const players = gameType === '4-Handed' ? 4 : 3;
    if (players ===3) {
      for(let i = 0; i < players; i++) {
        enterPlayerNames.push((
          <Input
            id={`player<-+->${i}`}
            key={`player-${i}`}
            label={i===0?'Player':'Computer'}
            labelWidth={120}
            maxChars={7}
            value={threeHandedPlayers[i]}
            handleChange={changeToNames}
          />
        ));
      }
    } else {
      enterPlayerNames = (
        <div className={''}>
          <Input
            id={'team<-+->0'}
            key={`team-0`}
            label={'Team'}
            labelWidth={120}
            maxChars={7}
            value={teamNames[0]}
            handleChange={changeToNames}
          />
          <Input
            id={'player<-+->0'}
            key={`player-0`}
            label={'Player'}
            labelWidth={120}
            maxChars={7}
            value={fourHandedPlayers[0]}
            handleChange={changeToNames}
          />
          <Input
            id={'player<-+->2'}
            key={`player-2`}
            label={'Partner'}
            labelWidth={120}
            maxChars={7}
            value={fourHandedPlayers[2]}
            handleChange={changeToNames}
          />
          <Input
            id={'team<-+->1'}
            key={`team-1`}
            label={'Team'}
            labelWidth={120}
            maxChars={7}
            value={teamNames[1]}
            handleChange={changeToNames}
          />
          <Input
            id={'player<-+->1'}
            key={`player-1`}
            label={'Computer'}
            labelWidth={120}
            maxChars={7}
            value={fourHandedPlayers[1]}
            handleChange={changeToNames}
          />
          <Input
            id={'player<-+->3'}
            key={`player-3`}
            label={'Computer'}
            labelWidth={120}
            maxChars={7}
            value={fourHandedPlayers[3]}
            handleChange={changeToNames}
          />
        </div>
      );
    }
    setPlayerInputs(enterPlayerNames);
    setGameTypeButtons(changeTypeButtons);
  }, [setPlayerInputs, setGameTypeButtons, gameType, setGameType, threeHandedPlayers]);
  const startGame = () => {
    let newTeams = [...teamNames];
    let newPlayers = [...fourHandedPlayers];
    if (gameType === '3-Handed') {
      newTeams = [...threeHandedPlayers];
      newPlayers = [...threeHandedPlayers];
    }

    console.log(JSON.stringify(newTeams), JSON.stringify(newPlayers));

    dispatch(setTeamPlayers(newTeams, newPlayers));
    dispatch(setAppState('game'));
  };
  if (appState === 'game') {
    return (<GamePlay />);
  }
  return (
    <div className={'lavpin-title-page'}>
      <div className={'title-label'}>
        LAVERTY FAMILY PINOCHLE
      </div>
      <div className={'game-type-container'}>
        <div className={'type-label'}>Play Pinochle:</div>
        {gameTypeButtons}
      </div>
      <div className={'names-container'}>
        <div className={'names-inputs-container'}>
          {playerInputs}
        </div>
      </div>
      <div className={'game-play-button-container'}>
        <Button
          label={'Start Game'}
          handleClick={startGame}
        />
      </div>
    </div>
  );
}

export default TitlePage;
