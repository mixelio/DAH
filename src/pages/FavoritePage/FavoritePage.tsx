import {useAppSelector} from "../../app/hooks";
import {DreamCart} from "../../components/DreamCart/DreamCart";
import styles from "./Favorites.module.scss";

export const FavoritePage = () => {
  const { userFavouriteList } = useAppSelector(store => store.users);
  console.log(userFavouriteList);

  return (
    <section className={styles.favorites}>
      <div className="container">
        <div className="dreams dreams-gallery__content">
          {userFavouriteList.map((dream) => (
            <DreamCart key={dream.id} dream={dream} />
          ))}
        </div>
      </div>
    </section>
  );
};