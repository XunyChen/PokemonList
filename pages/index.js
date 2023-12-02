import { useEffect, useState } from "react";
import Card from "./components/Card";
import styles from "../styles/home.module.css";
import { PageData } from "./model/PageData";

export default function CardList(props) {
  let el = null;
  let ok = props.ok;
  let data = props.data;
  const [pageData, setPageData] = useState(new PageData(data));
  const [list, setList] = useState(pageData.results);
  const [loading, setLoading] = useState(false);
  const [notMore, setNotMore] = useState(false);

  useEffect(() => {
    el = document.getElementById("container");
    el.addEventListener("scroll", onScroll);
  }, [])

  async function onScroll() {
    if (!pageData.next) {
      return el.removeEventListener("scroll", onScroll);
    }
    doGetNextPageList();
  }

  /**
   * loading next page data
   * @param {*} el scroll DOM
   * @returns 
   */
  async function doGetNextPageList() {
    try {
      if (loading) {
        return;
      }
      const clientHeight = el.clientHeight;
      const scrollTop = el.scrollTop;
      const scrollHeight = el.scrollHeight;

      if (clientHeight + scrollTop === scrollHeight) {
        setLoading(true);
        const res = await fetch(pageData.next);
        if (res.ok) {
          const data = await res.json();
          pageData.next = data.next;
          pageData.previous = data.previous;
          pageData.concatList(data.results);
          if (!pageData.next) {
            setNotMore(true);
          }
          setList([...pageData.results]);
          setLoading(false);
        } else {
          setLoading(false);
        }
      }
    } catch {
      setLoading(false);
    }
  }

  /**
   * get card detail info and update list data
   * @param {*} cardInfo card detail info
   */
  function handleSetCardInfo(cardInfo) {
    pageData.results[cardInfo.index] = cardInfo;
    setList([...pageData.results]);
  }

  function handleGetCardList() {
    window.location.reload();
  }

  return (
    <div className={styles.container} id="container">
      {ok ?
        <>
          {
            list.map(item => {
              return <div className={styles.cardItem} key={item.url}>
                <Card info={item} parent={el} setCardInfo={handleSetCardInfo} ></Card>
              </div>
            })
          }
          {
            notMore ?
            <></> :
            <>
              {loading && <div>loading...</div>}
            </>
          }
        </> :
        <div>
          <p>Error</p>
          <button className={styles.reload} onClick={e => handleGetCardList()}>reload</button>
        </div>
      }
    </div>
  )
}

export async function getStaticProps() {
  try {
    const res = await fetch("https://pokeapi.co/api/v2/pokemon");
    if (res.ok) {
      const data = await res.json();
      return {
        props: {
          ok: true,
          data,
        }
      }
    }
    return {
      props: {
        ok: false,
        data: null,
      },
    }
  } catch {
    return {
      props: {
        ok: false,
        data: null,
      }
    }
  }
}
