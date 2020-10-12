import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';

const Cards = ({
  passedCards, matchedIds, totalPairs, restartGame,
}) => {
  const [cards, setCards] = useState(passedCards);
  const [clickedPair, setClickedPair] = useState([]);
  const [pairsGuessed, setPairsGuessed] = useState(0);
  const [pairsGuessedCorrectly, setPairsGuessedCorrectly] = useState(0);
	const [gameWon, setGameWon] = useState(false);
	const [cardsDisabled, setCardsDisabled] = useState(false);

  // console.log(cards);
  const handleCardClick = (e) => {
    e.persist();
    const currentId = e.currentTarget.id;

    if (currentId === clickedPair[0]) {
      // console.log('same id');
      return;
    }

    const clonedCards = cards.map((card) => (
      card.id === currentId
        ? { ...card, visible: true }
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
    // console.log('clickedpair updated');
    // console.log('clickedPair.length', clickedPair.length);
    if (clickedPair.length === 2) {
      const id1 = clickedPair[0];
      const id2 = clickedPair[1];

      // console.log(matchedIds[id1]);
      // console.log(id2);
      if (matchedIds[id1] === id2) {
        const clonedCards = cards.map((card) => (
          card.id === id1 || card.id === id2
            ? { ...card, permanentlyVisible: true }
            : card));
        setCards(clonedCards);
        setPairsGuessedCorrectly(pairsGuessedCorrectly + 1);
      } else {
				(async () => {
					setCardsDisabled(true);
					await new Promise(resolve => setTimeout(resolve, 1000));
					const clonedCards = cards.map((card) => ({ ...card, visible: false }));
					setCardsDisabled(false);
					setCards(clonedCards);
				})();
      }
      setClickedPair([]);
      setPairsGuessed(pairsGuessed + 1);
    }
  }, [clickedPair]);

  const verifyWin = () => {
    if (pairsGuessedCorrectly === totalPairs) {
      setGameWon(true);
    }
  };

  useEffect(() => {
    verifyWin();
  }, [pairsGuessedCorrectly]);

  console.log('[Cards] renders');

  // console.log('clickedPair', clickedPair);
  return (
    <>
      {gameWon && <h1>Congratulations! You have found all the pairs.</h1>}
      <h5>{`Pairs guessed: ${pairsGuessed}`}</h5>
      <h5>{`Pairs guessed correctly: ${pairsGuessedCorrectly}`}</h5>
      <button type="button" onClick={() => restartGame()}>Restart</button>
      <div className="card-container">

        {cards.map((card) => {
          const visible = (card.visible || card.permanentlyVisible) ? 'card--visible' : '';
          return (
            <button
              className={`card ${visible}`}
              id={card.id}
              key={card.id}
              onClick={handleCardClick}
							type="button"
							disabled={cardsDisabled}
            >
              {card.icon}
            </button>
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
};

export default Cards;
