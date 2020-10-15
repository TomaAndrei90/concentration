/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { VscDebugRestart } from 'react-icons/vsc';
import Timer from './Timer';

const Cards = ({
  passedCards, matchedIds, totalPairs, restartGame, refreshTimer,
}) => {
  const [cards, setCards] = useState(passedCards);
  const [clickedPair, setClickedPair] = useState([]);
  const [pairsGuessed, setPairsGuessed] = useState(0);
  const [pairsGuessedCorrectly, setPairsGuessedCorrectly] = useState(0);
  const [gameWon, setGameWon] = useState(false);
  const [cardsDisabled, setCardsDisabled] = useState(false);

  const handleCardClick = (e) => {
    e.persist();
    const currentId = e.currentTarget.id;

    if (currentId === clickedPair[0]) {
      return;
    }

    const clonedCards = cards.map((card) => (
      card.id === currentId
        ? { ...card, flipped: true }
        : card));
    setCards(clonedCards);
    setClickedPair([...clickedPair, currentId]);
  };

  useEffect(() => {
    setCards(passedCards);
    setClickedPair([]);
    setPairsGuessed(0);
    setPairsGuessedCorrectly(0);
    setGameWon(false);
  }, [passedCards]);

  useEffect(() => {
    if (clickedPair.length === 2) {
      const id1 = clickedPair[0];
      const id2 = clickedPair[1];

      if (matchedIds[id1] === id2) {
        const clonedCards = cards.map((card) => (
          card.id === id1 || card.id === id2
            ? { ...card, permanentlyFlipped: true }
            : card));
        setCards(clonedCards);
        setPairsGuessedCorrectly((pairsGuessedCorrectly) => pairsGuessedCorrectly + 1);
      } else {
        (async () => {
          setCardsDisabled(true);
          await new Promise((resolve) => setTimeout(resolve, 1000));
          const clonedCards = cards.map((card) => ({ ...card, flipped: false }));
          setCardsDisabled(false);
          setCards(clonedCards);
        })();
      }
      setClickedPair([]);
      setPairsGuessed((pairsGuessed) => pairsGuessed + 1);
    }
  }, [clickedPair, cards, matchedIds]);

  useEffect(() => {
    const verifyWin = () => {
      if (pairsGuessedCorrectly === totalPairs) {
        setGameWon(true);
      }
    };
    verifyWin();
  }, [totalPairs, pairsGuessedCorrectly]);

  return (
    <>
      <div className="info">
        <h5 className="info__text">{`Pairs guessed: ${pairsGuessed}`}</h5>
        <h5 className="info__text">{`Pairs guessed correctly: ${pairsGuessedCorrectly}`}</h5>
        <h5 className="info__win">{gameWon && 'Congratulations! You have found all the pairs.'}</h5>
        <button type="button" className="button-restart" onClick={() => restartGame()}>
          <VscDebugRestart />
        </button>
        <Timer refreshTimer={refreshTimer} gameWon={gameWon} />
      </div>
      <div className="card-container">

        {cards.map((card) => {
          const flipped = (card.flipped || card.permanentlyFlipped) ? 'is-flipped' : '';
          return (
            <div className="card-scene" key={card.id}>
              <div className={`card ${flipped}`}>
                <div className="card__face card__face--front">
                  <button
                    className="card__button"
                    id={card.id}
                    onClick={handleCardClick}
                    type="button"
                    disabled={cardsDisabled}
                  />
                </div>
                <div className="card__face card__face--back">
                  <button
                    className="card__button"
                    id={card.id}
                    onClick={handleCardClick}
                    type="button"
                    disabled={cardsDisabled}
                  >
                    {card.icon}
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
};

Cards.propTypes = {
  passedCards: PropTypes.arrayOf(PropTypes.object).isRequired,
  matchedIds: PropTypes.objectOf(PropTypes.string).isRequired,
  totalPairs: PropTypes.number.isRequired,
  restartGame: PropTypes.func.isRequired,
  refreshTimer: PropTypes.bool.isRequired,
};

export default Cards;
