import React, { useEffect, useState } from "react";
import "./styles.scss";
import axios from "axios";
import RecipeGraph from "./RecipeGraph";
import Cookies from "js-cookie";
import MealCalendar from "./MealCalendar";
import Button from "./Button";
import moment from "moment";
import { Dropdown } from "semantic-ui-react";
import io from "socket.io-client";
import { socket } from "../hooks/useApplicationData";

const FavouritesItem1 = (props) => {
  const [date, setDate] = useState(null);
  const [meal, setMeal] = useState(null);

  const deleteFav = () => {
    const id = props.id;

    axios
      .post("/favourites/delete", { recipeId: id })
      .then((result) => {
        props.setUpdateItem(id);
      })
      .catch((error) => console.error(error));
  };

  // add a recipe to a given day
  const addRecipeToDay = (id, date, meal) => {
    const formatdate = JSON.stringify(date).slice(1, 11);
    const recipeId = id;

    axios
      .post("/day/add", {
        date: `${formatdate}`,
        recipeId: `${recipeId}`,
        mealNumber: `${meal}`,
      })
      .then((result) => {
        socket.emit("new", (data) => {
          console.log("Socket sending from addrecipe", data);
        });
        setDate(null);
      })
      .catch((error) => console.error(error));
  };

  const options = [
    { key: 1, text: "Breakfast", value: "1" },
    { key: 2, text: "Lunch", value: "2" },
    { key: 3, text: "Dinner", value: "3" },
    { key: 4, text: "Other", value: "4" },
  ];

  return (
    <>
      <div className="FavouritesItem">
        <div className="favourite-main">
          <div className="image-and-drop-container">
            <div className="image-container">
              <a href={`/recipe/${props.name}`}>
                <img src={props.image_url} />
              </a>
              {props.id && (
                <button className="delete-button-image" onClick={deleteFav}>
                  <i class="far fa-trash-alt"></i>
                </button>
              )}
            </div>
            <div className="selectContainer">
              <div className="selectPosition">
                <MealCalendar
                  date={date}
                  onChange={(e) => setDate(e.target.value)}
                />

                <div class="fav-button-container">
                  {date && (
                    <Dropdown
                      className="width"
                      options={options}
                      selection
                      onChange={(e, { value }) => setMeal(value)}
                    />
                  )}
                </div>
                {date && meal && (
                  <div className="fav-button-container">
                    <div className="add">
                      <Button
                        onClick={() => {
                          addRecipeToDay(props.id, date, meal);
                          setMeal(null);
                        }}
                      >
                        <i class="far fa-calendar-alt"></i> Add
                      </Button>
                    </div>
                    <div>
                      <button
                        className="delete-button"
                        onClick={() => {
                          setDate(null);
                          setMeal(null);
                        }}
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* <h1 className="FavouritesTitle">{props.name}</h1> */}
          <div>
            <RecipeGraph
              calories={props.calories}
              fat_in_g={props.fat_in_g}
              carbs_in_g={props.carbs_in_g}
              protein_in_g={props.protein_in_g}
              sugar_in_g={props.sugar_in_g}
              fiber_in_g={props.fiber_in_g}
              cholesterol_in_mg={props.cholesterol_in_mg}
              sodium_in_mg={props.sodium_in_mg}
              image_url={props.image_url}
              name={props.name}
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default FavouritesItem1;