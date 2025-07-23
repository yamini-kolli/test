import React, {useEffect,useState,useContext} from "react";
import {AppContext} from '../context/AppContext';
import { useNavigate } from "react-router-dom";

const OutOfCredits = () => {
  const { credit, loadCreditsData } = useContext(AppContext);
  const navigate = useNavigate();
  const [timeLeft, setTimeLeft] = useState({ hours: 0, minutes: 0, seconds: 0 });

  const calculateTimeLeft = () => {
    const stored = localStorage.getItem('lastCreditUsedTime');
    if (!stored) return;

    const lastUsed = new Date(stored);
    const nextCreditTime = new Date(lastUsed.getTime() + 24 * 60 * 60 * 1000);
    const now = new Date();
    const diff = nextCreditTime - now;

    if (diff <= 0) {
      loadCreditsData();
      return navigate('/result');
    }

    setTimeLeft({
      hours: Math.floor(diff / (1000 * 60 * 60)),
      minutes: Math.floor((diff / (1000 * 60)) % 60),
      seconds: Math.floor((diff / 1000) % 60)
    });
  };

  useEffect(() => {
    const interval = setInterval(calculateTimeLeft, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className='flex flex-col items-center justify-center min-h-[80vh] text-center'>
      <h1 className='text-2xl font-bold text-gray-700 mb-4'>You’ve run out of credits!</h1>
      <p className='text-gray-600 text-lg mb-2'>+2 free credits will be added in:</p>
      <p className='text-xl font-mono text-blue-800'>
        {`${timeLeft.hours.toString().padStart(2, '0')} : ${timeLeft.minutes.toString().padStart(2, '0')} : ${timeLeft.seconds.toString().padStart(2, '0')}`}
      </p>
      <p className='text-sm mt-6 text-gray-500 max-w-md'>
        Come back in 24 hours after your last generation and enjoy 2 more free credits!
      </p>
    </div>
  );
};

export default OutOfCredits;
