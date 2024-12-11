// import {useContext} from "react"
// import {DreamsContext} from "../../DreamsContext"
import {DreamCart} from "../../components/DreamCart/DreamCart"
import {useAppDispatch, useAppSelector} from "../../app/hooks"
import {useEffect} from "react";
import {dreamsInit} from "../../features/dreamsFeature";

export const DreamsGalleryPage = () => {
  // const {dreams} = useContext(DreamsContext)
  const {dreams} = useAppSelector(store => store.dreams);
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(dreamsInit());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dreams])


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