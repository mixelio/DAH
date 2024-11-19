import {useContext} from "react"
import {DreamsContext} from "../../DreamsContext"
import {DreamCart} from "../../components/DreamCart/DreamCart"

export const DreamsGalleryPage = () => {
  const {dreams} = useContext(DreamsContext)
  return (
    <section className="dreams-gallery">
      <div className="container">
        <div className="dreams-gallery__content">
          {dreams &&
            dreams.map((dream) => (
              <div key={dream.id} className="dreams-gallery__item">
                <DreamCart dream={dream} />
              </div>
            ))}
        </div>
      </div>
    </section>
  );
}