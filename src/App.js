import React, { useEffect, useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import {
  VscAdd,
  VscColorMode,
  VscDebugBreakpointFunctionUnverified,
  VscDebugBreakpointData,
  VscFlame,
  VscGear,
  VscOctoface,
  VscRuby,
} from 'react-icons/vsc';
import { shuffle } from './utils';
import Cards from './Cards';

import './App.css';

const App = () => {
  const cardsNumber = 16;
  const totalPairs = cardsNumber / 2;
  const icons = [
    <VscAdd />,
    <VscColorMode />,
    <VscDebugBreakpointFunctionUnverified />,
    <VscDebugBreakpointData />,
    <VscFlame />,
    <VscGear />,
    <VscOctoface />,
    <VscRuby />,
  ];

  const [cards, setCards] = useState([]);
  const [matchedIds, setMatchedIds] = useState({});
  const [refreshTimer, setRefreshTimer] = useState(true);

  const constructCards = () => {
    const constructedMatchedIds = {};
    const cardPairs = Array.from({ length: totalPairs }, (_, index) => {
      const id1 = uuidv4();
      const id2 = uuidv4();
      const icon = icons[index];

      constructedMatchedIds[id1] = id2;
      constructedMatchedIds[id2] = id1;

      const card1 = {
        id: id1,
        icon,
        visible: false,
        permanentlyVisible: false,
      };

      const card2 = {
        id: id2,
        icon,
        visible: false,
        permanentlyVisible: false,
      };

      return [card1, card2];
    });

    // @ts-ignore
    const constructedCards = cardPairs.flat();
    const shuffledCards = shuffle(constructedCards);
    setMatchedIds(constructedMatchedIds);
    setCards(shuffledCards);
  };

  const restartGame = () => {
    setCards([]);
    setMatchedIds({});
    constructCards();
    setRefreshTimer((prevState) => !prevState);
  };

  useEffect(() => {
    constructCards();
  }, []);

  return cards.length ? <Cards passedCards={cards} matchedIds={matchedIds} totalPairs={totalPairs} restartGame={restartGame} refreshTimer={refreshTimer} /> : '';
};

export default App;
