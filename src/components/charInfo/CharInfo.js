import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import useMarvelServices from "../../services/MarvelServices";
import Spinner from "../spinner/Spinner";
import ErrorMessage from "../errorMessage/ErrorMessage";
import Skeleton from "../skeleton/Skeleton";

import "./charInfo.scss";

const CharInfo = (props) => {
  const [char, setChar] = useState(null);

  const {loading, error, getCharacter, clearError} = useMarvelServices();

  useEffect(() => {
    upDataChar();
  }, [props.charId]);

  const onCharLoaded = (char) => {
    setChar(char);
  };

  const upDataChar = () => {
    const { charId } = props;
    if (!charId) {
      return;
    }
    clearError();
    getCharacter(charId)
    .then(onCharLoaded)
  };

  const errorMessage = error ? <ErrorMessage /> : null;
  const spinner = loading ? <Spinner /> : null;
  const skeleton = loading || error || char ? null : <Skeleton />;
  const content = !(loading || error || !char) ? <View char={char} /> : null;

  return (
    <div className="wrapper_char-info">
    <div className="char__info">
      {errorMessage}
      {spinner}
      {skeleton}
      {content}
    </div>
    </div>
  );
};



const View = ({ char }) => {
  const { name, description, thumbnail, homepage, wiki, comics } = char;
  let imgStyle = { objectFit: "cover" };

  if (
    thumbnail ===
    "http://i.annihil.us/u/prod/marvel/i/mg/b/40/image_not_available.jpg"
  ) {
    imgStyle = { objectFit: "fill" };
  }

  return (
    <>
      <div className="char__basics">
        <img src={thumbnail} alt="abyss" style={imgStyle} />
        <div>
          <div className="char__info-name">{name}</div>
          <div className="char__btns">
            <a href={homepage} className="button button__main">
              <div className="inner">homepage</div>
            </a>
            <a href={wiki} className="button button__secondary">
              <div className="inner">Wiki</div>
            </a>
          </div>
        </div>
      </div>
      <div className="char__descr">{description}</div>
      <div className="char__comics">Comics:</div>
      <ul className="char__comics-list">
        {comics.length > 0 ? null : "There is no comics with this character"}
        {comics
          .map((item, i) => {
            const charId = (item.resourceURI.match(/\d+/g)[1])
            return (
              <li key={i} className="char__comics-item">
                <Link to={`/comics/${charId}`}>{item.name}</Link>
              </li>
            );
          })
          .slice(0, 10)}
      </ul>
    </>
  );
};

export default CharInfo;
