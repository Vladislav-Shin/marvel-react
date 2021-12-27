import "./charList.scss";
import { useEffect, useRef, useState } from "react";
import { CSSTransition, TransitionGroup } from "react-transition-group";
import useMarvelServices from "../../services/MarvelServices";
import ErrorMessage from "../errorMessage/ErrorMessage";
import Spinner from "../spinner/Spinner";
import PropTypes from "prop-types";

const CharList = (props) => {
  const [charList, setCharList] = useState([]);
  const [newItemLoading, setNewItemLoading] = useState(false);
  const [offset, setOffset] = useState(210);
  const [charEnded, setCharEnded] = useState(false);

  const {loading, error, getAllCharacters} = useMarvelServices();

  useEffect(() => {
    onRequest(offset, true);
  }, []);

  const onRequest = (offset, initial) => {
    initial ? setNewItemLoading(false) : setNewItemLoading(true);
    getAllCharacters(offset)
      .then(onCharListLoaded)
  };

  const onCharListLoaded = (newCharList) => {

    let ended = false;
    if (newCharList.length < 9) {
      ended = true;
    }

    setCharList((charList) => [...charList, ...newCharList]);
    setNewItemLoading(false);
    setOffset((offset) => offset + 9);
    setCharEnded(charEnded => ended)
  };

  const itemRef = useRef([]);

  const focusOnItem = (id) => {
    itemRef.current.forEach((item) =>
      item.classList.remove("char__item_selected")
    );
    itemRef.current[id].classList.add("char__item_selected");
    itemRef.current[id].focus();
  };

  const renderItems = (arr) => {
    const items = arr.map((item, i) => {
      let imgStyle = { objectFit: "cover" };
      if (
        item.thumbnail ===
        "http://i.annihil.us/u/prod/marvel/i/mg/b/40/image_not_available.jpg"
      ) {
        imgStyle = { objectFit: "fill" };
      }
      return (
/*         <CSSTransition
          classNames="char__item"
          key={item.id}
          timeout={500}> */
        <li
        key={item.id}
          ref={(el) => (itemRef.current[i] = el)}
          tabIndex={0}
          className="char__item"
          onClick={() => {
            focusOnItem(i);
            props.onCharSelected(item.id);
          }}
          onKeyPress={(e) => {
            if (e.key === "Enter") {
              focusOnItem(i);
              props.onCharSelected(item.id);
            }
          }}>
          <img src={item.thumbnail} alt={item.name} style={imgStyle} />
          <div className="char__name">{item.name}</div>
        </li>


      );
    });

    return (
      <ul className="char__grid">
{/*         <TransitionGroup component={null}>
          {items}
        </TransitionGroup> */}
        {items}
      </ul>
    )
  };

  const items = renderItems(charList);
  const errorMessage = error ? <ErrorMessage /> : null;
  const spinner = loading && !newItemLoading ? <Spinner /> : null;
/*   const content = !(loading || error) ? item : null; */

  return (
    <div className="char__list">
      {errorMessage}
      {spinner}
      {items}
      <button
        disabled={newItemLoading}
        style={{ display: charEnded ? "none" : "block" }}
        onClick={() => onRequest(offset)}
        className="button button__main button__long">
        <div className="inner">load more</div>
      </button>
    </div>
  );
};

CharList.propTypes = {
  onCharSelected: PropTypes.func.isRequired,
};

export default CharList;
