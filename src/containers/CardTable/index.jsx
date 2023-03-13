import React, { useState } from 'react';
import PropTypes from 'prop-types';
import PlayingCard from "../../components/PlayingCard";
import Hand from "../../components/Hand";
import Pile from "../../components/Pile";
import MoveCard from "../../components/MoveCard";
import ScorePad from "../../components/ScorePad";
import Button from "../../components/Button";
import Input from "../../components/Input";
import Modal from "../../components/Modal";
import { Hearts } from "../../components/PlayingCard/svg/Hearts";
import './index.scss';
function CardTable({
  displayHands,
  displayDiscards,
  displayMebs,
  displayGameArea,
  displayScorePad,
  displayPlayerModal,
  displayMovingCards
}) {
  const [showMoveCard, setShowMoveCard] = useState(true);
  const testHand = [
    {suit:"H", value: "10", raised: true},
    {suit:"H", value: "10", },
    {suit:"H", value: "10", },
    {suit:"H", value: "10", },
    {suit:"H", value: "10", },
    {suit:"H", value: "10", },
    {suit:"H", value: "10", },
    {suit:"H", value: "10", },
    {suit:"H", value: "10", raised: true},
    {suit:"H", value: "10", },
    {suit:"H", value: "10", clickable: false},
    {suit:"H", value: "10", },
    {suit:"H", value: "10", rolloverColor:"" },
    {suit:"H", value: "10", },
    {suit:"H", value: "10", active: false},
    {suit:"H", value: "10", },
    {suit:"H", value: "10", },
    {suit:"H", value: "10", raised: true},
  ];
  const testHand2 = [
    {suit:"H", value: "10", },
    {suit:"H", value: "10", },
  ];
  const testPile1 = [
    {suit:"H", value: "10", },
    {suit:"H", value: "10", },
    {suit:"H", value: "10", },
    {suit:"H", value: "10", },
    {suit:"H", value: "10", },
    {suit:"H", value: "10", },
    {suit:"H", value: "10", },
    {suit:"H", value: "10", },
    {suit:"H", value: "10", },
    {suit:"H", value: "10", },
    {suit:"H", value: "10", },
    {suit:"H", value: "10", },
    {suit:"H", value: "10", },
    {suit:"H", value: "10", },
    {suit:"H", value: "10", },
    {suit:"H", value: "10", },
    {suit:"H", value: "10", },
    {suit:"H", value: "10", },
    {suit:"H", value: "10", },
    {suit:"H", value: "10", rotation: 310, xOffset: -10 },
    {suit:"H", value: "10", },
    {suit:"H", value: "10", },
    {suit:"H", value: "10", },
    {suit:"H", value: "10", },
    {suit:"H", value: "10", },
    {suit:"H", value: "10", },
    {suit:"H", value: "10", },
    {suit:"H", value: "10", },
    {suit:"H", value: "10", },
    {suit:"H", value: "10", },
    {suit:"H", value: "10", },
    {suit:"H", value: "10", },
    {suit:"H", value: "10", },
    {suit:"H", value: "10", },
    {suit:"H", value: "10", },
    {suit:"H", value: "10", },
    {suit:"H", value: "10", },
    {suit:"H", value: "10", },
  ];
  const mockScores = [
    [
      { bid: '', gotSet: false, meb: 5, counts: 7, score: 12},
      { bid: '29', gotSet: true, meb: 15, counts: 13, score: -17},
      { bid: '', gotSet: false, meb: 5, counts: 7, score: 12},
      { bid: '29', gotSet: true, meb: 15, counts: 13, score: -17},
    ],
    [
      { bid: '25', gotSet: false, meb: 12, counts: 18, score: 30},
      { bid: '', gotSet: false, meb: 3, counts: 12, score: 45},
      { bid: '25', gotSet: false, meb: 12, counts: 18, score: 30},
      { bid: '', gotSet: false, meb: 3, counts: 12, score: 45},
    ]
  ];

  const mockScores2 = [
    [
      { bid: '', gotSet: false, meb: 25, counts: 7, score: 12},
      { bid: '29', gotSet: true, meb: 15, counts: 13, score: -17},
    ],
    [
      { bid: '25', gotSet: false, meb: 12, counts: 18, score: 30},
      { bid: '', gotSet: false, meb: 28, counts: 48, score: 122},
    ],
    [
      { bid: '25', gotSet: false, meb: 12, counts: 18, score: 30},
      { bid: '', gotSet: false, meb: 3, counts: 12, score: 45},
    ]
  ];

  const cardClicked = (id, card) => {
    console.log(id, card);
  };
  const hideMovingCard = () => {
    setShowMoveCard(false);
  };
  const mockButtonStyle = {
    position:'absolute',
    left:'50px',
    top:'940px'
  };
  const mockButtonStyle2 = {
    position:'absolute',
    left:'250px',
    top:'940px'
  };
  const mockButtonStyle3 = {
    position:'absolute',
    left:'50px',
    top:'1000px'
  };
  const mockInputLine1 = {
    position:'absolute',
    left:'20px',
    top:'1100px'
  };
  const mockInputLine2 = {
    position:'absolute',
    left:'20px',
    top:'1200px'
  };
  const clickedButton = () => {
    console.log('ClickedMe!');
  };
  const changedInput = (value) => {
      console.log(value);
  };

  const handleFocusChange = (id, value) => {
    console.log(id,value);
  };

  const inputsForModal = [
    <Input
      id={'mod1'}
      label={'Shortener'}
      handleEnter={changedInput}
      width={100}
      labelWidth={160}
      maxChars={10}
      handleFocus={handleFocusChange}
    />,
    <Input
      id={'mod2'}
      label={'Long'}
      handleEnter={changedInput}
      labelWidth={160}
      width={100}
      maxChars={10}
      handleFocus={handleFocusChange}
    />
  ];

  const modalButtons = [
    <Button
      handleClick={clickedButton}
      label={'No'}
    />,
    <Button
      handleClick={clickedButton}
      label={'Maybe'}
    />,
    <Button
      handleClick={clickedButton}
      label={'Yes'}
    />,
  ];
  return (
    <div className='lavpin-card-table'>
      {displayDiscards}
      {displayMebs}
      {displayGameArea}
      {displayScorePad}
      {displayPlayerModal}
      {displayHands}
      {displayMovingCards}
    </div>
  );
/*
  return (
    <div className='lavpin-card-table'>
      <Modal
        id={'test'}
        hasBlocker={true}
        xLocation={80}
        height={300}
        header={'Title'}
        hasHeaderSeparator={true}
        message={(<div><div>Part 1 of Message</div><div>Part 2 of Message</div></div>)}
        textInputs={inputsForModal}
        buttons={modalButtons}
      />
      <Hand id='player1' xLocation={600} yLocation={700} cards={testHand} cardClicked={cardClicked} />
      <Hand id='player2' xLocation={600} yLocation={1000} cards={testHand2} cardClicked={cardClicked} />
      <PlayingCard xLocation={100} yLocation={100} suit={'H'} value={'9'} />
      <PlayingCard xLocation={300} yLocation={100} suit={'D'} value={'J'} active={false} rolloverColor={'#f00'} />
      <PlayingCard xLocation={500} yLocation={100} suit={'C'} value={'Q'} active={false} clickable={false} rolloverColor={'#f00'} />
      <PlayingCard xLocation={100} yLocation={300} suit={'S'} value={'K'} />
      <PlayingCard xLocation={300} yLocation={300} suit={'H'} value={'10'} shown={false} rotation={330} rolloverColor={''} />
      <PlayingCard xLocation={300} yLocation={300} suit={'H'} value={'10'} shown={false} zLocation={1} />
      <PlayingCard xLocation={300} yLocation={300} suit={'C'} value={'10'} rotation={30} zLocation={2} rolloverColor={''} />
      <PlayingCard xLocation={500} yLocation={300} suit={'H'} value={'A'} />
      <Pile xLocation={300} yLocation={1000} cards={testPile1}/>
      {showMoveCard &&
      <MoveCard
        id={1}
        suit="H"
        value="8"
        shown={true}
        speed={0.5}
        travelTime={5000}
        source={{x: 1000, y: 1000, rotation: 0, zoom: 100 }}
        target={{x: 100, y: 800, rotation: -720, zoom: 200 }}
        movementDone={hideMovingCard}
      />
      }
      <ScorePad zLocation={20} teams={['Us', 'Them']} scores={mockScores} won="Them"/>
      <div style={mockButtonStyle}><Button label='Pinocle' handleClick={clickedButton}/></div>
      <div style={mockButtonStyle2}><Button label='Pinocle' status='inactive' handleClick={clickedButton}/></div>
      <div style={mockButtonStyle3}><Button icon={<Hearts myWidth={24} myHeight={24}/>} status='warning' handleClick={clickedButton}/></div>
      <div style={mockInputLine1}>
        <Input
          id={'pie'}
          handleEnter={changedInput}
          value={'PI'}
          prompt={'I like'}
          width={500}
          maxChars={50}
          handleFocus={handleFocusChange}
        />
      </div>
      <div style={mockInputLine2}>
        <Input
          id={'dance'}
          label={'Safety First'}
          value={'You can dance'}
          handleFocus={handleFocusChange}
        />
      </div>
    </div>
  )
 */
}

CardTable.propTypes = {
  displayHands: PropTypes.array,
  displayDiscards: PropTypes.array,
  displayMebs: PropTypes.array,
  displayGameArea: PropTypes.array,
  displayScorePad: PropTypes.array,
  displayPlayerModal: PropTypes.array,
  displayMovingCards: PropTypes.array,
};

CardTable.defaultProps = {
  displayHands: [],
  displayDiscards: [],
  displayMebs: [],
  displayGameArea: [],
  displayScorePad: [],
  displayPlayerModal: [],
  displayMovingCards: [],
};

export default CardTable;