import {DreamCart} from "../../components/DreamCart/DreamCart"
import {useAppDispatch, useAppSelector} from "../../app/hooks"
import {ChangeEvent, useEffect, useState} from "react";
import {dreamsInit} from "../../features/dreamsFeature";
import {FormControl, IconButton, InputAdornment, MenuItem, OutlinedInput, Pagination, Select, SelectChangeEvent} from "@mui/material";
import {useSearchParams} from "react-router-dom";
import {getSearchWith, SearchParams} from "../../utils/searchHelper";
import SearchIcon from "@mui/icons-material/Search";
import { Dream, DreamCategory } from "../../types/Dream";

enum PostsPerPage {
  six = 6,
  tvelw = 12,
  tventyFour = 24,
}

export const DreamsGalleryPage = () => {
  const {dreams} = useAppSelector(store => store.dreams);
  const [searchParams, setSearchParams] = useSearchParams();
  const [pages, setPages] = useState<number>(0);
  const [currentQuery, setCurrentQuery] = useState<string>("");
  
  const dispatch = useAppDispatch();

  const perPage = searchParams.get("postsPerPage") || PostsPerPage.six.toString();
  const page = searchParams.get("page") ? parseInt(searchParams.get("page") as string, 10) : 1;
  const category = searchParams.get("category") || DreamCategory.All;
  const [dreamsForShow, setDreamsForShow] = useState<Dream[]>([]);

  useEffect(() => {
    if (category !== DreamCategory.All && dreams) {
      const tempDreams = dreams.filter(dream => !dream.category.localeCompare(category));
      setDreamsForShow([...tempDreams]);
    } else {
      setDreamsForShow([...dreams]);
    }
  }, [category, dreams]);

  const setSearchWith = (params: SearchParams) => {
    const search = getSearchWith(params, searchParams);

    setSearchParams(search);
  };

  useEffect(() => {
    dispatch(dreamsInit());
    setSearchParams({ page: "1", postsPerPage: PostsPerPage.six.toString(), category: DreamCategory.All });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (dreams) {
      setPages(Math.ceil(dreams.length / +perPage));
    }
  }, [searchParams, dreams, perPage]);

  const handlePageChange = (_event: ChangeEvent<unknown>, page: number) => {
    document.documentElement.scrollTop = 0;
    setSearchWith({ page: page.toString() });
  }

  const handleCategorySelect = (e: SelectChangeEvent<DreamCategory>) => {
    setSearchWith({
      page: "1",
      postsPerPage: perPage,
      category: e.target.value.toString()
    });
  }

  const handlePostsPerPageChange = (e: SelectChangeEvent<PostsPerPage>) => {
    setSearchWith({
      page: "1",
      postsPerPage: e.target.value.toString()
    });
  }

  const handleChangeQuery = (e: ChangeEvent<HTMLInputElement>) => {
    setCurrentQuery(e.target.value);
    console.log(currentQuery)
  };

  return (
    <section className="dreams-gallery">
      <div className="container">
        <form className="dreams-gallery__form">
          <FormControl className="dreams-gallery__search">
            <OutlinedInput
              placeholder="Search"
              onChange={handleChangeQuery}
              endAdornment={
                <InputAdornment position="end">
                  <IconButton onClick={() => {}}>
                    <SearchIcon />
                  </IconButton>
                </InputAdornment>
              }
            />
          </FormControl>
          <FormControl className="dreams-gallery__category">
            <Select
              defaultValue={DreamCategory.All}
              onChange={handleCategorySelect}
              sx={{ width: 200 }}
            >
              <MenuItem value={DreamCategory.All} selected>
                All categories
              </MenuItem>
              <MenuItem value={DreamCategory.Money_donation}>
                Money donation
              </MenuItem>
              <MenuItem value={DreamCategory.Gifts}>Gifts</MenuItem>
              <MenuItem value={DreamCategory.Volunteer_services}>
                Volunteer services
              </MenuItem>
            </Select>
          </FormControl>
          <FormControl className="dreams-gallery__filter">
            <Select
              defaultValue={PostsPerPage.six}
              onChange={handlePostsPerPageChange}
              sx={{ width: 100 }}
            >
              <MenuItem value={PostsPerPage.six}>{PostsPerPage.six}</MenuItem>
              <MenuItem value={PostsPerPage.tvelw}>
                {PostsPerPage.tvelw}
              </MenuItem>
              <MenuItem value={PostsPerPage.tventyFour}>
                {PostsPerPage.tventyFour}
              </MenuItem>
            </Select>
          </FormControl>
        </form>
        <div className="dreams-gallery__content">
          {dreamsForShow &&
            dreamsForShow
              .slice(
                +perPage * (+page - 1),
                Math.min(+page * +perPage, dreams.length)
              )
              .map((dream) => (
                <div key={dream.id} className="dreams-gallery__item">
                  <DreamCart dream={dream} />
                </div>
              ))}
        </div>
        <Pagination
          className="dreams-gallery__pagination"
          count={pages}
          page={page || 1}
          variant="outlined"
          onChange={handlePageChange}
        />
      </div>
    </section>
  );
}