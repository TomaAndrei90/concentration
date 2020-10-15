import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';

const Timer = ({ refreshTimer, gameWon }) => {
  const [time, setTime] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => setTime((time) => time + 1000), 1000);

    if (gameWon) {
      clearInterval(interval);
    }
    return () => {
      clearInterval(interval);
    };
  }, [gameWon]);

  useEffect(() => {
    setTime(0);
  }, [refreshTimer]);

  return (
    <div className="info_timer">
      {`${Math.floor(time / 60000)} : ${(time / 1000) % 60}`}
    </div>
  );
};

Timer.propTypes = {
  refreshTimer: PropTypes.bool.isRequired,
  gameWon: PropTypes.bool.isRequired,
};

export default Timer;
