import { useEffect, useRef, useState } from "react";
import styles from "./index.module.css";
import { CARD_STATE } from "../../model/CardInfo";

export default function Card({ info, setCardInfo }) {
  let throttle = false
  let parent = null;
  const el = useRef();
  const [imgLoading, setImgLoading] = useState(info.id ? false : true);

  useEffect(() => {
    parent = document.getElementById("container");
    parent.addEventListener("scroll", onScroll);
    if (isInContainer(el.current, parent)) {
      getCardInfo(info.name);
    }
  }, [])

  function onScroll() {
    clearTimeout(throttle);
    throttle = setTimeout(() => {
      if (isInContainer(el.current, parent)) {
        getCardInfo(info.name);
      }
    }, 200);
  }

  /**
   * loading pokemon sprite detail info
   * @param {*} name pokemon sprite name
   * @returns 
   */
  async function getCardInfo(name) {
    try {
      const res = await fetch(`https://pokeapi.co/api/v2/pokemon/${name}`);
      if (res.ok) {
        const data = await res.json();
        setCardInfo({
          ...info,
          ...data,
          state: CARD_STATE.FINISHED,
        });
        const img = new Image();
        img.onload = e => {
          setImgLoading(false);
          const color = getMainColor(img);
          setCardInfo({
            ...info,
            ...data,
            backgroundColor: color,
            state: CARD_STATE.FINISHED,
          });
        };
        img.src = data.sprites.back_default;
        img.crossOrigin = 'Anonymous';
        parent.removeEventListener("scroll", onScroll);
      } else {
        setCardInfo({ ...info, state: CARD_STATE.ERROR });
      }
    } catch {
      setCardInfo({ ...info, state: CARD_STATE.ERROR });
    }
  }

  /**
   * transform pokemon sprite name to render
   * @param {*} name pokemon sprite name
   * @returns 
   */
  function renderName(name) {
    return name.charAt(0).toLocaleUpperCase() + name.slice(1);
  }

  /**
   * get pokemon sprite main color
   * @param {*} img pokemon sprite image
   * @returns 
   */
  function getMainColor(img) {
    const canvas = document.createElement('canvas')
    canvas.width = 96;
    canvas.height = 96;
    const ctx = canvas.getContext('2d')
    ctx.drawImage(img, 0, 0, canvas.width, canvas.height)
    const data = ctx.getImageData(0, 0, canvas.width, canvas.height).data;

    const temp = {}
    const len = data.length
  
    let max = 0;
    let color = ''
    let i = 0
    while(i < len) {
      if (data[i + 3] !== 0) {
        const k = `${data[i]}, ${data[i + 1]}, ${data[i + 2]}, ${(data[i + 3] / 255)}`
        temp[k] = temp[k] ? temp[k] + 1 : 1
        if (temp[k] > max) {
          max = temp[k]
          color = k
        }
      }
      i += 4
    }
  
    return color
  }

  /**
   * check card DOM has in container view
   * @param {*} el card DOM
   * @param {*} container parent DOM
   * @returns 
   */
  function isInContainer (el, container) {
    if (!el || !container) return false;
  
    const elRect = el.getBoundingClientRect();
    let containerRect;
  
    if ([window, document, document.documentElement, null, undefined].includes(container)) {
      containerRect = {
        top: 0,
        right: window.innerWidth,
        bottom: window.innerHeight,
        left: 0
      };
    } else {
      containerRect = container.getBoundingClientRect();
    }
  
    return elRect.top < containerRect.bottom &&
      elRect.bottom > containerRect.top &&
      elRect.right > containerRect.left &&
      elRect.left < containerRect.right;
  };
  return (
    <div ref={el} className={styles.container}>
      <div className={styles.background} style={{backgroundColor: `rgba(${info.backgroundColor})`}}>
        <div className={styles.content}>
          <p className={styles.pokemonName}>{renderName(info.name)}</p>
          {
            info.state === CARD_STATE.ERROR ?
              <div className={styles.error}>
                <div className={styles.info}>
                  <p>Data Not Found</p>
                  <button onClick={e => getCardInfo(info.name)}>reload</button>
                </div>
              </div> : 
              <>
                <div className={`${styles.formImg} ${info.backgroundColor ? '' : styles.render}`}>
                  {
                    (info.state === CARD_STATE.LOADING || imgLoading) && <span>Image Loading</span>
                  }
                  <img className={`${styles.image} ${imgLoading ? styles.loading : ''}`} src={info.sprites.back_default} alt="back_default"/>
                  <p className={styles.tip}>{`No.${info.order}`}</p>
                </div>
                <div className={`${styles.statsList} ${info.backgroundColor ? '' : styles.render}`}>
                  {
                    info.state === CARD_STATE.LOADING ?
                      <>
                        <div style={{width: '120px'}} className={`${styles.loadingText} ${styles.item}`}></div>
                        <div style={{width: '80px'}} className={`${styles.loadingText} ${styles.item}`}></div>
                        <div style={{width: '100px'}} className={`${styles.loadingText} ${styles.item}`}></div>
                        <div style={{width: '140px'}} className={`${styles.loadingText} ${styles.item}`}></div>
                        <div style={{width: '80px'}} className={`${styles.loadingText} ${styles.item}`}></div>
                      </> : 
                      <>
                        {
                          info.stats.map(item => {
                            return <p className={styles.item} key={item.stat.name}>
                              <span className={styles.name}>{item.stat.name}</span>
                              <span className={styles.value}>{item.base_stat}</span>
                            </p>
                          })
                        }
                      </>
                  }
                </div>
              </>
            }
        </div>
      </div>
    </div>
  )
}
