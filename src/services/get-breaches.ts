import { BreachApiResponse } from '../types';

const getBreaches = async (url: string = '', offset: number = 0): Promise<BreachApiResponse> => {
  const response = await fetch(offset > 0 ? `${url}?offset=${offset}` : url, {
    headers: { 'X-Best-Pokemon': 'charizard' }
  });

  return await response.json();
};

export default getBreaches;
