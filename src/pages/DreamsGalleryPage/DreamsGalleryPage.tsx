import {DreamCart} from "../../components/DreamCart/DreamCart"
import {useAppDispatch, useAppSelector} from "../../app/hooks"
import {ChangeEvent, useEffect, useRef, useState} from "react";
import {dreamsInit} from "../../features/dreamsFeature";
import {Checkbox, FormControl, FormControlLabel, IconButton, InputAdornment, MenuItem, OutlinedInput, Pagination, Select, SelectChangeEvent} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import {Link, useSearchParams} from "react-router-dom";
import {getSearchWith, SearchParams} from "../../utils/searchHelper";
import SearchIcon from "@mui/icons-material/Search";
import { Dream, DreamCategory, DreamStatus } from "../../types/Dream";

// search
import Fuse from "fuse.js";

enum PostsPerPage {
  six = 6,
  tvelw = 12,
  tventyFour = 24,
}

export const DreamsGalleryPage = () => {
  console.log("render")
  //#region declaration

  const { dreams } = useAppSelector((store) => store.dreams);
  const [searchParams, setSearchParams] = useSearchParams();
  const [pages, setPages] = useState<number>(0);
  const [currentQuery, setCurrentQuery] = useState<string>("");
  const [showCompleted, setShowCompleted] = useState<boolean>(false);
  const paginationRef = useRef(null);
  const currentQueryRef = useRef(null);

  const dispatch = useAppDispatch();
  const user = localStorage.getItem("currentUser");

  const perPage = searchParams.get("postsPerPage") || PostsPerPage.six.toString();
  const page = searchParams.get("page")
    ? parseInt(searchParams.get("page") as string, 10)
    : 1;
  const category = searchParams.get("category") || DreamCategory.All;

  const [dreamsForShow, setDreamsForShow] = useState<Dream[]>([]);

  const setSearchWith = (params: SearchParams) => {
    const search = getSearchWith(params, searchParams);

    setSearchParams(search);
  };

  //#endregion

  //#region hooks

  useEffect(() => {
    let tempDreams: Dream[] = [...dreams];

    if (!showCompleted) {
      tempDreams = [
        ...tempDreams.filter((dream) =>
          dream.status
            .toLowerCase()
            .localeCompare(DreamStatus.Completed.toLowerCase())
        ),
      ];
    }

    if (category !== DreamCategory.All && dreams) {
      tempDreams = [...tempDreams.filter(
        (dream) => !dream.category.localeCompare(category)
      )];
      setDreamsForShow([...tempDreams]);
    } else {
      setDreamsForShow([...dreams]);
    }

    setDreamsForShow([...tempDreams]);
  }, [category, dreams, showCompleted]);

  useEffect(() => {
    dispatch(dreamsInit());
    setSearchParams({
      page: localStorage.getItem("currentPage") || "1",
      postsPerPage:
        localStorage.getItem("postsPerPage") || user ? String(+PostsPerPage.six - 1) : String(PostsPerPage.six),
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
      query: "",
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
    setSearchWith({
      query: "",
    })
  };

  const handleAplyQuery = () => {
    console.log(currentQuery);
        if (!dreams || dreams.length === 0) return;
        // const keys = Object.keys(dreams[0]);

        const searchDreams = new Fuse(dreams, {
          keys: ["name", "description", "user.first_name", "user.last_name"],
          includeScore: true,
          threshold: 0.2,
        });

        const result = searchDreams.search(currentQuery);
        console.log(result, dreamsForShow)
        setDreamsForShow(result.map(item => item.item));
        setSearchWith({
          page: "1",
          postsPerPage: String(+perPage - 1),
          category: category,
          query: currentQuery,
        });
        setCurrentQuery('');
  }

  //#endregion
console.log(showCompleted)
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
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  handleAplyQuery();
                }
              }}
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

          <div className="dreams-gallery__control-second-line">
            <FormControl className="dreams-gallery__show-all">
              <FormControlLabel
                control={
                  <Checkbox
                    checked={!showCompleted}
                    onChange={(e) => setShowCompleted(!e.target.checked)}
                  />
                }
                label="hide completed"
              />
            </FormControl>
            {searchParams.get("query") && (
              <p className="dreams-gallery__search-result">
                <span>
                  Results for <strong>{searchParams.get("query")}</strong>
                </span>
                <IconButton
                  size="small"
                  onClick={() => {
                    setSearchWith({ page: "1", query: "" });
                    window.location.reload();
                  }}
                >
                  <CloseIcon />
                </IconButton>
              </p>
            )}
          </div>
        </form>

        <div className="dreams-gallery__content">
          {user && (
            <div className="dreams-gallery__item">
              <Link
                to={`/profile/${user}/create`}
                className="profile__add-dream-btn dream-cart"
                style={{
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "18",
                  letterSpacing: "2px",
                }}
              >
                Add a new dream
              </Link>
            </div>
          )}

          {dreamsForShow &&
            dreamsForShow
              .slice(
                user
                  ? (+perPage - 1) * (+page - 1)
                  : (+perPage) * (+page - 1),
                Math.min(user ? +page * (+perPage - 1) : +page * +perPage, dreams.length)
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