import { useEffect, useRef } from 'react';

// a custome react hook that runs only once in order to avoid React 18 double render in dev mode
const useEffectOnce = (CB: () => void): void => {
  const effectCalled = useRef<boolean>(false);

  useEffect(() => {
    // this is a hack to avoid rendering twice in React 18 (only on dev mode). for more info:
    // https://www.techiediaries.com/react-18-useeffect/
    if (effectCalled.current) {
      return;
    }

    CB?.();
  
    effectCalled.current = true;
  }, []);
};

export default useEffectOnce;
