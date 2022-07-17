import { useState, FC, useEffect } from 'react';
import './App.css';
import List, { ListProps } from './components/List/List';
import getBreaches from './services/get-breaches';
import { setUserLocalData, getUserLocalData } from './services/local-data';
import { BreachData } from './types';
import useEffectOnce from './hooks/use-effect-once';

const App: FC = () => {
  const [breachListData, setBreachListData] = useState<BreachData[]>(getUserLocalData()?.breachesList || []);
  const [maxBreachSize, setMaxBreachSize] = useState<number>(0);

  const loadData = async (offset: number) => {
    const apiUrl: string = 'https://hiring.guardio.dev/fe/breaches';
    const apiDataResponse = await getBreaches(apiUrl, offset);

    return apiDataResponse;
  };

  const updateState = (breachList: BreachData[], total: number) => {
    // set the max breach list size, if the value is different from the current max value 
    if (total !== maxBreachSize) {
      setMaxBreachSize(total);
    }

    // update breachListData
    setBreachListData((previousList: BreachData[]): BreachData[] => {
      const updatedBreachList: BreachData[] = [
        ...previousList,
        ...breachList
      ];

      // save breachList in local storage in case of a page refresh in order to 
      // mark a selected item list (breach item) that is not in the first 10 items (for example the 75th item)
      setUserLocalData({
        breachesList: updatedBreachList
      });

      return updatedBreachList;
    });
  };

  // update the list with new data (incrementing the offset)
  const updateList = async (): Promise<void> => {
    const offset: number = breachListData.length + 10;

    // don't load more data if the offset is bigger than the maximum breaches
    if (maxBreachSize && offset > maxBreachSize) {
      return;
    }

    const { items, total }: { items: BreachData[], total: number } = await loadData(offset);

    if (items?.length) {
      updateState(items, total);
    }
  };

  useEffectOnce(async (): Promise<void> => {
    // don't load the initial data if there is already data from local storage
    if (breachListData?.length) {
      return;
    }

    // calling the first and second batches in parallel in oreder to create a scroll
    // in large screens resolution (for exmaple 969X1920) which require more than just 10 items for infinite scroll
    const [firstApiDataResponse, secondApiDataResponse] = await Promise.all([
      loadData(breachListData.length),
      loadData(breachListData.length + 10),
    ]);

    const breachList: BreachData[] = [
      ...firstApiDataResponse.items,
      ...secondApiDataResponse.items,
    ];

    updateState(breachList, firstApiDataResponse.total);
  });

  const listProps: ListProps = {
    updateList,
    breachListData
  };

  return (
    <div className="app">
      <List {...listProps} />
      <div className="bottom-list-section">
        <div className="list-count">Showing {breachListData.length} breaches out of {maxBreachSize}</div>
        <div className="loading-spinner hide" />
      </div>
    </div>
  )
};

export default App;
