import React from 'react';
import './flipClock.css';

interface AnimatedCardProps {
  animation: string;
  digit: string;
}

interface StaticCardProps {
  position: string;
  digit: string;
}

interface FlipUnitContainerProps {
  digit: number;
  shuffle: boolean;
  unit: string;
}

const AnimatedCard: React.FC<AnimatedCardProps> = ({ animation, digit }) => {
  return (
    <div className={`flipCard ${animation}`}>
      <span>{digit}</span>
    </div>
  );
};

const StaticCard: React.FC<StaticCardProps> = ({ position, digit }) => {
  return (
    <div className={position}>
      <span>{digit}</span>
    </div>
  );
};

const FlipUnitContainer: React.FC<FlipUnitContainerProps> = ({ digit, shuffle, unit }) => {
  const getPreviousDigit = (current: number): number => {
    if (unit === 'hours') {
      return current === 0 ? 23 : current - 1;
    }
    return current === 0 ? 59 : current - 1;
  };

  const previousDigit = getPreviousDigit(digit);

  const formatDigit = (d: number) => (d < 10 ? `0${d}` : `${d}`);

  const currentDigitString = formatDigit(digit);
  const previousDigitString = formatDigit(previousDigit);

  const animation = shuffle ? 'fold' : 'unfold';

  return (
    <div className={'flipUnitContainer'}>
      <StaticCard position={'upperCard'} digit={previousDigitString} />
      <AnimatedCard digit={previousDigitString} animation={shuffle ? 'fold' : ''} />
      <AnimatedCard digit={currentDigitString} animation={shuffle ? 'unfold' : ''} />
      <StaticCard position={'lowerCard'} digit={currentDigitString} />
    </div>
  );
};

const FlipClock: React.FC = () => {
  const [hours, setHours] = React.useState<number>(0);
  const [hoursShuffle, setHoursShuffle] = React.useState<boolean>(true);
  const [minutes, setMinutes] = React.useState<number>(0);
  const [minutesShuffle, setMinutesShuffle] = React.useState<boolean>(true);
  const [seconds, setSeconds] = React.useState<number>(0);
  const [secondsShuffle, setSecondsShuffle] = React.useState<boolean>(true);

  React.useEffect(() => {
    const timerID = setInterval(() => updateTime(), 1000);
    return () => clearInterval(timerID);
  }, [hours, minutes, seconds]);

  const updateTime = () => {
    const time = new Date();
    const newHours = time.getHours();
    const newMinutes = time.getMinutes();
    const newSeconds = time.getSeconds();

    if (newHours !== hours) {
      setHoursShuffle((prev) => !prev);
      setHours(newHours);
    }

    if (newMinutes !== minutes) {
      setMinutesShuffle((prev) => !prev);
      setMinutes(newMinutes);
    }

    if (newSeconds !== seconds) {
      setSecondsShuffle((prev) => !prev);
      setSeconds(newSeconds);
    }
  };

  return (
    <div className={'flipClock'}>
      <FlipUnitContainer unit={'hours'} digit={hours} shuffle={hoursShuffle} />
      <FlipUnitContainer unit={'minutes'} digit={minutes} shuffle={minutesShuffle} />
      <FlipUnitContainer unit={'seconds'} digit={seconds} shuffle={secondsShuffle} />
    </div>
  );
};

export default FlipClock;
