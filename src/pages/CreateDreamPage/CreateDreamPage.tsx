import {ChangeEvent, useEffect, useRef, useState} from "react";

interface OptionType {
  description: string;
}

import CameraAltIcon from "@mui/icons-material/CameraAlt";
import {Autocomplete, Button, FormControl, InputAdornment, InputLabel, MenuItem, Select, SelectChangeEvent, TextField} from "@mui/material";
import {Dream, DreamCategory} from "../../types/Dream";
import {useAppDispatch, useAppSelector} from "../../app/hooks";
import {currentDreamInit, dreamCreateInit} from "../../features/dreamsFeature";
import {useLocation, useNavigate, useParams} from "react-router-dom";
import {editCurrentDream} from "../../features/currentDreamFeature";

export const CreateDreamPage = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const dispatch = useAppDispatch();
  const {dreams} = useAppSelector(store => store.dreams);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [editingDream, setEditingDream] = useState<Dream | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const categorySelectRef = useRef<HTMLSelectElement | null>(null);
  const { id } = useParams();
  const location = useLocation();
  const pathSegments = location.pathname.split("/");
  const slug = pathSegments[pathSegments.length - 1];

  // const [category, setCategory] = useState<DreamCategory>(
  //   DreamCategory.Money_donation
  // );

  const [options, setOptions] = useState<OptionType[]>([]);
  const [inputValue, setInputValue] = useState<string>("");

  const [editingData, setEditingData] = useState({
    image: editingDream?.image_url ?? "",
    name: editingDream?.name ?? "",
    category: editingDream?.category ?? "",
    location: editingDream?.location ?? "",
    cost: editingDream?.cost ?? "1",
    description: editingDream?.description ?? ""
  });

  const navigate = useNavigate();

  useEffect(() => {
    const fetchCurrentDream = async (id: number) => {
      setLoading(true)
      try {
        const dream = await dispatch(currentDreamInit(id));

        setEditingDream(dream.payload as Dream);
        
      } catch (e) {
        console.error(e)
      } finally {
        setLoading(false)
      }
    };

    if(id) {
      fetchCurrentDream(+id);
    }
    
  }, [id, dispatch])

  // useEffect(() => {
  //   if(editingDream) {
  //       setEditingData((prevState) => ({
  //         ...prevState,
  //         image: editingDream.image_url ?? "",
  //         name: editingDream.name ?? "",
  //         category: editingDream.category ?? "",
  //         location: editingDream.location ?? "",
  //         cost: editingDream.cost ?? 0,
  //         description: editingDream.description ?? "",
  //       }));
  //       setInputValue(editingDream.location)
  //   }
  // }, [editingDream])

  useEffect(() => {
  }, [editingDream])

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
    if(user && id && user !== id && slug === "create") {
      navigate(`/profile/${id}`);
    }
    
    if (slug === "create") {
      console.log("create page");
    } else {
      console.log("edit page");
      const editingDream = dreams.find((dream) =>
        dream && id ? +dream.id === +id : null
      );

      if(editingDream) {
        setPreviewUrl(editingDream.image_url);
        setEditingData({
          image: editingDream.image_url,
          name: editingDream.name,
          category: editingDream.category,
          location: editingDream.location,
          cost: editingDream.cost,
          description: editingDream.description,
        });
        setPreviewUrl(editingDream.image_url);
        setInputValue(editingDream.location);
      }

      

      if (user && id && dreams.length > 0) {
        const userDreams = dreams.filter(
          (dream) => dream.user?.id === +user
        );

        if (!userDreams.find((dream) => dream.id === +id)) {
          navigate(`/dreams/${id}`);
        }
      }
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
    setEditingData(prev => ({...prev, category: event.target.value}))
    // setCategory(event.target.value as DreamCategory);
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

  const handleEditDreamSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
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
      if (!chekTocken) {
        return;
      }

      Object.entries(currentData).forEach(([key, value]) => {
        if (key !== "image") {
          if (value) {
            formData.append(key, value.toString());
          }
        } else {
          if (selectedFile) {
            formData.append(key, selectedFile);
          }
        }
      });

      if(id) {
        dispatch(
          editCurrentDream({
            dreamId: +id,
            data: formData,
            token: chekTocken,
          })
        );
      }

    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
      navigate(`/dreams/${id}`);
    }
}

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (slug.localeCompare("create")) {
      handleEditDreamSubmit(e);
    } else {
      handleCreateDreamSubmit(e);
    }
  }

  return (
    <section className="create-dream page__section">
      <div className="container">
        <div className="create-dream__content">
          <h2 className="title create-dream__title">
            {slug.localeCompare("edit")
              ? "Creating new Dream"
              : "Editing the Dream"}
          </h2>

          <form className="create-dream__form" onSubmit={handleSubmit}>
            <div className="create-dream__image-block">
              {selectedFile ? (
                <img
                  src={previewUrl ?? ""}
                  alt=""
                  className="create-dream__image"
                />
              ) : slug.localeCompare("create") && editingData.image ? (
                <img
                  src={editingData.image}
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
                  value={editingData.name}
                  id="dream-name"
                  label="Dream name"
                  variant="outlined"
                  name="name"
                  onChange={(e) =>
                    setEditingData((prev) => ({
                      ...prev,
                      name: e.target.value,
                    }))
                  }
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
                  defaultValue={
                    editingDream?.category ?? DreamCategory.Money_donation
                  }
                  value={editingData.category}
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
                  <MenuItem value={DreamCategory.Gifts}>Gifts</MenuItem>
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
                  inputValue={inputValue}
                  onInputChange={(_event, value) => {
                    if (value) {
                      setInputValue(value);
                    }
                  }}
                  onChange={(_event, value) => {
                    setInputValue(value?.description || "");
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
                      id="location"
                      label="Location"
                      variant="outlined"
                      name="location"
                    />
                  )}
                />
              </FormControl>
              {!editingData.category
                ?.toLowerCase()
                .localeCompare(DreamCategory.Money_donation.toLowerCase()) && (
                <FormControl fullWidth className="create-dream__form-control">
                  <InputLabel
                    htmlFor="dream-cost"
                    sx={{ border: "none", borderRadius: "20" }}
                  ></InputLabel>
                  <TextField
                    required
                    id="dream-cost"
                    value={editingData.cost}
                    label="Dream cost"
                    variant="outlined"
                    name="cost"
                    type="number"
                    onChange={(e) =>
                      +e.target.value >= 0
                        ? setEditingData((prev) => ({
                            ...prev,
                            cost: +e.target.value,
                          }))
                        : setEditingData((prev) => ({
                            ...prev,
                            cost: "",
                          }))
                    }
                    slotProps={{
                      input: {
                        endAdornment: (
                          <InputAdornment position="end">$</InputAdornment>
                        ),
                      },
                    }}
                  />
                </FormControl>
              )}

              <FormControl fullWidth className="create-dream__form-control">
                <InputLabel
                  htmlFor="dream-description"
                  sx={{ border: "none", borderRadius: "20" }}
                ></InputLabel>
                <TextField
                  required
                  id="dream-description"
                  value={editingData.description}
                  label="Dream description"
                  variant="outlined"
                  name="description"
                  multiline
                  rows={5}
                  onChange={(e) =>
                    setEditingData((prev) => ({
                      ...prev,
                      description: e.target.value,
                    }))
                  }
                />
              </FormControl>
            </div>
            <Button
              type="submit"
              loading={loading}
              variant="contained"
              color="primary"
              className="create-dream__button"
              sx={{ mr: ".625rem", width: "135px" }}
            >
              {slug} Dream
            </Button>
            <Button
              variant="contained"
              color="primary"
              className="create-dream__button"
              sx={{ width: "135px" }}
              onClick={() =>
                navigate(
                  slug.localeCompare("create")
                    ? `/dreams/${id}`
                    : `/profile/${id}`
                )
              }
            >
              Canel
            </Button>
          </form>
        </div>
      </div>
    </section>
  );
}