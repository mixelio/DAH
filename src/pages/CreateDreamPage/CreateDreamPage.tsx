import {ChangeEvent, useEffect, useRef, useState} from "react";

interface OptionType {
  description: string;
}

import CameraAltIcon from "@mui/icons-material/CameraAlt";
import {Autocomplete, Button, FormControl, InputAdornment, InputLabel, MenuItem, Select, SelectChangeEvent, TextField} from "@mui/material";
import {DreamCategory} from "../../types/Dream";
import LoadingButton from "@mui/lab/LoadingButton";
import {useAppDispatch, useAppSelector} from "../../app/hooks";
import {dreamCreateInit} from "../../features/dreamsFeature";
import {useLocation, useNavigate, useParams} from "react-router-dom";

export const CreateDreamPage = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const dispatch = useAppDispatch();
  const {dreams} = useAppSelector(store => store.dreams);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const categorySelectRef = useRef<HTMLSelectElement | null>(null);
  const { id } = useParams();
  const location = useLocation();
  const pathSegments = location.pathname.split("/");
  const slug = pathSegments[pathSegments.length - 1];

  const [category, setCategory] = useState<DreamCategory>(
    DreamCategory.Money_donation
  );

  const [options, setOptions] = useState<OptionType[]>([]);
  const [inputValue, setInputValue] = useState<string>("");
  const [selectedCity, setSelectedCity] = useState<string | null>(null);

  const navigate = useNavigate();

  useEffect(() => {
    if(!inputValue) {
      setOptions([]);
      return;
    }

    const autocompleteService = new google.maps.places.AutocompleteService();

    autocompleteService.getPlacePredictions(
      { input: inputValue, types: ["(cities)"] },
      (predictions, status) => {
        if (status === google.maps.places.PlacesServiceStatus.OK && predictions) {
          setOptions(predictions?.map(p => ({ description: p.description})));
        } else {
          setOptions([]);
        }
      }
    )
  }, [inputValue]);

  useEffect(() => {
    const user = localStorage.getItem("currentUser");
    console.log(user, dreams, id);
    if(user && id && user !== id && slug === "create") {
      navigate(`/profile/${id}`);
    }

    if(user && id && dreams.length > 0) {
      const userDreams = dreams.filter(dream => dream.user?.id === +user)
      console.log(userDreams);

      if(userDreams.find(dream => dream.id === +id)) {
        console.log("dream owner here")
      } else {
        console.log("you are not owner of this dream")
      }
    }
    
    if (slug === "create") {
      console.log("create page")
    } else {
      console.log("edit page")
    }

  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
  

  const handleButtonClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    

    if (file) {
      setSelectedFile(file);

      const reader = new FileReader();

      reader.onload = () => {
        setPreviewUrl(reader.result as string);
      };

      reader.readAsDataURL(file);
    }
  };

  const handleChangeCategory = (event: SelectChangeEvent) => {
    setCategory(event.target.value as DreamCategory);
  };

  const handleCreateDreamSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    const chekTocken = localStorage.getItem("access");
    e.preventDefault();
    const keys = ["name", "category", "cost", "description", "image", "location"];
    const currentData: { [key: string]: string | number | DreamCategory} = {};

    keys.forEach(key => {
      const value = e.currentTarget[key] !== undefined ? e.currentTarget[key].value : "";
      
      if (value !== "" && value !== undefined) {
        currentData[key] = value;
      }
    });

    setLoading(true);
    const formData = new FormData();

    try {
      if(!chekTocken) {
        return;
      }

      Object.entries(currentData).forEach(([key, value]) => {
        if(key !== "image") {
          if (value) {
            formData.append(key, value.toString());
          }
        } else {
          console.log("image")
          console.log(selectedFile);
          if (selectedFile) {
            formData.append(key, selectedFile);
          }
        }
      });

      dispatch(dreamCreateInit({
        data: formData,
        token: chekTocken 
      }));

    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
      navigate(`/profile/${id}`);
    }
  };

  return (
    <section className="create-dream page__section">
      <div className="container">
        <div className="create-dream__content">
          <h2 className="title create-dream__title">Creating new dream</h2>

          <form
            className="create-dream__form"
            onSubmit={handleCreateDreamSubmit}
          >
            <div className="create-dream__image-block">
              {selectedFile ? (
                <img
                  src={previewUrl ?? ""}
                  alt=""
                  className="create-dream__image"
                />
              ) : (
                <div className="create-dream__image-placeholder">
                  <CameraAltIcon
                    sx={{ width: "50%", height: "50%", objectPosition: "50%" }}
                  />
                </div>
              )}

              <div className="create-dream__load-area">
                <Button
                  color="primary"
                  className="create-dream__load-button"
                  onClick={handleButtonClick}
                >
                  Load image
                </Button>
                <input
                  type="file"
                  name="image"
                  accept="image/*"
                  ref={fileInputRef}
                  style={{ display: "none" }}
                  onChange={handleFileChange}
                />
              </div>
            </div>

            <div className="create-dream__info-block">
              <FormControl fullWidth className="create-dream__form-control">
                <InputLabel
                  htmlFor="dream-name"
                  sx={{ border: "none", borderRadius: "20" }}
                ></InputLabel>
                <TextField
                  required
                  id="dream-name"
                  label="Dream name"
                  variant="outlined"
                  name="name"
                />
              </FormControl>
              <FormControl fullWidth className="create-dream__form-control">
                <InputLabel
                  id="category-select"
                  sx={{ border: "none", borderRadius: "20" }}
                >
                  Category*
                </InputLabel>
                <Select
                  ref={categorySelectRef}
                  required
                  name="category"
                  labelId="category-select"
                  id="simple-select"
                  defaultValue={DreamCategory.Money_donation}
                  value={category}
                  sx={{ border: "none", borderRadius: "20" }}
                  label="Category*"
                  onChange={handleChangeCategory}
                >
                  <MenuItem value={DreamCategory.Money_donation}>
                    Money donation
                  </MenuItem>
                  <MenuItem value={DreamCategory.Volunteer_services}>
                    Volunteer services
                  </MenuItem>
                  <MenuItem value={DreamCategory.Gifts}>
                    Gifts
                  </MenuItem>
                </Select>
              </FormControl>
              <FormControl fullWidth className="create-dream__form-control">
                <InputLabel
                  htmlFor="location"
                  sx={{ border: "none", borderRadius: "20" }}
                ></InputLabel>
                <Autocomplete
                  options={options}
                  getOptionLabel={(option) => option.description}
                  onInputChange={(_event, value) => setInputValue(value)}
                  onChange={(_event, value) => {
                    const sity = value?.description || null;
                    setSelectedCity(sity);
                    // setDataForCreate((prev) => ({
                    //   ...prev,
                    //   location: sity || "",
                    // }));
                  }}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      required
                      placeholder="Start enter a city"
                      value={selectedCity}
                      id="location"
                      label="Location"
                      variant="outlined"
                      name="location"
                    />
                  )}
                />
              </FormControl>
              <FormControl 
                fullWidth className="create-dream__form-control"
              >
                <InputLabel
                  htmlFor="dream-cost"
                  sx={{ border: "none", borderRadius: "20" }}
                ></InputLabel>
                <TextField
                  required
                  id="dream-cost"
                  label="Dream cost"
                  variant="outlined"
                  name="cost"
                  type="number"
                  slotProps={{
                    input: {
                      endAdornment: (
                        <InputAdornment position="end">$</InputAdornment>
                      ),
                    },
                  }}
                />
              </FormControl>
              <FormControl fullWidth className="create-dream__form-control">
                <InputLabel
                  htmlFor="dream-description"
                  sx={{ border: "none", borderRadius: "20" }}
                ></InputLabel>
                <TextField
                  required
                  id="dream-description"
                  label="Dream description"
                  variant="outlined"
                  name="description"
                  multiline
                  rows={5}
                />
              </FormControl>
            </div>
            {loading ? (
              <LoadingButton loading variant="contained">
                Create Dream
              </LoadingButton>
            ) : (
              <Button
                type="submit"
                variant="contained"
                color="primary"
                className="create-dream__button"
              >
                Create Dream
              </Button>
            )}
          </form>
        </div>
      </div>
    </section>
  );
}