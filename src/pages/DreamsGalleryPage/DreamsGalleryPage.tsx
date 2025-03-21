import {DreamCart} from "../../components/DreamCart/DreamCart"
import {useAppDispatch, useAppSelector} from "../../app/hooks"
import {ChangeEvent, useEffect, useRef, useState} from "react";
import {dreamsInit} from "../../features/dreamsFeature";
import {FormControl, IconButton, InputAdornment, MenuItem, OutlinedInput, Pagination, Select, SelectChangeEvent} from "@mui/material";
import {useSearchParams} from "react-router-dom";
import {getSearchWith, SearchParams} from "../../utils/searchHelper";
import SearchIcon from "@mui/icons-material/Search";
import { Dream, DreamCategory } from "../../types/Dream";

// search
import Fuse from "fuse.js";

enum PostsPerPage {
  six = 6,
  tvelw = 12,
  tventyFour = 24,
}

export const DreamsGalleryPage = () => {
  //#region declaration

  const { dreams } = useAppSelector((store) => store.dreams);
  const [searchParams, setSearchParams] = useSearchParams();
  const [pages, setPages] = useState<number>(0);
  const [currentQuery, setCurrentQuery] = useState<string>("");
  const paginationRef = useRef(null);
  const currentQueryRef = useRef(null);

  const dispatch = useAppDispatch();

  // const searchDreams = new Fuse(dreams);
  // const options = {
  //   includeScore: true,
  //   limit: 10, // or any other number you prefer
  // };

  const perPage =
    searchParams.get("postsPerPage") || PostsPerPage.six.toString();
  const page = searchParams.get("page")
    ? parseInt(searchParams.get("page") as string, 10)
    : 1;
  const category = searchParams.get("category") || DreamCategory.All;

  const [dreamsForShow, setDreamsForShow] = useState<Dream[]>([]);

  //#endregion

  //#region hooks

  useEffect(() => {
    if (category !== DreamCategory.All && dreams) {
      const tempDreams = dreams.filter(
        (dream) => !dream.category.localeCompare(category)
      );
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
    setSearchParams({
      page: localStorage.getItem("currentPage") || "1",
      postsPerPage:
        localStorage.getItem("postsPerPage") || PostsPerPage.six.toString(),
      category:
        (localStorage.getItem("selectedCategory") as DreamCategory) ||
        DreamCategory.All,
    });

    const lastScrollPosition = localStorage.getItem("lastScrollPosition");
    if (lastScrollPosition) {
      window.scrollTo({ top: +lastScrollPosition });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (dreamsForShow) {
      setPages(Math.ceil(dreamsForShow.length / +perPage));
    }
  }, [searchParams, dreamsForShow, perPage]);

  //#endregion

  //#region handlers

  const handlePageChange = (_event: ChangeEvent<unknown>, page: number) => {
    document.documentElement.scrollTop = 0;
    setSearchWith({ page: page.toString() });
    localStorage.setItem("currentPage", page.toString());
  };

  const handleCategorySelect = (e: SelectChangeEvent<DreamCategory>) => {
    setSearchWith({
      page: "1",
      postsPerPage: perPage,
      category: e.target.value.toString(),
    });

    localStorage.setItem("selectedCategory", e.target.value.toString());
    localStorage.setItem("currentPage", "1");
  };

  const handlePostsPerPageChange = (e: SelectChangeEvent<PostsPerPage>) => {
    setSearchWith({
      page: "1",
      postsPerPage: e.target.value.toString(),
    });

    localStorage.setItem("postsPerPage", e.target.value.toString());
    localStorage.setItem("currentPage", "1");
  };

  const handleChangeQuery = (e: ChangeEvent<HTMLInputElement>) => {
    setCurrentQuery(e.target.value);

  };

  const handleAplyQuery = () => {
    console.log(currentQuery);
        if (!dreams || dreams.length === 0) return;
        const keys = Object.keys(dreams[0]);

        const searchDreams = new Fuse(dreams, {
          keys: keys,
          includeScore: true,
        });

        const result = searchDreams.search(currentQuery);
        console.log(result, dreamsForShow)
        setDreamsForShow(result.map(item => item.item));
        setSearchWith({
          page: "1",
          postsPerPage: perPage,
          category: category,
          query: currentQuery,
        });
        setCurrentQuery('');
  }

  //#endregion

  return (
    <section className="dreams-gallery">
      <div className="container">
        <form className="dreams-gallery__form">
          <FormControl className="dreams-gallery__search">
            <OutlinedInput
              ref={currentQueryRef}
              value={currentQuery}
              placeholder="Search"
              onChange={handleChangeQuery}
              endAdornment={
                <InputAdornment position="end">
                  <IconButton onClick={handleAplyQuery}>
                    <SearchIcon />
                  </IconButton>
                </InputAdornment>
              }
            />
          </FormControl>

          <FormControl className="dreams-gallery__category">
            <Select
              defaultValue={
                (localStorage.getItem("selectedCategory") as DreamCategory) ??
                DreamCategory.All
              }
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
              defaultValue={
                localStorage.getItem("postsPerPage")
                  ? +(localStorage.getItem("postsPerPage") || PostsPerPage.six)
                  : PostsPerPage.six
              }
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

        {pages > 1 && (
          <Pagination
            ref={paginationRef}
            className="dreams-gallery__pagination"
            count={pages}
            page={page || 1}
            siblingCount={0}
            boundaryCount={1}
            variant="outlined"
            onChange={handlePageChange}
          />
        )}
      </div>
    </section>
  );
}