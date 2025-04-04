import { ChangeEvent, useRef, useState } from "react";
import {
  FormControl,
  IconButton,
  InputAdornment,
  MenuItem,
  OutlinedInput,
  Select,
  SelectChangeEvent,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";

// search
// import Fuse from "fuse.js";
import { getSearchWith, SearchParams } from "../../utils/searchHelper";
import {useSearchParams} from "react-router-dom";
import {DreamCategory} from "../../types/Dream";

enum PostsPerPage {
  six = 6,
  tvelw = 12,
  tventyFour = 24,
}

export const DreamsFilter = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [currentQuery, setCurrentQuery] = useState<string>("");
  const currentQueryRef = useRef(null);
  const setSearchWith = (params: SearchParams) => {
      const search = getSearchWith(params, searchParams);
      setSearchParams(search);
    };
  const perPage =
    searchParams.get("postsPerPage") || PostsPerPage.six.toString();
  const category = searchParams.get("category") || DreamCategory.All;

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
      // if (!dreams || dreams.length === 0) return;
      // const keys = Object.keys(dreams[0]);

      // const searchDreams = new Fuse(dreams, {
      //   keys: ["name", "description", "user.first_name", "user.last_name"],
      //   includeScore: true,
      //   threshold: 0.2,
      // });

      // const result = searchDreams.search(currentQuery);

      // setDreamsForShow(result.map((item) => item.item));

      setSearchWith({
        page: "1",
        postsPerPage: perPage,
        category: category,
        query: currentQuery,
      });
      setCurrentQuery("");
    };
  return (
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
          <MenuItem value={PostsPerPage.tvelw}>{PostsPerPage.tvelw}</MenuItem>
          <MenuItem value={PostsPerPage.tventyFour}>
            {PostsPerPage.tventyFour}
          </MenuItem>
        </Select>
      </FormControl>
    </form>
  );
};
