import { FC, SyntheticEvent, useRef, useEffect } from 'react';
import ListItem from '../ListItem/ListItem';
import Toggle from '../Toggle/Toggle';
import './List.css';
import { BreachData } from '../../types';
import useEffectOnce from '../../hooks/use-effect-once';
import { getUserLocalData } from '../../services/local-data';

export interface ListProps {
  breachListData: BreachData[],
  updateList: () => void
};

const List: FC<ListProps> = ({ breachListData, updateList }) => {
  const breachesListRef = useRef<HTMLUListElement>(null);
  const breachesListItemsRef = useRef<HTMLLIElement[]>([]);
  const { selectedBreach = '' } : { selectedBreach: string } = getUserLocalData();

  useEffectOnce(() => {
    breachesListItemsRef.current.forEach((breachesListItem) => {
      const listItemElmName = breachesListItem?.getAttribute('data-breach-name');
  
      if (listItemElmName === selectedBreach) {
        // if there is a selected (open) item saved on page refresh, scroll to this item
        breachesListItem?.scrollIntoView();
      }
    });
  });

  useEffect(() => {
    const options = {
      root: breachesListRef?.current, // the scroll container
      rootMargin: '0px',
      threshold: 1.0
    };

    // the element to target 
    // in this case target the 3rd list item from the bottom so it can lazy load to content before the scroll get to the bottom of the list
    const targetElement = breachesListItemsRef?.current[breachesListItemsRef.current.length - 3];

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(async (entry) => {
        if(entry.isIntersecting) {
          const loadingBottomSectionElm = document.querySelector('.bottom-list-section .loading-spinner');

          // remove the "hide" class in order to display the loading animation
          loadingBottomSectionElm?.classList.remove('hide');
          
          // do the call to fetch new list items
          await updateList();

          // add the "hide" class after the loading finish in order to hide the loading animation
          loadingBottomSectionElm?.classList.add('hide');
        }
      });
    }, options);

    targetElement && observer.observe(targetElement);

    return () => {
      targetElement && observer.unobserve(targetElement);
    }
  }, [breachListData]);

  return (
    <div className="list-container">
      <div className="list-header row">
        <span className="list-item-cell">Breach name</span>
        <span className="list-item-cell">Breach date</span>
        <span className="list-item-cell" />
        <Toggle />
      </div>
      {
        !breachListData.length ? 
        <div className="breaches-list loading-spinner" /> :
        <ul className="breaches-list" ref={breachesListRef}>
          {
            breachListData.map((breach: any, i: number) => {
              return (
                <ListItem key={breach.Name} breach={breach} ref={(el: HTMLLIElement) => (breachesListItemsRef.current[i] = el)} />
              );
            })
          }
        </ul>
      }
    </div>
  );
};

export default List;