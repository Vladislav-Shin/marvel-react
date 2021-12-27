import './comicsList.scss';
import useMarvelServices from '../../services/MarvelServices';
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { render } from '@testing-library/react';
import Spinner from '../spinner/Spinner';
import ErrorMessage from '../errorMessage/ErrorMessage';

const ComicsList = () => {

    const [comicsList, setComicsList] = useState([]);
    const [offset, setOffset] = useState(0);
    const [newItemLoading, setNewItemLoading] = useState(false);
    const [charEnded, setCharEnded] = useState(false);

    const {loading, error, getAllComics} = useMarvelServices();
    
    useEffect(() => {
        onRequest(offset, true)
    }, [])

    const onComicsListLoaded = (newComicsList) => {
        let ended = false;
        if (newComicsList.length < 8) {
            ended = true;
        }

        setComicsList((comicsList) => [...comicsList, ...newComicsList]);
        setNewItemLoading(false)
        setOffset((offset) => offset + 8);
        setCharEnded(charEnded => ended)
    }

    const onRequest = (offset, initial) => {
        initial ? setNewItemLoading(false) : setNewItemLoading(true);
        getAllComics(offset)
            .then(onComicsListLoaded);
    }

    const renderItems = (arr) => {
        const items = arr.map((item, i) => {
            return (
                <li className="comics__item" key={i}>
                <Link to={`/comics/${item.id}`}>
                    <img src={item.thumbnail} alt={item.thumbnail} className="comics__item-img"/>
                    <div className="comics__item-name">{item.title}</div>
                    <div className="comics__item-price">{item.price}</div>
                </Link>
            </li>
            )
        })

        return <ul className='comics__grid'>{items}</ul>
    }

    const items = renderItems(comicsList);
    const spinner = loading && !newItemLoading ? <Spinner/> : null;
    const errorMessage = error ? <ErrorMessage/> : null;

    return (
        <div className="comics__list">
            {spinner}
            {errorMessage}
            {items}
            <button 
            disabled={newItemLoading}
            style={{display: charEnded ? "none" : 'block'}}
            onClick={() => onRequest(offset)}
            className="button button__main button__long">
                <div className="inner">load more</div>
            </button>
        </div>
    )
}

export default ComicsList;