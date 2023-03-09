import React from 'react';
import PlayingCard from "../../components/PlayingCard";
import Hand from "../../components/Hand";
import Pile from "../../components/Pile";
import './index.scss';
const CardTable = () => {
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
  const cardClicked = (id, card) => {
    console.log(id, card);
  };
  return (
    <div className='lavpin-card-table'>
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
    </div>
  )
};

export default CardTable;