import Downshift from "downshift";
import React from "react";

/* This is just a basic Downshift select component that I replaced
* the normal matching algo with the bk tree one.
*/
const BKDownshift = ({
  bkTree,
  distance = 2,
  resultLimit = 20,
  selectCallBack
}) => (
  <Downshift onChange={selectCallBack ? selectCallBack : null}>
    {({
      getInputProps,
      getItemProps,
      getLabelProps,
      isOpen,
      inputValue,
      highlightedIndex,
      selectedItem
    }) => (
      <div>
        <label {...getLabelProps()}>Enter a Name </label>
        <input {...getInputProps()} />
        {isOpen ? (
          <div>
            {inputValue &&
              bkTree
                .query(inputValue.toLowerCase(), distance, resultLimit)
                .map((item, index) => (
                  <div
                    {...getItemProps({
                      key: item.term,
                      index,
                      item: item.term,
                      style: {
                        backgroundColor:
                          highlightedIndex === index ? "lightgray" : "white",
                        fontWeight:
                          selectedItem === item.term ? "bold" : "normal"
                      }
                    })}
                  >
                    {`name: ${item.term[0].toUpperCase() +
                      item.term.slice(1)} distance: ${item.dist}`}
                  </div>
                ))}
          </div>
        ) : null}
      </div>
    )}
  </Downshift>
);

export default BKDownshift;
