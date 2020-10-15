import React, { useEffect, useState } from 'react';

const Timer = ({refreshTimer, gameWon}) => {

	const [time, setTime] = useState(0);
	
	useEffect(() => {
		const interval = setInterval(() => {
			return setTime(time => time + 1000);
		}, 1000);

		if(gameWon) {
			clearInterval(interval);
		}
		return () => {
			clearInterval(interval);
		}
	}, [gameWon])

	useEffect(() => {
		setTime(0);
	}, [refreshTimer])

	return (
		<div className="info_timer">
			{
				`${Math.floor(time / 60000)} : ${(time / 1000) % 60}`
			}
		</div>
	)
}

export { Timer };