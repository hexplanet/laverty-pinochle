import React from 'react';
import './index.scss';
import PlayingCard from "../../components/PlayingCard";

const CardTable = () => {
  return (
    <div className='card-table'>
      <PlayingCard xLocation={100} yLocation={100} suit={'H'} value={'9'} />
      <PlayingCard xLocation={300} yLocation={100} suit={'D'} value={'J'} />
      <PlayingCard xLocation={500} yLocation={100} suit={'C'} value={'Q'} />S
      <PlayingCard xLocation={100} yLocation={300} suit={'S'} value={'K'} />
      <PlayingCard xLocation={300} yLocation={300} suit={'H'} value={'10'} shown={false} rotation={330} />
      <PlayingCard xLocation={300} yLocation={300} suit={'H'} value={'10'} shown={false} zLocation={1} />
      <PlayingCard xLocation={300} yLocation={300} suit={'C'} value={'10'} rotation={30} zLocation={2} />
      <PlayingCard xLocation={500} yLocation={300} suit={'H'} value={'A'} />
    </div>
  )
};

export default CardTable;