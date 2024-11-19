import {useContext, useEffect} from "react"
import {DreamsContext} from "../../DreamsContext"
import {useParams} from "react-router-dom";

export const DreamPage = () => {
  const { currentDream, dreams, setCurrentDream } = useContext(DreamsContext);
  const { id } = useParams();

  useEffect(() => {
    setCurrentDream(dreams.find((dream) => String(dream.id) === id) || null);
  }, [])
  

  return (
    <section className="dream">
      <div className="container">
        {currentDream && (
          <div className="dream__content">
            <h2 className="dream__title">{currentDream.name}</h2>
          </div>
        )}
      </div>
    </section>
  );
}