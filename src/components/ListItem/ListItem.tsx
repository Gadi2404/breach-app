import { FC, SyntheticEvent, useRef, forwardRef, useEffect } from 'react';
import './ListItem.css';
import { setUserLocalData, getUserLocalData } from '../../services/local-data';
import { BreachData } from '../../types';

interface ListItemProps {
  breach: BreachData
};

const ListItem = forwardRef<HTMLLIElement, ListItemProps>(({ breach }, listItemRef) => {
  const { selectedBreach = '' } : { selectedBreach: string } = getUserLocalData();

  if (!breach || !Object.keys(breach)?.length) {
    return null;
  }

  const { Title, BreachDate, LogoPath, ...additionalData } = breach;

  const onListItemClick = (e: SyntheticEvent): void => {
    const currentListItem = e.currentTarget.parentElement;
    const currentListItemName = currentListItem?.getAttribute('data-breach-name');

    // get all list items elements
    const listItemsArr = [...document.querySelectorAll('.breach-list-item')];

    listItemsArr.forEach((listItem) => {
      // don't remove the class from the current list item in order to enable toggling
      if(listItem === currentListItem) {
        return;
      }

      // remove the class name from all other list items to insure that only one item can be selected
      listItem.classList.remove('selected');
    });

    // toggle "selected" class name in order to open/close the additional info section
    currentListItem?.classList.toggle('selected');

    // save the selected list items in local storage
    setUserLocalData({
      selectedBreach: currentListItem?.classList.contains('selected') ? currentListItemName : ''
    });
  };

  return (
    <li className={`breach-list-item ${selectedBreach === Title ? 'selected' : ''}`} data-breach-name={Title} ref={listItemRef} >
      <div className="breach-data row" onClick={onListItemClick}>
        <span className="list-item-cell breach-title">{Title}</span>
        <span className="list-item-cell breach-date">{BreachDate}</span>
        <span className="list-item-cell">
          <img src={LogoPath} className="breach-icon" />
        </span>
      </div>

      <div className="additional-info">
          {
            Object.keys(additionalData).map((keyName: string, index: number) => {
              return (
                <div className="info-block" key={keyName}>
                  <span className='list-item-cell'>{keyName}:</span>
                  <span className='list-item-cell' dangerouslySetInnerHTML={{__html: Object.values(additionalData)[index]}} />
                </div>
              );
            })
          }
      </div>
    </li>
  );
});

export default ListItem;
