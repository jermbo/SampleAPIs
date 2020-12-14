import { useEffect, useState } from 'react';

type ReturnState = {
  state: string;
};

function useTemplateName<T>(): ReturnState {
  const [state, setState] = useState('');

  useEffect(() => {
    setState('');
  }, [state]);

  return { state };
}

export default useTemplateName;
